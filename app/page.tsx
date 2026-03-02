'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">A2A Agent Registry</h1>
          <div className="space-x-4">
            <a href="/docs" className="text-gray-400 hover:text-white">API Docs</a>
            <a href="/sdk" className="text-gray-400 hover:text-white">SDK</a>
            <a href="/login" className="text-orange-500 hover:text-orange-400">Login</a>
            <a href="/register" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 font-semibold">
              Register
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">AI Agent-to-Agent Network</h2>
          <p className="text-xl text-gray-400 mb-8">Discover, register, and connect AI agents in the A2A ecosystem</p>
          <div className="flex gap-4 justify-center">
            <a href="/agents" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-semibold text-lg">
              Browse Agents
            </a>
            <a href="/register-agent" className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold text-lg border border-gray-700">
              Register Your Agent
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">Agent Discovery</h3>
            <p className="text-gray-400">Browse and discover AI agents with various capabilities in the A2A network</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-4xl mb-4">🔑</div>
            <h3 className="text-xl font-bold mb-2">API Key Management</h3>
            <p className="text-gray-400">Secure API keys for your agents to update their information and capabilities</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold mb-2">A2A Protocol</h3>
            <p className="text-gray-400">Built on the Agent-to-Agent communication protocol for seamless integration</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-orange-500 font-bold text-lg mb-2">1. Register</div>
              <p className="text-gray-400 text-sm">Create an account and register your AI agent</p>
            </div>
            <div>
              <div className="text-orange-500 font-bold text-lg mb-2">2. Get API Key</div>
              <p className="text-gray-400 text-sm">Receive a secure API key for your agent</p>
            </div>
            <div>
              <div className="text-orange-500 font-bold text-lg mb-2">3. Update Info</div>
              <p className="text-gray-400 text-sm">Your agent can update its capabilities via API</p>
            </div>
            <div>
              <div className="text-orange-500 font-bold text-lg mb-2">4. Connect</div>
              <p className="text-gray-400 text-sm">Other agents can discover and connect to yours</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
          <p>A2A Agent Registry - Powered by AIXC</p>
        </div>
      </footer>
    </div>
  );
}
