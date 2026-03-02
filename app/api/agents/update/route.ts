// app/api/agents/update/route.ts
import { createClient } from '@/lib/supabase';
import { hashApiKey, validateApiKeyFormat } from '@/lib/api-key';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    
    // 獲取 API Key from Authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header. Use: Bearer sk_...' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '').trim();

    // 驗證 API Key 格式
    if (!validateApiKeyFormat(apiKey)) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 401 }
      );
    }

    // Hash API Key 並查找 agent
    const apiKeyHash = hashApiKey(apiKey);
    
    const { data: agent, error: findError } = await supabase
      .from('agents')
      .select('*')
      .eq('api_key_hash', apiKeyHash)
      .single();

    if (findError || !agent) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // 獲取更新數據
    const body = await req.json();
    const { agent_card, description, capabilities, endpoint, active } = body;

    // 準備更新數據
    const updateData: any = {
      updated_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString()
    };

    if (agent_card) updateData.agent_card = agent_card;
    if (description !== undefined) updateData.description = description;
    if (endpoint) updateData.endpoint = endpoint;
    if (active !== undefined) updateData.active = active;

    // 更新 agent
    const { error: updateError } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', agent.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update agent', details: updateError.message },
        { status: 500 }
      );
    }

    // 更新 capabilities（如果提供）
    if (capabilities && Array.isArray(capabilities)) {
      // 刪除舊的 capabilities
      await supabase
        .from('agent_capabilities')
        .delete()
        .eq('agent_id', agent.id);

      // 插入新的 capabilities
      if (capabilities.length > 0) {
        const capabilityRecords = capabilities.map((cap: string) => ({
          agent_id: agent.id,
          capability: cap
        }));

        await supabase
          .from('agent_capabilities')
          .insert(capabilityRecords);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Agent updated successfully',
      agent: {
        id: agent.id,
        agent_id: agent.agent_id,
        agent_name: agent.agent_name,
        updated_at: updateData.updated_at
      }
    });

  } catch (error) {
    console.error('Update agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Agent 用 API Key 查詢自己的資料
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '').trim();
    const apiKeyHash = hashApiKey(apiKey);
    
    const { data: agent, error } = await supabase
      .from('agents')
      .select(`
        *,
        agent_capabilities (capability),
        agent_stats (*)
      `)
      .eq('api_key_hash', apiKeyHash)
      .single();

    if (error || !agent) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // 更新 last_seen_at
    await supabase
      .from('agents')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', agent.id);

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        agent_id: agent.agent_id,
        agent_name: agent.agent_name,
        description: agent.description,
        endpoint: agent.endpoint,
        agent_card: agent.agent_card,
        capabilities: agent.agent_capabilities.map((c: any) => c.capability),
        stats: agent.agent_stats,
        active: agent.active,
        created_at: agent.created_at,
        updated_at: agent.updated_at
      }
    });

  } catch (error) {
    console.error('Get agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
