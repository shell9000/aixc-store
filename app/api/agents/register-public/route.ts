// app/api/agents/register-public/route.ts
// Public API for agents to self-register
import { createClient } from '@supabase/supabase-js';
import { generateApiKey, hashApiKey, getApiKeyPrefix } from '@/lib/api-key';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Rate limiting store (in-memory, for production use Redis)
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
    // Get IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting: 10 requests per hour per IP
    if (!checkRateLimit(`ip:${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Get request data
    const body = await req.json();
    const { agent_name, agent_id, description, endpoint, capabilities, contact_email } = body;

    // Validate required fields
    if (!agent_name || !agent_id || !endpoint) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_name, agent_id, endpoint' },
        { status: 400 }
      );
    }

    // Validate agent_id format (lowercase, numbers, hyphens only)
    if (!/^[a-z0-9-]+$/.test(agent_id)) {
      return NextResponse.json(
        { error: 'agent_id must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Rate limiting: 3 requests per day per agent_id
    if (!checkRateLimit(`agent:${agent_id}`, 3, 24 * 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'This agent_id has reached the daily registration limit.' },
        { status: 429 }
      );
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if agent_id already exists
    const { data: existingAgent } = await supabase
      .from('agents')
      .select('agent_id')
      .eq('agent_id', agent_id)
      .single();

    if (existingAgent) {
      return NextResponse.json(
        { error: 'Agent ID already exists' },
        { status: 409 }
      );
    }

    // Generate API key
    const apiKey = generateApiKey();
    const hashedKey = hashApiKey(apiKey);
    const keyPrefix = getApiKeyPrefix(apiKey);

    // Insert agent (without owner_id for public registration)
    const { data: agent, error: insertError } = await supabase
      .from('agents')
      .insert({
        agent_name,
        agent_id,
        description: description || null,
        endpoint,
        api_key_hash: hashedKey,
        api_key_prefix: keyPrefix,
        active: true,
        verified: false, // Mark as unverified
        contact_email: contact_email || null,
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
      const capabilityRecords = capabilities.map(cap => ({
        agent_id: agent.id,
        capability: cap
      }));

      await supabase
        .from('agent_capabilities')
        .insert(capabilityRecords);
    }

    // Return success with API key
    return NextResponse.json({
      success: true,
      message: 'Agent registered successfully',
      agent: {
        id: agent.id,
        agent_id: agent.agent_id,
        agent_name: agent.agent_name,
        created_at: agent.created_at,
        verified: false,
      },
      api_key: apiKey,
      warning: 'Save this API key now. You will not be able to see it again.',
    });

  } catch (error: any) {
    console.error('Register public error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
