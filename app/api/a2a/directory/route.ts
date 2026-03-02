// app/api/a2a/directory/route.ts
// A2A Agent Directory - List all A2A-compliant agents
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const capability = searchParams.get('capability');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Build query
    let query = supabase
      .from('agents')
      .select('agent_id, agent_name, description, version, service_url, agent_card, created_at', { count: 'exact' })
      .eq('active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Filter by search term
    if (search) {
      query = query.or(`agent_name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data: agents, error: agentsError, count } = await query;
    
    if (agentsError) {
      return NextResponse.json(
        { error: 'Failed to fetch agents', details: agentsError.message },
        { status: 500 }
      );
    }
    
    // Filter by capability if specified
    let filteredAgents = agents || [];
    if (capability) {
      const agentIds = filteredAgents.map(a => a.agent_id);
      
      // Get agents with the specified capability
      const { data: capabilityData } = await supabase
        .from('agent_capabilities')
        .select('agent_id')
        .in('agent_id', agentIds)
        .eq('capability', capability)
        .eq('enabled', true);
      
      const agentIdsWithCapability = new Set(capabilityData?.map(c => c.agent_id) || []);
      filteredAgents = filteredAgents.filter(a => agentIdsWithCapability.has(a.agent_id));
    }
    
    // Build response
    const result = {
      agents: filteredAgents.map(agent => ({
        id: agent.agent_id,
        name: agent.agent_name,
        description: agent.description,
        version: agent.version,
        serviceUrl: agent.service_url,
        agentCardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://a2a.aixc.store'}/api/a2a/agent-card?agent_id=${agent.agent_id}`,
        createdAt: agent.created_at,
      })),
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0),
      }
    };
    
    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      }
    });
    
  } catch (error: any) {
    console.error('Directory error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
