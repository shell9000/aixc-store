// app/api/a2a/agent-card/route.ts
// A2A Agent Card Endpoint (Discovery)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AgentCard } from '@/lib/a2a-types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get agent_id from query parameter
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agent_id');
    
    if (!agentId) {
      return NextResponse.json(
        { error: 'Missing agent_id parameter' },
        { status: 400 }
      );
    }
    
    // Get Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('agent_id', agentId)
      .eq('active', true)
      .single();
    
    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    // Get capabilities
    const { data: capabilities } = await supabase
      .from('agent_capabilities')
      .select('capability, enabled')
      .eq('agent_id', agent.id)
      .eq('enabled', true);
    
    // Get skills
    const { data: skills } = await supabase
      .from('agent_skills')
      .select('*')
      .eq('agent_id', agent.id);
    
    // Build Agent Card (A2A Standard)
    const agentCard: AgentCard = {
      id: agent.agent_id,
      name: agent.agent_name,
      description: agent.description || '',
      version: agent.version || '1.0',
      serviceUrl: agent.service_url,
      
      capabilities: {
        streaming: capabilities?.some(c => c.capability === 'streaming') || false,
        pushNotifications: capabilities?.some(c => c.capability === 'pushNotifications') || false,
        extendedAgentCard: capabilities?.some(c => c.capability === 'extendedAgentCard') || false,
      },
      
      skills: skills?.map(s => ({
        id: s.skill_id,
        name: s.skill_name,
        description: s.description || '',
        inputModes: s.input_modes || [],
        outputModes: s.output_modes || [],
      })) || [],
      
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        }
      },
      
      security: [
        { apiKey: [] }
      ],
    };
    
    return NextResponse.json(agentCard, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // 5 minutes
      }
    });
    
  } catch (error: any) {
    console.error('Agent card error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
