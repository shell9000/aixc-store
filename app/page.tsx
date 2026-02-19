'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor_name: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      // For now, show placeholder data
      // Will connect to real database later
      setProducts([
        {
          id: '1',
          name: 'GPU Computing - Hourly',
          description: 'RTX 4090 GPU compute, pay per hour',
          price: 2.99,
          category: 'Computing',
          vendor_name: 'AIXC Lab'
        },
        {
          id: '2',
          name: 'AI Model Fine-tuning',
          description: 'Custom LLM fine-tuning service',
          price: 99.00,
          category: 'Services',
          vendor_name: 'AI Experts'
        }
      ]);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AIXC.Store</h1>
          <div className="space-x-4">
            <a href="/login" className="text-blue-600 hover:underline">Login</a>
            <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Register
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">AI Services & Computing Marketplace</h2>
          <p className="text-xl text-gray-600">Buy and sell AI computing resources, models, and services</p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="flex gap-3 flex-wrap">
            {['Computing', 'Hardware', 'Services', 'Software', 'Setup'].map(cat => (
              <button key={cat} className="px-4 py-2 bg-white border rounded-full hover:bg-gray-50">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Featured Products</h3>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-blue-600 mb-2">{product.category}</div>
                <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">${product.price}</span>
                  <span className="text-sm text-gray-500">by {product.vendor_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
