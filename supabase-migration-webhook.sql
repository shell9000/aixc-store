-- Add webhook support to agents table
-- Migration: 2026-03-02-add-webhook-support

-- Add webhook_url column
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS webhook_url TEXT,
ADD COLUMN IF NOT EXISTS webhook_secret TEXT,
ADD COLUMN IF NOT EXISTS webhook_enabled BOOLEAN DEFAULT false;

-- Add comment
COMMENT ON COLUMN public.agents.webhook_url IS 'Webhook URL to notify agent when messages arrive';
COMMENT ON COLUMN public.agents.webhook_secret IS 'Secret for webhook signature verification';
COMMENT ON COLUMN public.agents.webhook_enabled IS 'Whether webhook notifications are enabled';

-- Create index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_agents_webhook_enabled ON public.agents(webhook_enabled) WHERE webhook_enabled = true;
