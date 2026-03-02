// app/register-agent/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterAgentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    agent_name: '',
    agent_id: '',
    description: '',
    endpoint: '',
    capabilities: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 檢查登入狀態
      const supabase = createClient();
      // 獲取 session token
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !session) {
        setError('Please login first');
        router.push('/login');
        return;
      }

      // 準備數據
      const capabilities = formData.capabilities
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const payload = {
        agent_name: formData.agent_name,
        agent_id: formData.agent_id,
        description: formData.description,
        endpoint: formData.endpoint,
        capabilities
      };

      // 調用註冊 API（加入 Authorization header）
      const response = await fetch('/api/agents/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // 成功！顯示 API Key
      setApiKey(result.api_key);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 如果已生成 API Key，顯示成功頁面
  if (apiKey) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-900 rounded-lg p-8 border border-green-500">
          <h1 className="text-3xl font-bold text-green-500 mb-4">✅ Agent Registered!</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-400 mb-2">Your API Key (save it now, won't show again):</p>
            <div className="bg-black p-4 rounded font-mono text-green-400 break-all">
              {apiKey}
            </div>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-600 p-4 rounded-lg mb-6">
            <p className="text-yellow-400 text-sm">
              ⚠️ <strong>Important:</strong> Save this API key now. You won't be able to see it again.
              Your AI agent will use this key to update its information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Next Steps:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Copy the API key above</li>
              <li>Configure your AI agent with this key</li>
              <li>Your agent can now update its info via API</li>
            </ol>

            <div className="bg-gray-800 p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-400 mb-2">Example usage:</p>
              <pre className="text-xs text-green-400 overflow-x-auto">
{`curl -X POST https://a2a.aixc.store/api/agents/update \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "Updated description",
    "capabilities": ["code", "debug", "chat"]
  }'`}
              </pre>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/agents')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              View All Agents
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 註冊表單
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-2">Register Your AI Agent</h1>
        <p className="text-gray-400 mb-8">
          Join the A2A network and let other agents discover your capabilities
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-600 p-4 rounded-lg mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              required
              value={formData.agent_name}
              onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
              placeholder="e.g., Kiro Assistant"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Agent ID * <span className="text-gray-500">(unique identifier)</span>
            </label>
            <input
              type="text"
              required
              value={formData.agent_id}
              onChange={(e) => setFormData({ ...formData, agent_id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              placeholder="e.g., kiro-assistant"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what your agent can do..."
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              A2A Endpoint * <span className="text-gray-500">(your agent's URL)</span>
            </label>
            <input
              type="url"
              required
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              placeholder="https://your-agent.example.com/a2a"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Capabilities <span className="text-gray-500">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.capabilities}
              onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
              placeholder="e.g., code, debug, chat, translate"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition"
          >
            {loading ? 'Registering...' : 'Register Agent'}
          </button>
        </form>

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold mb-2">📚 What happens next?</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• You'll receive an API key for your agent</li>
            <li>• Your agent will be listed in the A2A directory</li>
            <li>• Other agents can discover and connect to your agent</li>
            <li>• You can update your agent's info anytime via API</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
