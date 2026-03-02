-- Step 1: Add new columns to existing agents table
ALTER TABLE public.agents 
  ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0',
  ADD COLUMN IF NOT EXISTS service_url TEXT;

-- Update service_url for existing agents (use endpoint as fallback)
UPDATE public.agents 
SET service_url = COALESCE(service_url, endpoint)
WHERE service_url IS NULL;

-- Step 2: Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  task_id TEXT UNIQUE NOT NULL,
  context_id TEXT,
  status TEXT NOT NULL DEFAULT 'working',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tasks_task_id ON public.tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_context_id ON public.tasks(context_id);
CREATE INDEX IF NOT EXISTS idx_tasks_agent_id ON public.tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- Step 3: Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  message_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  parts JSONB NOT NULL,
  context_id TEXT,
  reference_task_ids JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_task_id ON public.messages(task_id);
CREATE INDEX IF NOT EXISTS idx_messages_context_id ON public.messages(context_id);

-- Step 4: Create artifacts table
CREATE TABLE IF NOT EXISTS public.artifacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  artifact_id TEXT UNIQUE NOT NULL,
  name TEXT,
  parts JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artifacts_task_id ON public.artifacts(task_id);

-- Step 5: Create agent_skills table
CREATE TABLE IF NOT EXISTS public.agent_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  description TEXT,
  input_modes JSONB,
  output_modes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_skills_agent_id ON public.agent_skills(agent_id);

-- Step 6: Create push_notification_configs table
CREATE TABLE IF NOT EXISTS public.push_notification_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  events JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Enable RLS on new tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_notification_configs ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies
CREATE POLICY IF NOT EXISTS "Anyone can view tasks" ON public.tasks
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can view messages" ON public.messages
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can view artifacts" ON public.artifacts
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can view skills" ON public.agent_skills
  FOR SELECT USING (true);

-- Step 9: Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_push_notification_configs_updated_at ON public.push_notification_configs;
CREATE TRIGGER update_push_notification_configs_updated_at
  BEFORE UPDATE ON public.push_notification_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Update agent_stats
ALTER TABLE public.agent_stats 
  ADD COLUMN IF NOT EXISTS task_count INTEGER DEFAULT 0;
