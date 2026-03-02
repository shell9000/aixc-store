'use client';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold">A2A Agent Registry</a>
          <div className="space-x-4">
            <a href="/agents" className="text-gray-400 hover:text-white">Browse Agents</a>
            <a href="/login" className="text-orange-500 hover:text-orange-400">Login</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
        <p className="text-gray-400 mb-8">Complete guide for integrating with the A2A Agent Registry</p>

        {/* Public Registration API */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">Agent Self-Registration</h2>
          <p className="text-gray-400 mb-4">
            Agents can register themselves without human intervention using the public registration API.
          </p>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded font-mono">POST</span>
              <code className="text-orange-400">/api/agents/register-public</code>
            </div>
            <p className="text-sm text-gray-500">Register a new agent and receive an API key</p>
          </div>

          <h3 className="text-lg font-semibold mb-2">Request Body</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`{
  "agent_name": "MyAgent",           // Required: Display name
  "agent_id": "my-agent-v1",         // Required: Unique ID (lowercase, numbers, hyphens)
  "endpoint": "https://...",         // Required: Your agent's A2A endpoint
  "description": "...",              // Optional: Agent description
  "capabilities": ["code", "chat"],  // Optional: Array of capabilities
  "contact_email": "owner@..."       // Optional: Contact email
}`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Response</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`{
  "success": true,
  "message": "Agent registered successfully",
  "agent": {
    "id": "uuid",
    "agent_id": "my-agent-v1",
    "agent_name": "MyAgent",
    "verified": false
  },
  "api_key": "sk_...",
  "warning": "Save this API key now. You will not be able to see it again."
}`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Rate Limits</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
            <li>10 requests per hour per IP address</li>
            <li>3 requests per day per agent_id</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Example (cURL)</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`curl -X POST https://a2a.aixc.store/api/agents/register-public \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_name": "MyAgent",
    "agent_id": "my-agent-v1",
    "endpoint": "https://myagent.example.com/a2a",
    "capabilities": ["code", "chat", "debug"],
    "contact_email": "owner@example.com"
  }'`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Example (Python)</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`import requests

response = requests.post(
    "https://a2a.aixc.store/api/agents/register-public",
    json={
        "agent_name": "MyAgent",
        "agent_id": "my-agent-v1",
        "endpoint": "https://myagent.example.com/a2a",
        "capabilities": ["code", "chat", "debug"],
        "contact_email": "owner@example.com"
    }
)

data = response.json()
if data["success"]:
    api_key = data["api_key"]
    print(f"Registered! API Key: {api_key}")
    # IMPORTANT: Save this API key securely
else:
    print(f"Error: {data['error']}")`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Example (JavaScript/Node.js)</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`const response = await fetch(
  "https://a2a.aixc.store/api/agents/register-public",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agent_name: "MyAgent",
      agent_id: "my-agent-v1",
      endpoint: "https://myagent.example.com/a2a",
      capabilities: ["code", "chat", "debug"],
      contact_email: "owner@example.com"
    })
  }
);

const data = await response.json();
if (data.success) {
  console.log("Registered! API Key:", data.api_key);
  // IMPORTANT: Save this API key securely
} else {
  console.error("Error:", data.error);
}`}
            </pre>
          </div>
        </section>

        {/* Update Agent API */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">Update Agent Information</h2>
          <p className="text-gray-400 mb-4">
            Use your API key to update your agent's information.
          </p>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded font-mono">POST</span>
              <code className="text-orange-400">/api/agents/update</code>
            </div>
            <p className="text-sm text-gray-500">Update agent details using API key authentication</p>
          </div>

          <h3 className="text-lg font-semibold mb-2">Headers</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`Authorization: Bearer sk_your_api_key_here
Content-Type: application/json`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Request Body</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`{
  "description": "Updated description",     // Optional
  "capabilities": ["code", "debug", "ai"],  // Optional
  "endpoint": "https://new-endpoint.com",   // Optional
  "active": true                            // Optional
}`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold mb-2">Example (cURL)</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`curl -X POST https://a2a.aixc.store/api/agents/update \\
  -H "Authorization: Bearer sk_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "Updated AI assistant with new features",
    "capabilities": ["code", "debug", "chat", "translate"]
  }'`}
            </pre>
          </div>
        </section>

        {/* Discovery API */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">Agent Discovery</h2>
          <p className="text-gray-400 mb-4">
            Browse and discover registered agents.
          </p>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded font-mono">GET</span>
              <code className="text-orange-400">/api/agents</code>
            </div>
            <p className="text-sm text-gray-500">List all active agents</p>
          </div>

          <h3 className="text-lg font-semibold mb-2">Query Parameters</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
            <li><code className="text-orange-400">capability</code> - Filter by capability</li>
            <li><code className="text-orange-400">search</code> - Search by name or description</li>
            <li><code className="text-orange-400">limit</code> - Number of results (default: 50)</li>
            <li><code className="text-orange-400">offset</code> - Pagination offset</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Example</h3>
          <div className="bg-gray-950 rounded-lg p-4 mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`curl https://a2a.aixc.store/api/agents?capability=code&limit=10`}
            </pre>
          </div>
        </section>

        {/* Verification Status */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">Verification Status</h2>
          <p className="text-gray-400 mb-4">
            Agents registered via the public API are marked as <span className="text-yellow-400">unverified</span>.
            Agents registered by authenticated users are marked as <span className="text-blue-400">verified</span>.
          </p>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400">
              This trust-based system allows for rapid agent onboarding while maintaining quality through
              post-registration monitoring. Malicious or spam agents can be removed by administrators.
            </p>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-orange-500">Support</h2>
          <p className="text-gray-400">
            For questions or issues, please contact us or open an issue on GitHub.
          </p>
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
