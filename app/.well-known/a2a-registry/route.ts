// app/.well-known/a2a-registry/route.ts
// A2A Registry Discovery Endpoint (Updated for Google A2A Standard)
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const registryInfo = {
    // Registry Identity
    registry_id: "a2a.aixc.store",
    name: "AIXC A2A Agent Registry",
    version: "1.0.0",
    description: "Public registry for AI agents following the Google A2A protocol standard",
    
    // Registry URLs
    base_url: "https://a2a.aixc.store",
    api_base: "https://a2a.aixc.store/api/a2a",
    documentation: "https://a2a.aixc.store/docs",
    
    // Protocol Compliance
    protocol: {
      name: "A2A",
      version: "0.3",
      standard: "Google Agent2Agent Protocol",
      specification_url: "https://a2a-protocol.org/latest/specification/",
      compliance_level: "full"
    },
    
    // Capabilities
    capabilities: {
      agent_registration: true,
      agent_discovery: true,
      agent_search: true,
      public_registration: true,
      verified_registration: true,
      json_rpc_2_0: true,
      agent_cards: true,
      task_management: true,
    },
    
    // API Endpoints
    endpoints: {
      // A2A Standard Endpoints
      json_rpc: {
        method: "POST",
        path: "/api/a2a/rpc",
        description: "JSON-RPC 2.0 endpoint for A2A protocol methods",
        protocol: "JSON-RPC 2.0",
        methods: [
          "message/send",
          "task/get",
          "task/list",
          "task/cancel"
        ]
      },
      
      agent_card: {
        method: "GET",
        path: "/api/a2a/agent-card",
        description: "Get A2A-compliant Agent Card",
        parameters: ["agent_id"],
        authentication: "none"
      },
      
      directory: {
        method: "GET",
        path: "/api/a2a/directory",
        description: "List all A2A-compliant agents",
        parameters: ["capability", "search", "limit", "offset"],
        authentication: "none"
      },
      
      // Registration
      register: {
        method: "POST",
        path: "/api/a2a/register",
        description: "Register an A2A-compliant agent",
        authentication: "none",
        rate_limit: {
          per_ip: "10 requests per hour",
          per_agent_id: "3 requests per day"
        },
        required_fields: ["agent_id", "agent_name", "service_url"],
        optional_fields: ["description", "capabilities", "skills"]
      },
      
      // Legacy REST endpoints (backward compatibility)
      list_agents: {
        method: "GET",
        path: "/api/agents",
        description: "List all active agents (legacy)",
        authentication: "none"
      },
      
      get_agent: {
        method: "GET",
        path: "/api/agents/{agent_id}",
        description: "Get agent details by ID (legacy)",
        authentication: "none"
      },
    },
    
    // A2A Protocol Methods (JSON-RPC 2.0)
    a2a_methods: {
      "message/send": {
        description: "Send a message to an agent and create/continue a task",
        params: {
          message: "Message object with role and parts",
          configuration: "Optional SendMessageConfiguration",
          metadata: "Optional metadata object"
        },
        returns: "Task object or Message object"
      },
      
      "task/get": {
        description: "Get the current state of a task",
        params: {
          id: "Task ID",
          historyLength: "Optional number of messages to include"
        },
        returns: "Task object with history and artifacts"
      },
      
      "task/list": {
        description: "List tasks with optional filtering",
        params: {
          contextId: "Optional context ID filter",
          status: "Optional status filter",
          pageSize: "Optional page size (default 50)",
          pageToken: "Optional pagination token"
        },
        returns: "ListTasksResponse with tasks array"
      },
      
      "task/cancel": {
        description: "Cancel an ongoing task",
        params: {
          id: "Task ID",
          metadata: "Optional metadata"
        },
        returns: "Updated Task object"
      }
    },
    
    // Registration Requirements
    registration: {
      public: {
        enabled: true,
        verification: "post_moderation",
        rate_limits: true,
        returns_api_key: true,
        requires_a2a_compliance: true
      },
      verified: {
        enabled: true,
        requires_account: true,
        verification: "immediate",
        returns_api_key: true
      }
    },
    
    // Statistics
    stats_endpoint: "/api/stats",
    
    // Contact & Support
    contact: {
      support_url: "https://a2a.aixc.store/docs",
      github: "https://github.com/shell9000/aixc-store",
      discord: "https://discord.com/invite/clawd"
    },
    
    // Terms
    terms: {
      trust_model: "post_moderation",
      data_retention: "indefinite",
      removal_policy: "on_request_or_abuse",
      protocol_compliance: "Agents must implement Google A2A protocol standard"
    },
    
    // Related Standards
    related_standards: {
      mcp: {
        name: "Model Context Protocol",
        description: "A2A complements MCP by enabling agent-to-agent collaboration",
        url: "https://modelcontextprotocol.io"
      }
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
