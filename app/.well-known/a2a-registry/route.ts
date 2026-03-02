// app/.well-known/a2a-registry/route.ts
// A2A Registry Discovery Endpoint
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const registryInfo = {
    // Registry Identity
    registry_id: "a2a.aixc.store",
    name: "AIXC A2A Agent Registry",
    version: "1.0.0",
    description: "Public registry for AI agents following the A2A protocol",
    
    // Registry URLs
    base_url: "https://a2a.aixc.store",
    api_base: "https://a2a.aixc.store/api",
    documentation: "https://a2a.aixc.store/docs",
    
    // Capabilities
    capabilities: {
      agent_registration: true,
      agent_discovery: true,
      agent_search: true,
      public_registration: true,
      verified_registration: true,
    },
    
    // API Endpoints
    endpoints: {
      // Discovery
      list_agents: {
        method: "GET",
        path: "/api/agents",
        description: "List all active agents",
        parameters: ["capability", "search", "limit", "offset"],
        authentication: "none"
      },
      get_agent: {
        method: "GET",
        path: "/api/agents/{agent_id}",
        description: "Get agent details by ID",
        authentication: "none"
      },
      
      // Registration
      register_public: {
        method: "POST",
        path: "/api/agents/register-public",
        description: "Self-register an agent (no authentication required)",
        authentication: "none",
        rate_limit: {
          per_ip: "10 requests per hour",
          per_agent_id: "3 requests per day"
        },
        required_fields: ["agent_name", "agent_id", "endpoint"],
        optional_fields: ["description", "capabilities", "contact_email"]
      },
      register_verified: {
        method: "POST",
        path: "/api/agents/register",
        description: "Register an agent (requires user authentication)",
        authentication: "bearer_token",
        verified: true
      },
      
      // Management
      update_agent: {
        method: "POST",
        path: "/api/agents/update",
        description: "Update agent information",
        authentication: "api_key",
        required_headers: ["Authorization: Bearer {api_key}"]
      }
    },
    
    // Registration Requirements
    registration: {
      public: {
        enabled: true,
        verification: "post_moderation",
        rate_limits: true,
        returns_api_key: true
      },
      verified: {
        enabled: true,
        requires_account: true,
        verification: "immediate",
        returns_api_key: true
      }
    },
    
    // Protocol Compliance
    protocol: {
      name: "A2A",
      version: "1.0",
      compliance_level: "full"
    },
    
    // Statistics
    stats_endpoint: "/api/stats",
    
    // Contact & Support
    contact: {
      support_url: "https://a2a.aixc.store/docs",
      github: "https://github.com/shell9000/aixc-store"
    },
    
    // Terms
    terms: {
      trust_model: "post_moderation",
      data_retention: "indefinite",
      removal_policy: "on_request_or_abuse"
    }
  };

  return NextResponse.json(registryInfo, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
