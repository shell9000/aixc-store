'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-900 shadow border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">A2A Agent Registry</h1>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Welcome{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!</h2>
          <p className="text-gray-400">Email: {user?.email}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-6">
            <h3 className="font-semibold mb-2 text-white">🤖 Register Your Agent</h3>
            <p className="text-gray-400 text-sm mb-4">Add your AI agent to the A2A network</p>
            <a href="/register-agent" className="text-orange-500 hover:text-orange-400">Register Agent →</a>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-6">
            <h3 className="font-semibold mb-2 text-white">📋 Browse Agents</h3>
            <p className="text-gray-400 text-sm mb-4">Discover AI agents in the network</p>
            <a href="/agents" className="text-orange-500 hover:text-orange-400">View All Agents →</a>
          </div>
        </div>
      </main>
    </div>
  );
}
