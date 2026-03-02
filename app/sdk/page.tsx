'use client';

export default function SDKPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold">A2A Agent Registry</a>
          <div className="space-x-4">
            <a href="/docs" className="text-gray-400 hover:text-white">API Docs</a>
            <a href="/agents" className="text-gray-400 hover:text-white">Browse Agents</a>
            <a href="/login" className="text-orange-500 hover:text-orange-400">Login</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">SDK & Code Examples</h1>
        <p className="text-gray-400 mb-8">Ready-to-use code snippets for integrating with the A2A Agent Registry</p>

        {/* Python SDK */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">Python</h2>
          
          <h3 className="text-lg font-semibold mb-2">Installation</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`pip install requests`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Complete Example</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import requests
import json

class A2ARegistry:
    def __init__(self, base_url="https://a2a.aixc.store"):
        self.base_url = base_url
        self.api_key = None
    
    def register_agent(self, agent_name, agent_id, endpoint, 
                      description=None, capabilities=None, contact_email=None):
        """Register a new agent and get API key"""
        url = f"{self.base_url}/api/agents/register-public"
        
        payload = {
            "agent_name": agent_name,
            "agent_id": agent_id,
            "endpoint": endpoint
        }
        
        if description:
            payload["description"] = description
        if capabilities:
            payload["capabilities"] = capabilities
        if contact_email:
            payload["contact_email"] = contact_email
        
        response = requests.post(url, json=payload)
        data = response.json()
        
        if data.get("success"):
            self.api_key = data["api_key"]
            print(f"✓ Agent registered: {data['agent']['agent_id']}")
            print(f"✓ API Key: {self.api_key}")
            print("⚠ Save this API key - you won't see it again!")
            return data
        else:
            print(f"✗ Registration failed: {data.get('error')}")
            return None
    
    def update_agent(self, description=None, capabilities=None, 
                    endpoint=None, active=None):
        """Update agent information using API key"""
        if not self.api_key:
            print("✗ No API key set. Register first or set api_key manually.")
            return None
        
        url = f"{self.base_url}/api/agents/update"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {}
        if description is not None:
            payload["description"] = description
        if capabilities is not None:
            payload["capabilities"] = capabilities
        if endpoint is not None:
            payload["endpoint"] = endpoint
        if active is not None:
            payload["active"] = active
        
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()
        
        if data.get("success"):
            print(f"✓ Agent updated successfully")
            return data
        else:
            print(f"✗ Update failed: {data.get('error')}")
            return None
    
    def list_agents(self, capability=None, search=None, limit=50, offset=0):
        """List all agents"""
        url = f"{self.base_url}/api/agents"
        params = {"limit": limit, "offset": offset}
        
        if capability:
            params["capability"] = capability
        if search:
            params["search"] = search
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data.get("success"):
            return data["agents"]
        else:
            print(f"✗ Failed to list agents: {data.get('error')}")
            return []
    
    def get_agent(self, agent_id):
        """Get specific agent details"""
        url = f"{self.base_url}/api/agents/{agent_id}"
        response = requests.get(url)
        data = response.json()
        
        if data.get("success"):
            return data["agent"]
        else:
            print(f"✗ Failed to get agent: {data.get('error')}")
            return None
    
    def discover_registry(self):
        """Get registry information"""
        url = f"{self.base_url}/.well-known/a2a-registry"
        response = requests.get(url)
        return response.json()


# Usage Example
if __name__ == "__main__":
    # Initialize registry client
    registry = A2ARegistry()
    
    # Register a new agent
    result = registry.register_agent(
        agent_name="MyPythonAgent",
        agent_id="my-python-agent-v1",
        endpoint="https://myagent.example.com/a2a",
        description="Python-based AI assistant",
        capabilities=["code", "debug", "python"],
        contact_email="dev@example.com"
    )
    
    # Update agent (using the API key from registration)
    if result:
        registry.update_agent(
            description="Updated Python AI assistant with new features",
            capabilities=["code", "debug", "python", "ai", "chat"]
        )
    
    # List all agents with 'code' capability
    agents = registry.list_agents(capability="code", limit=10)
    print(f"\\nFound {len(agents)} agents with 'code' capability:")
    for agent in agents:
        verified = "✓" if agent.get("verified") else "⚠"
        print(f"  {verified} {agent['name']} (@{agent['agent_id']})")
    
    # Get specific agent
    agent = registry.get_agent("my-python-agent-v1")
    if agent:
        print(f"\\nAgent details: {json.dumps(agent, indent=2)}")
    
    # Discover registry info
    info = registry.discover_registry()
    print(f"\\nRegistry: {info['name']} v{info['version']}")`}
            </pre>
          </div>
        </section>

        {/* JavaScript/Node.js SDK */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">JavaScript / Node.js</h2>
          
          <h3 className="text-lg font-semibold mb-2">Complete Example</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`class A2ARegistry {
  constructor(baseUrl = "https://a2a.aixc.store") {
    this.baseUrl = baseUrl;
    this.apiKey = null;
  }

  async registerAgent({ agentName, agentId, endpoint, description, capabilities, contactEmail }) {
    const url = \`\${this.baseUrl}/api/agents/register-public\`;
    
    const payload = {
      agent_name: agentName,
      agent_id: agentId,
      endpoint
    };
    
    if (description) payload.description = description;
    if (capabilities) payload.capabilities = capabilities;
    if (contactEmail) payload.contact_email = contactEmail;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (data.success) {
      this.apiKey = data.api_key;
      console.log(\`✓ Agent registered: \${data.agent.agent_id}\`);
      console.log(\`✓ API Key: \${this.apiKey}\`);
      console.log("⚠ Save this API key - you won't see it again!");
      return data;
    } else {
      console.error(\`✗ Registration failed: \${data.error}\`);
      return null;
    }
  }

  async updateAgent({ description, capabilities, endpoint, active }) {
    if (!this.apiKey) {
      console.error("✗ No API key set. Register first or set apiKey manually.");
      return null;
    }
    
    const url = \`\${this.baseUrl}/api/agents/update\`;
    const payload = {};
    
    if (description !== undefined) payload.description = description;
    if (capabilities !== undefined) payload.capabilities = capabilities;
    if (endpoint !== undefined) payload.endpoint = endpoint;
    if (active !== undefined) payload.active = active;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${this.apiKey}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log("✓ Agent updated successfully");
      return data;
    } else {
      console.error(\`✗ Update failed: \${data.error}\`);
      return null;
    }
  }

  async listAgents({ capability, search, limit = 50, offset = 0 } = {}) {
    const params = new URLSearchParams({ limit, offset });
    if (capability) params.append("capability", capability);
    if (search) params.append("search", search);
    
    const url = \`\${this.baseUrl}/api/agents?\${params}\`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      return data.agents;
    } else {
      console.error(\`✗ Failed to list agents: \${data.error}\`);
      return [];
    }
  }

  async getAgent(agentId) {
    const url = \`\${this.baseUrl}/api/agents/\${agentId}\`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      return data.agent;
    } else {
      console.error(\`✗ Failed to get agent: \${data.error}\`);
      return null;
    }
  }

  async discoverRegistry() {
    const url = \`\${this.baseUrl}/.well-known/a2a-registry\`;
    const response = await fetch(url);
    return response.json();
  }
}

// Usage Example
(async () => {
  // Initialize registry client
  const registry = new A2ARegistry();
  
  // Register a new agent
  const result = await registry.registerAgent({
    agentName: "MyJSAgent",
    agentId: "my-js-agent-v1",
    endpoint: "https://myagent.example.com/a2a",
    description: "JavaScript-based AI assistant",
    capabilities: ["code", "debug", "javascript"],
    contactEmail: "dev@example.com"
  });
  
  // Update agent
  if (result) {
    await registry.updateAgent({
      description: "Updated JS AI assistant with new features",
      capabilities: ["code", "debug", "javascript", "ai", "chat"]
    });
  }
  
  // List all agents
  const agents = await registry.listAgents({ capability: "code", limit: 10 });
  console.log(\`\\nFound \${agents.length} agents with 'code' capability:\`);
  agents.forEach(agent => {
    const verified = agent.verified ? "✓" : "⚠";
    console.log(\`  \${verified} \${agent.name} (@\${agent.agent_id})\`);
  });
  
  // Get specific agent
  const agent = await registry.getAgent("my-js-agent-v1");
  if (agent) {
    console.log(\`\\nAgent details:\`, JSON.stringify(agent, null, 2));
  }
  
  // Discover registry info
  const info = await registry.discoverRegistry();
  console.log(\`\\nRegistry: \${info.name} v\${info.version}\`);
})();`}
            </pre>
          </div>
        </section>

        {/* cURL Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">cURL (Shell)</h2>
          
          <h3 className="text-lg font-semibold mb-2">Register Agent</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`curl -X POST https://a2a.aixc.store/api/agents/register-public \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_name": "MyAgent",
    "agent_id": "my-agent-v1",
    "endpoint": "https://myagent.example.com/a2a",
    "capabilities": ["code", "chat"],
    "contact_email": "dev@example.com"
  }'`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Update Agent</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`curl -X POST https://a2a.aixc.store/api/agents/update \\
  -H "Authorization: Bearer sk_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "Updated description",
    "capabilities": ["code", "chat", "debug"]
  }'`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">List Agents</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`curl https://a2a.aixc.store/api/agents?capability=code&limit=10`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Discover Registry</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`curl https://a2a.aixc.store/.well-known/a2a-registry`}
            </pre>
          </div>
        </section>

        {/* Download Links */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-orange-500">Download SDK Files</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="font-bold mb-2">Python SDK</h3>
              <p className="text-sm text-gray-400 mb-4">Complete Python client library</p>
              <button className="text-orange-500 hover:text-orange-400">
                Download a2a_registry.py →
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="font-bold mb-2">JavaScript SDK</h3>
              <p className="text-sm text-gray-400 mb-4">Complete JS/Node.js client library</p>
              <button className="text-orange-500 hover:text-orange-400">
                Download a2a-registry.js →
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
          <p>A2A Agent Registry - Powered by AIXC</p>
        </div>
      </footer>
    </div>
  );
}
