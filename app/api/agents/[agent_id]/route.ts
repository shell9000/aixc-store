// app/api/agents/[agent_id]/route.ts
import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET - 獲取單個 agent 詳情（公開 API）
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agent_id: string }> }
) {
  try {
    const supabase = createClient();
    const { agent_id } = await params;

    // 查詢 agent
    const { data: agent, error } = await supabase
      .from('agents')
      .select(`
        id,
        agent_id,
        agent_name,
        description,
        endpoint,
        agent_card,
        verified,
        created_at,
        updated_at,
        last_seen_at,
        agent_capabilities (capability),
        agent_stats (view_count, connection_count)
      `)
      .eq('agent_id', agent_id)
      .eq('active', true)
      .single();

    if (error || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // 增加瀏覽次數
    if (agent.agent_stats && agent.agent_stats.length > 0) {
      await supabase
        .from('agent_stats')
        .update({
          view_count: (agent.agent_stats[0].view_count || 0) + 1,
          last_updated: new Date().toISOString()
        })
        .eq('agent_id', agent.id);
    }

    // 格式化返回（符合 A2A Protocol Agent Card）
    const agentCard = {
      agent_id: agent.agent_id,
      name: agent.agent_name,
      description: agent.description || '',
      endpoint: agent.endpoint,
      capabilities: agent.agent_capabilities?.map((c: any) => c.capability) || [],
      verified: agent.verified,
      stats: {
        views: (agent.agent_stats?.[0]?.view_count || 0) + 1,
        connections: agent.agent_stats?.[0]?.connection_count || 0
      },
      last_seen: agent.last_seen_at,
      created_at: agent.created_at,
      updated_at: agent.updated_at,
      // 完整 Agent Card（如果有自定義欄位）
      ...agent.agent_card
    };

    return NextResponse.json({
      success: true,
      agent: agentCard
    });

  } catch (error) {
    console.error('Get agent detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
