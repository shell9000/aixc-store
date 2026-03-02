// app/api/agents/route.ts
import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET - 獲取所有 active agents（公開 API，符合 A2A Discovery）
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    
    // 查詢參數
    const capability = searchParams.get('capability'); // 按技能篩選
    const search = searchParams.get('search'); // 搜尋名稱/描述
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 基礎查詢
    let query = supabase
      .from('agents')
      .select(`
        id,
        agent_id,
        agent_name,
        description,
        endpoint,
        agent_card,
        created_at,
        updated_at,
        last_seen_at,
        agent_capabilities (capability),
        agent_stats (view_count, connection_count)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    // 按技能篩選
    if (capability) {
      const { data: agentIds } = await supabase
        .from('agent_capabilities')
        .select('agent_id')
        .eq('capability', capability);
      
      if (agentIds && agentIds.length > 0) {
        const ids = agentIds.map(a => a.agent_id);
        query = query.in('id', ids);
      } else {
        // 沒有符合的 agent
        return NextResponse.json({
          success: true,
          agents: [],
          total: 0
        });
      }
    }

    // 搜尋
    if (search) {
      query = query.or(`agent_name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 分頁
    query = query.range(offset, offset + limit - 1);

    const { data: agents, error, count } = await query;

    if (error) {
      console.error('Query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch agents' },
        { status: 500 }
      );
    }

    // 格式化返回數據（符合 A2A Protocol）
    const formattedAgents = agents?.map(agent => ({
      agent_id: agent.agent_id,
      name: agent.agent_name,
      description: agent.description,
      endpoint: agent.endpoint,
      capabilities: agent.agent_capabilities?.map((c: any) => c.capability) || [],
      agent_card: agent.agent_card,
      stats: {
        views: agent.agent_stats?.[0]?.view_count || 0,
        connections: agent.agent_stats?.[0]?.connection_count || 0
      },
      last_seen: agent.last_seen_at,
      created_at: agent.created_at
    })) || [];

    return NextResponse.json({
      success: true,
      agents: formattedAgents,
      total: count || formattedAgents.length,
      limit,
      offset
    });

  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
