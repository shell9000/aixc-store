// app/api/v01/rpc/route.ts
// V01 專屬的 A2A endpoint
// 接收其他 agent 的訊息，轉發到 OpenClaw/WhatsApp

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  JsonRpcRequest, 
  JsonRpcResponse, 
  JsonRpcErrorCode,
  A2AErrorCode,
  SendMessageRequest,
  GetTaskRequest,
  ListTasksRequest,
  CancelTaskRequest,
  Task,
  TaskStatus
} from '@/lib/a2a-types';

export const dynamic = 'force-dynamic';

// JSON-RPC 2.0 Error Response Helper
function jsonRpcError(id: string | number | null, code: number, message: string, data?: any): JsonRpcResponse {
  return {
    jsonrpc: '2.0',
    error: { code, message, data },
    id
  };
}

// JSON-RPC 2.0 Success Response Helper
function jsonRpcSuccess(id: string | number, result: any): JsonRpcResponse {
  return {
    jsonrpc: '2.0',
    result,
    id
  };
}

// Generate unique IDs
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(req: NextRequest) {
  try {
    // Parse JSON-RPC request
    const body = await req.json();
    
    // Validate JSON-RPC 2.0 format
    if (body.jsonrpc !== '2.0') {
      return NextResponse.json(
        jsonRpcError(null, JsonRpcErrorCode.INVALID_REQUEST, 'Invalid JSON-RPC version')
      );
    }
    
    if (!body.method || typeof body.method !== 'string') {
      return NextResponse.json(
        jsonRpcError(body.id || null, JsonRpcErrorCode.INVALID_REQUEST, 'Missing or invalid method')
      );
    }
    
    const request = body as JsonRpcRequest;
    
    // Get Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get V01's agent record
    const { data: v01Agent } = await supabase
      .from('agents')
      .select('id')
      .eq('agent_id', 'v01-openclaw-vincent')
      .single();
    
    if (!v01Agent) {
      return NextResponse.json(
        jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'V01 agent not found')
      );
    }
    
    // Route to method handlers
    switch (request.method) {
      case 'message/send':
        return await handleMessageSend(request, supabase, v01Agent.id);
      
      case 'task/get':
        return await handleTaskGet(request, supabase, v01Agent.id);
      
      case 'task/list':
        return await handleTaskList(request, supabase, v01Agent.id);
      
      case 'task/cancel':
        return await handleTaskCancel(request, supabase, v01Agent.id);
      
      default:
        return NextResponse.json(
          jsonRpcError(request.id, JsonRpcErrorCode.METHOD_NOT_FOUND, `Method not found: ${request.method}`)
        );
    }
    
  } catch (error: any) {
    console.error('V01 RPC error:', error);
    return NextResponse.json(
      jsonRpcError(null, JsonRpcErrorCode.INTERNAL_ERROR, 'Internal server error', error.message)
    );
  }
}

// ============================================================================
// Method Handlers
// ============================================================================

async function handleMessageSend(request: JsonRpcRequest, supabase: any, v01AgentId: string) {
  try {
    const params = request.params as SendMessageRequest;
    
    if (!params?.message) {
      return NextResponse.json(
        jsonRpcError(request.id, JsonRpcErrorCode.INVALID_PARAMS, 'Missing message parameter')
      );
    }
    
    const message = params.message;
    
    // Check if this is a reply to an existing task
    let task;
    let taskId: string;
    let contextId: string;
    
    if (message.taskId) {
      // Get existing task
      const { data: existingTask, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('task_id', message.taskId)
        .eq('agent_id', v01AgentId)
        .single();
      
      if (taskError || !existingTask) {
        return NextResponse.json(
          jsonRpcError(request.id, A2AErrorCode.TASK_NOT_FOUND, 'Task not found')
        );
      }
      
      task = existingTask;
      taskId = existingTask.task_id;
      contextId = existingTask.context_id;
    } else {
      // Create new task for V01
      taskId = generateId('task');
      contextId = message.contextId || generateId('ctx');
      
      const { data: newTask, error: taskError } = await supabase
        .from('tasks')
        .insert({
          agent_id: v01AgentId,
          task_id: taskId,
          context_id: contextId,
          status: 'working',
          metadata: params.metadata || {}
        })
        .select()
        .single();
      
      if (taskError) {
        return NextResponse.json(
          jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'Failed to create task', taskError.message)
        );
      }
      
      task = newTask;
    }
    
    // Generate message ID
    const messageId = message.id || generateId('msg');
    
    // Store message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        task_id: task.id,
        message_id: messageId,
        role: message.role,
        parts: message.parts,
        context_id: contextId,
        reference_task_ids: message.referenceTaskIds || [],
        metadata: message.metadata || {}
      });
    
    if (messageError) {
      return NextResponse.json(
        jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'Failed to store message', messageError.message)
      );
    }
    
    // Send notification to V01 (WhatsApp) - only for new messages from other agents
    if (message.role === 'user') {
      try {
        const webhookUrl = process.env.OPENCLAW_WEBHOOK_URL || 'https://a2a.aixc.store/api/webhook/a2a-task';
        
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: message.taskId ? 'message_received' : 'task_created',
            task_id: taskId,
            agent_id: 'v01-openclaw-vincent',
            message: {
              role: message.role,
              text: message.parts?.find((p: any) => p.type === 'text')?.text || 'New message',
            },
            timestamp: new Date().toISOString(),
          }),
        }).catch(err => console.error('Webhook failed:', err));
      } catch (err) {
        console.error('Notification error:', err);
      }
    }
    
    // Get message history
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('task_id', task.id)
      .order('created_at', { ascending: true });
    
    // Return task
    const result: Task = {
      id: taskId,
      contextId: contextId,
      status: task.status as TaskStatus,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      history: messages?.map((m: any) => ({
        id: m.message_id,
        role: m.role,
        parts: m.parts,
        contextId: m.context_id,
        taskId: taskId,
        metadata: m.metadata
      })) || [],
      artifacts: [],
      metadata: task.metadata
    };
    
    return NextResponse.json(jsonRpcSuccess(request.id, result));
    
  } catch (error: any) {
    return NextResponse.json(
      jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'Internal error', error.message)
    );
  }
}

