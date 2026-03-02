// lib/webhook-sender.ts
// Send webhook notifications to agents
import crypto from 'crypto';

export interface WebhookPayload {
  event: 'message_received' | 'task_created' | 'task_updated' | 'task_completed';
  task_id: string;
  agent_id: string;
  message?: {
    role: string;
    text: string;
  };
  timestamp: string;
  [key: string]: any;
}

export async function sendWebhook(
  webhookUrl: string,
  webhookSecret: string | null,
  payload: WebhookPayload
): Promise<boolean> {
  try {
    const body = JSON.stringify(payload);
    
    // Generate signature if secret is provided
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'A2A-Registry/1.0',
    };
    
    if (webhookSecret) {
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      
      headers['X-Webhook-Signature'] = signature;
    }
    
    // Send webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      console.error(`Webhook failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    console.log(`✅ Webhook sent to ${webhookUrl}`);
    return true;
    
  } catch (error: any) {
    console.error(`Webhook error for ${webhookUrl}:`, error.message);
    return false;
  }
}

export async function notifyAgent(
  supabase: any,
  agentId: string,
  payload: WebhookPayload
): Promise<boolean> {
  try {
    // Get agent's webhook config
    const { data: agent } = await supabase
      .from('agents')
      .select('webhook_url, webhook_secret, webhook_enabled')
      .eq('id', agentId)
      .single();
    
    if (!agent || !agent.webhook_enabled || !agent.webhook_url) {
      console.log(`Agent ${agentId} has no webhook configured`);
      return false;
    }
    
    // Send webhook
    return await sendWebhook(
      agent.webhook_url,
      agent.webhook_secret,
      payload
    );
    
  } catch (error: any) {
    console.error(`Failed to notify agent ${agentId}:`, error.message);
    return false;
  }
}
