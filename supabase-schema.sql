-- A2A Agent Registry Database Schema

-- Agents table
CREATE TABLE public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Agent Identity
  agent_name TEXT NOT NULL,
  agent_id TEXT UNIQUE NOT NULL, -- 唯一識別符 (e.g., "kiro-assistant")
  description TEXT,
  
  -- Agent Card (A2A Protocol)
  agent_card JSONB NOT NULL,
  endpoint TEXT NOT NULL, -- Agent 的 A2A endpoint
  
  -- API Key for Agent authentication
  api_key_hash TEXT UNIQUE NOT NULL,
  api_key_prefix TEXT NOT NULL, -- 顯示用 (e.g., "sk_abc...")
  
  -- Status
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent capabilities (技能標籤)
CREATE TABLE public.agent_capabilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  capability TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, capability)
);

-- Agent stats (統計)
CREATE TABLE public.agent_stats (
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE PRIMARY KEY,
  view_count INTEGER DEFAULT 0,
  connection_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_stats ENABLE ROW LEVEL SECURITY;

-- Policies for agents table
-- 所有人可以查看 active agents
CREATE POLICY "Anyone can view active agents" ON public.agents
  FOR SELECT USING (active = true);

-- 擁有者可以插入自己的 agent
CREATE POLICY "Users can insert own agents" ON public.agents
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 擁有者可以更新自己的 agent
CREATE POLICY "Users can update own agents" ON public.agents
  FOR UPDATE USING (auth.uid() = owner_id);

-- 擁有者可以刪除自己的 agent
CREATE POLICY "Users can delete own agents" ON public.agents
  FOR DELETE USING (auth.uid() = owner_id);

-- Policies for agent_capabilities
CREATE POLICY "Anyone can view capabilities" ON public.agent_capabilities
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage capabilities" ON public.agent_capabilities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.agents 
      WHERE agents.id = agent_capabilities.agent_id 
      AND agents.owner_id = auth.uid()
    )
  );

-- Policies for agent_stats
CREATE POLICY "Anyone can view stats" ON public.agent_stats
  FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for agents table
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_agents_agent_id ON public.agents(agent_id);
CREATE INDEX idx_agents_owner_id ON public.agents(owner_id);
CREATE INDEX idx_agents_active ON public.agents(active);
CREATE INDEX idx_agent_capabilities_agent_id ON public.agent_capabilities(agent_id);
CREATE INDEX idx_agent_capabilities_capability ON public.agent_capabilities(capability);