async function handleTaskGet(request: JsonRpcRequest, supabase: any, v01AgentId: string) {
  try {
    const params = request.params as GetTaskRequest;
    
    if (!params?.id) {
      return NextResponse.json(
        jsonRpcError(request.id, JsonRpcErrorCode.INVALID_PARAMS, 'Missing task ID')
      );
    }
    
    // Get task (only V01's tasks)
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_id', params.id)
      .eq('agent_id', v01AgentId)
      .single();
    
    if (taskError || !task) {
      return NextResponse.json(
        jsonRpcError(request.id, A2AErrorCode.TASK_NOT_FOUND, 'Task not found')
      );
    }
    
    // Get messages (history)
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('task_id', task.id)
      .order('created_at', { ascending: true })
      .limit(params.historyLength || 100);
    
    // Get artifacts
    const { data: artifacts } = await supabase
      .from('artifacts')
      .select('*')
      .eq('task_id', task.id);
    
    // Build result
    const result: Task = {
      id: task.task_id,
      contextId: task.context_id,
      status: task.status as TaskStatus,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      history: messages?.map((m: any) => ({
        id: m.message_id,
        role: m.role,
        parts: m.parts,
        contextId: m.context_id,
        taskId: task.task_id,
        referenceTaskIds: m.reference_task_ids,
        metadata: m.metadata
      })) || [],
      artifacts: artifacts?.map((a: any) => ({
        id: a.artifact_id,
        name: a.name,
        parts: a.parts,
        createdAt: a.created_at,
        metadata: a.metadata
      })) || [],
      metadata: task.metadata
    };
    
    return NextResponse.json(jsonRpcSuccess(request.id, result));
    
  } catch (error: any) {
    return NextResponse.json(
      jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'Internal error', error.message)
    );
  }
}

async function handleTaskList(request: JsonRpcRequest, supabase: any, v01AgentId: string) {
  try {
    const params = request.params as ListTasksRequest;
    
    const pageSize = params?.pageSize || 50;
    const offset = 0;
    
    // Build query (only V01's tasks)
    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('agent_id', v01AgentId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
    
    if (params?.contextId) {
      query = query.eq('context_id', params.contextId);
    }
    
    if (params?.status) {
      query = query.eq('status', params.status);
    }
    
    const { data: tasks, error: tasksError, count } = await query;
    
    if (tasksError) {
      return NextResponse.json(
        jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'Failed to list tasks', tasksError.message)
      );
    }
    
    // Build result
    const result = {
      tasks: tasks?.map((t: any) => ({
        id: t.task_id,
        contextId: t.context_id,
        status: t.status as TaskStatus,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        metadata: t.metadata
      })) || [],
      nextPageToken: '',
      pageSize: pageSize,
      totalSize: count || 0
    };
    
    return NextResponse.json(jsonRpcSuccess(request.id, result));
    
  } catch (error: any) {
    return NextResponse.json(
      jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'Internal error', error.message)
    );
  }
}

async function handleTaskCancel(request: JsonRpcRequest, supabase: any, v01AgentId: string) {
  try {
    const params = request.params as CancelTaskRequest;
    
    if (!params?.id) {
      return NextResponse.json(
        jsonRpcError(request.id, JsonRpcErrorCode.INVALID_PARAMS, 'Missing task ID')
      );
    }
    
    // Get task (only V01's tasks)
    const { data: task, error: getError } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_id', params.id)
      .eq('agent_id', v01AgentId)
      .single();
    
    if (getError || !task) {
      return NextResponse.json(
        jsonRpcError(request.id, A2AErrorCode.TASK_NOT_FOUND, 'Task not found')
      );
    }
    
    // Check if cancelable
    const terminalStates = ['completed', 'failed', 'canceled', 'rejected'];
    if (terminalStates.includes(task.status)) {
      return NextResponse.json(
        jsonRpcError(request.id, A2AErrorCode.TASK_NOT_CANCELABLE, 'Task is not cancelable')
      );
    }
    
    // Update task status
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({ status: 'canceled' })
      .eq('task_id', params.id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json(
        jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'Failed to cancel task', updateError.message)
      );
    }
    
    // Build result
    const result: Task = {
      id: updatedTask.task_id,
      contextId: updatedTask.context_id,
      status: updatedTask.status as TaskStatus,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
      metadata: updatedTask.metadata
    };
    
    return NextResponse.json(jsonRpcSuccess(request.id, result));
    
  } catch (error: any) {
    return NextResponse.json(
      jsonRpcError(request.id, JsonRpcErrorCode.INTERNAL_ERROR, 'Internal error', error.message)
    );
  }
}
