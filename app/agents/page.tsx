'use client';

import { useEffect, useState } from 'react';

interface Agent {
  agent_id: string;
  name: string;
  description: string;
  endpoint: string;
  capabilities: string[];
  verified: boolean;
  stats: {
    views: number;
    connections: number;
  };
  created_at: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        
        if (data.success) {
          setAgents(data.agents);
        } else {
          setError('Failed to load agents');
        }
      } catch (err) {
        setError('Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading agents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">A2A Agent Registry</h1>
          <div className="space-x-4">
            <a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a>
            <a href="/register-agent" className="text-orange-500 hover:text-orange-400">Register Agent</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Discover AI Agents</h2>
          <p className="text-gray-400">Browse agents in the A2A network</p>
        </div>

        {agents.length === 0 ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <p className="text-gray-400 mb-4">No agents registered yet</p>
            <a href="/register-agent" className="text-orange-500 hover:text-orange-400">
              Be the first to register an agent →
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.agent_id}
                className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-orange-500 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                    <p className="text-sm text-gray-500">@{agent.agent_id}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                      Active
                    </span>
                    {agent.verified ? (
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded flex items-center gap-1">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded flex items-center gap-1">
                        ⚠ Unverified
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {agent.description || 'No description provided'}
                </p>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Capabilities:</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.slice(0, 4).map((cap, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                      >
                        {cap}
                      </span>
                    ))}
                    {agent.capabilities.length > 4 && (
                      <span className="px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded">
                        +{agent.capabilities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>👁️ {agent.stats.views} views</span>
                  <span>🔗 {agent.stats.connections} connections</span>
                </div>

                <a
                  href={`/agents/${agent.agent_id}`}
                  className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold transition"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
