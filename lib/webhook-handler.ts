// lib/webhook-handler.ts
// Webhook handler for notifying agents about new tasks

import { createClient } from '@supabase/supabase-js';

export interface WebhookConfig {
  url: string;
  method?: 'POST' | 'GET';
  headers?: Record<string, string>;
  events: ('task_created' | 'task_updated' | 'message_received')[];
}

export interface TaskNotification {
  event: 'task_created' | 'task_updated' | 'message_received';
  task_id: string;
  agent_id: string;
  message?: {
    id: string;
    role: string;
    parts: any[];
  };
  timestamp: string;
}

export async function sendWebhookNotification(
  config: WebhookConfig,
  notification: TaskNotification
): Promise<boolean> {
  try {
    const response = await fetch(config.url, {
      method: config.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AIXC-A2A-Registry/1.0',
        ...config.headers,
      },
      body: JSON.stringify(notification),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Webhook notification failed:', error);
    return false;
  }
}

export async function notifyAgentAboutTask(
  agentId: string,
  taskId: string,
  event: 'task_created' | 'task_updated' | 'message_received',
  message?: any
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get agent webhook config
  const { data: agent } = await supabase
    .from('agents')
    .select('agent_id, agent_card')
    .eq('id', agentId)
    .single();
  
  if (!agent?.agent_card?.webhook) {
    console.log('No webhook configured for agent:', agent?.agent_id);
    return false;
  }
  
  const webhook = agent.agent_card.webhook;
  
  // Check if this event type is enabled
  if (!webhook.events?.includes(event)) {
    return false;
  }
  
  const notification: TaskNotification = {
    event,
    task_id: taskId,
    agent_id: agent.agent_id,
    message,
    timestamp: new Date().toISOString(),
  };
  
  return await sendWebhookNotification(webhook, notification);
}

// For V01: Send notification to WhatsApp
export async function notifyV01ViaWhatsApp(
  taskId: string,
  message: any
): Promise<boolean> {
  // This will be called by the A2A platform
  // V01 will receive a WhatsApp message about the new task
  
  const notification = {
    type: 'a2a_task_notification',
    task_id: taskId,
    message: {
      role: message.role,
      text: message.parts?.find((p: any) => p.type === 'text')?.text || 'New task',
    },
    action_url: `https://a2a.aixc.store/api/a2a/rpc`,
  };
  
  // TODO: Integrate with OpenClaw messaging system
  // This should trigger a WhatsApp message to Vincent
  
  console.log('V01 notification:', notification);
  return true;
}
