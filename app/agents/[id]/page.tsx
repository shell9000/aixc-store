'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Agent {
  agent_id: string;
  agent_name: string;
  description: string;
  service_url: string;
  agent_card: any;
  verified: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  webhook_enabled?: boolean;
}

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/a2a/agent-card?agent_id=${agentId}`);
        
        if (!response.ok) {
          throw new Error('Agent not found');
        }
        
        const data = await response.json();
        setAgent(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load agent');
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading agent details...</p>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-black text-white">
        <nav className="bg-gray-900 shadow border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <a href="/agents" className="text-gray-400 hover:text-white">← Back to Agents</a>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Agent Not Found</h1>
          <p className="text-gray-400 mb-8">{error || 'The requested agent does not exist.'}</p>
          <a href="/agents" className="text-orange-500 hover:text-orange-400">
            Browse all agents →
          </a>
        </div>
      </div>
    );
  }

  const agentCard = agent.agent_card || agent;
  const skills = agentCard.skills || [];
  const capabilities = agentCard.capabilities || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/agents" className="text-gray-400 hover:text-white">← Back to Agents</a>
          <div className="space-x-4">
            <a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a>
            <a href="/register-agent" className="text-orange-500 hover:text-orange-400">Register Agent</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{agentCard.name || agent.agent_name}</h1>
              <p className="text-gray-500">@{agentCard.id || agent.agent_id}</p>
            </div>
            <div className="flex gap-2">
              {agent.active && (
                <span className="px-3 py-1 bg-green-900/30 text-green-400 text-sm rounded">
                  Active
                </span>
              )}
              {agent.verified ? (
                <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded flex items-center gap-1">
                  ✓ Verified
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 text-sm rounded flex items-center gap-1">
                  ⚠ Unverified
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-300 mb-6">
            {agentCard.description || agent.description || 'No description provided'}
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Service URL:</span>
              <p className="text-gray-300 font-mono text-xs break-all">
                {agentCard.serviceUrl || agent.service_url}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Version:</span>
              <p className="text-gray-300">{agentCard.version || '1.0'}</p>
            </div>
            <div>
              <span className="text-gray-500">Registered:</span>
              <p className="text-gray-300">
                {new Date(agent.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <p className="text-gray-300">
                {new Date(agent.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className={capabilities.streaming ? 'text-green-400' : 'text-gray-600'}>
                {capabilities.streaming ? '✓' : '✗'}
              </span>
              <span className="text-gray-300">Streaming</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={capabilities.pushNotifications ? 'text-green-400' : 'text-gray-600'}>
                {capabilities.pushNotifications ? '✓' : '✗'}
              </span>
              <span className="text-gray-300">Push Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={agent.webhook_enabled ? 'text-green-400' : 'text-gray-600'}>
                {agent.webhook_enabled ? '✓' : '✗'}
              </span>
              <span className="text-gray-300">Webhook Enabled</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="space-y-4">
              {skills.map((skill: any, idx: number) => (
                <div key={idx} className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {skill.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {skill.description}
                  </p>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Input:</span>
                      <span className="text-gray-300 ml-2">
                        {skill.inputModes?.join(', ') || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Output:</span>
                      <span className="text-gray-300 ml-2">
                        {skill.outputModes?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Information */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4">Connect to This Agent</h2>
          
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Agent Card URL</h3>
            <div className="bg-black rounded p-3 font-mono text-xs text-gray-300 break-all">
              https://a2a.aixc.store/api/a2a/agent-card?agent_id={agentCard.id || agent.agent_id}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Send Message (JSON-RPC 2.0)</h3>
            <div className="bg-black rounded p-3 font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`curl -X POST ${agentCard.serviceUrl || agent.service_url} \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [{"type": "text", "text": "Hello!"}]
      }
    },
    "id": 1
  }'`}</pre>
            </div>
          </div>

          <a
            href="/docs"
            className="inline-block text-orange-500 hover:text-orange-400 text-sm"
          >
            View full API documentation →
          </a>
        </div>
      </main>
    </div>
  );
}
