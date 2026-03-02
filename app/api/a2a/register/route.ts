// app/api/a2a/register/route.ts
// A2A-compliant Agent Registration
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateApiKey, hashApiKey, getApiKeyPrefix } from '@/lib/api-key';
import { AgentCard } from '@/lib/a2a-types';

export const dynamic = 'force-dynamic';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting: 10 requests per hour per IP
    if (!checkRateLimit(`ip:${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    const body = await req.json();
    const { agent_id, agent_name, description, service_url, capabilities, skills } = body;
    
    // Validate required fields
    if (!agent_id || !agent_name || !service_url) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_id, agent_name, service_url' },
        { status: 400 }
      );
    }
    
    // Validate agent_id format
    if (!/^[a-z0-9-]+$/.test(agent_id)) {
      return NextResponse.json(
        { error: 'agent_id must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }
    
    // Rate limiting per agent_id
    if (!checkRateLimit(`agent:${agent_id}`, 3, 24 * 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'This agent_id has reached the daily registration limit' },
        { status: 429 }
      );
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Check if agent_id exists
    const { data: existing } = await supabase
      .from('agents')
      .select('agent_id')
      .eq('agent_id', agent_id)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: 'Agent ID already exists' },
        { status: 409 }
      );
    }
    
    // Generate API key
    const apiKey = generateApiKey();
    const hashedKey = hashApiKey(apiKey);
    const keyPrefix = getApiKeyPrefix(apiKey);
    
    // Build Agent Card (A2A Standard)
    const agentCard: AgentCard = {
      id: agent_id,
      name: agent_name,
      description: description || '',
      version: '1.0',
      serviceUrl: service_url,
      capabilities: {
        streaming: capabilities?.includes('streaming') || false,
        pushNotifications: capabilities?.includes('pushNotifications') || false,
        extendedAgentCard: capabilities?.includes('extendedAgentCard') || false,
      },
      skills: skills || [],
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        }
      },
      security: [{ apiKey: [] }],
    };
    
    // Insert agent
    const { data: agent, error: insertError } = await supabase
      .from('agents')
      .insert({
        agent_id,
        agent_name,
        description: description || null,
        version: '1.0',
        service_url,
        agent_card: agentCard,
        endpoint: service_url, // backward compatibility
        api_key_hash: hashedKey,
        api_key_prefix: keyPrefix,
        active: true,
        verified: false,
        registration_ip: ip,
      })
      .select('id, agent_id, agent_name, created_at')
      .single();
    
    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to register agent', details: insertError.message },
        { status: 500 }
      );
    }
    
    // Insert capabilities
    if (capabilities && Array.isArray(capabilities) && capabilities.length > 0) {
      const capabilityRecords = capabilities.map((cap: string) => ({
        agent_id: agent.id,
        capability: cap,
        enabled: true,
      }));
      
      await supabase
        .from('agent_capabilities')
        .insert(capabilityRecords);
    }
    
    // Insert skills
    if (skills && Array.isArray(skills) && skills.length > 0) {
      const skillRecords = skills.map((skill: any) => ({
        agent_id: agent.id,
        skill_id: skill.id,
        skill_name: skill.name,
        description: skill.description || null,
        input_modes: skill.inputModes || [],
        output_modes: skill.outputModes || [],
      }));
      
      await supabase
        .from('agent_skills')
        .insert(skillRecords);
    }
    
    // Initialize stats
    await supabase
      .from('agent_stats')
      .insert({
        agent_id: agent.id,
        view_count: 0,
        connection_count: 0,
        task_count: 0,
      });
    
    return NextResponse.json({
      success: true,
      message: 'Agent registered successfully',
      agent: {
        id: agent.agent_id,
        name: agent.agent_name,
        serviceUrl: service_url,
        agentCardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://a2a.aixc.store'}/api/a2a/agent-card?agent_id=${agent.agent_id}`,
        created_at: agent.created_at,
        verified: false,
      },
      api_key: apiKey,
      warning: 'Save this API key now. You will not be able to see it again.',
    });
    
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
