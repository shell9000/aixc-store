// app/api/agents/register/route.ts
import { createClient } from '@/lib/supabase';
import { generateApiKey, hashApiKey, getApiKeyPrefix } from '@/lib/api-key';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    
    // 檢查用戶是否登入
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // 獲取請求數據
    const body = await req.json();
    const { agent_name, agent_id, description, endpoint, capabilities, agent_card } = body;

    // 驗證必填欄位
    if (!agent_name || !agent_id || !endpoint) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_name, agent_id, endpoint' },
        { status: 400 }
      );
    }

    // 檢查 agent_id 是否已存在
    const { data: existing } = await supabase
      .from('agents')
      .select('id')
      .eq('agent_id', agent_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Agent ID already exists' },
        { status: 409 }
      );
    }

    // 生成 API Key
    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);
    const apiKeyPrefix = getApiKeyPrefix(apiKey);

    // 建立 Agent Card (符合 A2A Protocol)
    const fullAgentCard = agent_card || {
      agent_id,
      name: agent_name,
      description: description || '',
      endpoint,
      capabilities: capabilities || [],
      version: '1.0',
      protocol: 'a2a'
    };

    // 插入 agent
    const { data: agent, error: insertError } = await supabase
      .from('agents')
      .insert({
        owner_id: user.id,
        agent_name,
        agent_id,
        description,
        endpoint,
        agent_card: fullAgentCard,
        api_key_hash: apiKeyHash,
        api_key_prefix: apiKeyPrefix,
        active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to register agent', details: insertError.message },
        { status: 500 }
      );
    }

    // 插入 capabilities
    if (capabilities && capabilities.length > 0) {
      const capabilityRecords = capabilities.map((cap: string) => ({
        agent_id: agent.id,
        capability: cap
      }));

      await supabase
        .from('agent_capabilities')
        .insert(capabilityRecords);
    }

    // 初始化統計
    await supabase
      .from('agent_stats')
      .insert({
        agent_id: agent.id,
        view_count: 0,
        connection_count: 0
      });

    // 返回結果（包含 API Key，只顯示一次）
    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        agent_id: agent.agent_id,
        agent_name: agent.agent_name,
        endpoint: agent.endpoint
      },
      api_key: apiKey, // ⚠️ 只返回一次，請妥善保存
      message: 'Agent registered successfully. Please save your API key, it will not be shown again.'
    });

  } catch (error) {
    console.error('Register agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
