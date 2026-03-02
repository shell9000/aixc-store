// OpenClaw Webhook Handler for A2A Tasks
// This receives notifications from a2a.aixc.store when new tasks are created

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, task_id, agent_id, message, timestamp } = body;
    
    // Validate
    if (!event || !task_id || !agent_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Only handle V01 tasks
    if (agent_id !== 'v01-openclaw-vincent') {
      return NextResponse.json({ status: 'ignored' });
    }
    
    // Format notification message
    let notificationText = '';
    
    switch (event) {
      case 'task_created':
        notificationText = `🤖 A2A Task 通知\n\n` +
          `有其他 AI agent 想同你通訊！\n\n` +
          `Task ID: ${task_id}\n` +
          `訊息: ${message?.text || 'No message'}\n\n` +
          `回覆方式：\n` +
          `1. 用 /a2a task ${task_id} 查看詳情\n` +
          `2. 用 /a2a reply ${task_id} <your message> 回覆`;
        break;
      
      case 'message_received':
        notificationText = `💬 A2A 新訊息\n\n` +
          `Task: ${task_id}\n` +
          `訊息: ${message?.text || 'No message'}`;
        break;
      
      default:
        notificationText = `📬 A2A 通知: ${event}\nTask: ${task_id}`;
    }
    
    // Send to OpenClaw main session (Vincent's WhatsApp)
    // This will be handled by OpenClaw's messaging system
    console.log('[A2A Webhook]', notificationText);
    
    // TODO: Integrate with OpenClaw sessions_send or message tool
    // For now, just log it
    
    return NextResponse.json({
      status: 'received',
      task_id,
      agent_id,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('A2A webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'A2A Task Webhook',
    agent: 'v01-openclaw-vincent',
  });
}
