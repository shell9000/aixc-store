-- A2A Protocol Compliant Schema
-- Based on Google A2A Standard: https://a2a-protocol.org/latest/specification/

-- ============================================================================
-- Agents Table (Enhanced for A2A)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Agent Identity (A2A Standard)
  agent_id TEXT UNIQUE NOT NULL,
  agent_name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0' NOT NULL,
  
  -- Service Endpoint (A2A Standard)
  service_url TEXT NOT NULL, -- JSON-RPC 2.0 endpoint
  
  -- Agent Card (A2A Standard - full card as JSONB)
  agent_card JSONB NOT NULL,
  
  -- Legacy endpoint (for backward compatibility)
  endpoint TEXT,
  
  -- API Key for authentication
  api_key_hash TEXT UNIQUE NOT NULL,
  api_key_prefix TEXT NOT NULL,
  
  -- Status
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  
  -- Registration metadata
  contact_email TEXT,
  registration_ip TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Agent Capabilities (A2A Standard)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agent_capabilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  capability TEXT NOT NULL, -- e.g., "streaming", "pushNotifications"
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, capability)
);

-- ============================================================================
-- Agent Skills (A2A Standard)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agent_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  description TEXT,
  input_modes JSONB, -- array of MIME types
  output_modes JSONB, -- array of MIME types
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, skill_id)
);

-- ============================================================================
-- Tasks (A2A Standard)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  
  -- Task Identity
  task_id TEXT UNIQUE NOT NULL, -- public task ID
  context_id TEXT, -- groups related tasks
  
  -- Task Status (A2A Standard)
  status TEXT NOT NULL DEFAULT 'working',
  -- Possible values: working, input_required, auth_required, completed, failed, canceled, rejected
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- Messages (A2A Standard)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  
  -- Message Identity
  message_id TEXT UNIQUE NOT NULL,
  
  -- Message Content (A2A Standard)
  role TEXT NOT NULL, -- 'user' or 'agent'
  parts JSONB NOT NULL, -- array of Part objects
  
  -- References
  context_id TEXT,
  reference_task_ids JSONB, -- array of task IDs
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Artifacts (A2A Standard)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.artifacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  
  -- Artifact Identity
  artifact_id TEXT UNIQUE NOT NULL,
  name TEXT,
  
  -- Content (A2A Standard)
  parts JSONB NOT NULL, -- array of Part objects
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Push Notification Configs (A2A Standard)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.push_notification_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  
  -- Config
  webhook_url TEXT NOT NULL,
  events JSONB, -- array of event types: ['status', 'artifact']
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Agent Stats
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agent_stats (
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE PRIMARY KEY,
  view_count INTEGER DEFAULT 0,
  connection_count INTEGER DEFAULT 0,
  task_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON public.agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_owner_id ON public.agents(owner_id);
CREATE INDEX IF NOT EXISTS idx_agents_active ON public.agents(active);
CREATE INDEX IF NOT EXISTS idx_agent_capabilities_agent_id ON public.agent_capabilities(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_skills_agent_id ON public.agent_skills(agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_task_id ON public.tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_context_id ON public.tasks(context_id);
CREATE INDEX IF NOT EXISTS idx_tasks_agent_id ON public.tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_messages_task_id ON public.messages(task_id);
CREATE INDEX IF NOT EXISTS idx_messages_context_id ON public.messages(context_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_task_id ON public.artifacts(task_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_stats ENABLE ROW LEVEL SECURITY;

-- Agents: Anyone can view active agents
CREATE POLICY "Anyone can view active agents" ON public.agents
  FOR SELECT USING (active = true);

-- Agents: Owners can manage their agents
CREATE POLICY "Owners can insert agents" ON public.agents
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update agents" ON public.agents
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete agents" ON public.agents
  FOR DELETE USING (auth.uid() = owner_id);

-- Capabilities: Anyone can view
CREATE POLICY "Anyone can view capabilities" ON public.agent_capabilities
  FOR SELECT USING (true);

-- Skills: Anyone can view
CREATE POLICY "Anyone can view skills" ON public.agent_skills
  FOR SELECT USING (true);

-- Tasks: Anyone can view (for now - can be restricted later)
CREATE POLICY "Anyone can view tasks" ON public.tasks
  FOR SELECT USING (true);

-- Messages: Anyone can view (for now - can be restricted later)
CREATE POLICY "Anyone can view messages" ON public.messages
  FOR SELECT USING (true);

-- Artifacts: Anyone can view (for now - can be restricted later)
CREATE POLICY "Anyone can view artifacts" ON public.artifacts
  FOR SELECT USING (true);

-- Stats: Anyone can view
CREATE POLICY "Anyone can view stats" ON public.agent_stats
  FOR SELECT USING (true);

-- ============================================================================
-- Triggers
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_notification_configs_updated_at
  BEFORE UPDATE ON public.push_notification_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
