'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              name,
            }
          ]);

        if (profileError) console.error('Profile error:', profileError);
        
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full p-8 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">AIXC.Store - Register</h1>
        
        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">✓ Registration successful! Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-600 rounded">{error}</div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:border-orange-500"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
        
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-orange-500 hover:text-orange-400">Login</a>
        </p>
      </div>
    </div>
  );
}
