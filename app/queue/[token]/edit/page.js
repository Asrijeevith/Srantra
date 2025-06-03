"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';
import Navbar from '@/components/Navbar';

export default function EditQueue({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    queueSize: '',
    expiryDate: '',
    description: ''
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchQueue = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/queues/${params.token}`);
          if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Server returned an invalid response');
            }
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch queue details");
          }
          
          const data = await response.json();
          const queue = data.queue;
          
          // Format the date for the input field
          const expiryDate = new Date(queue.expiryDate);
          const formattedDate = expiryDate.toISOString().split('T')[0];
          
          setFormData({
            name: queue.name,
            organization: queue.organization,
            queueSize: queue.queueSize,
            expiryDate: formattedDate,
            description: queue.description || ''
          });
        } catch (error) {
          console.error('Error fetching queue:', error);
          setError(error.message || "An error occurred while loading queue details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQueue();
  }, [params.token, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/queues/${params.token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned an invalid response');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update queue");
      }

      router.push(`/queue/${params.token}`);
    } catch (error) {
      console.error('Error updating queue:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Please sign in to continue</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Edit Queue</h1>
            <button
              onClick={() => router.push(`/queue/${params.token}`)}
              className="bg-slate-700/50 hover:bg-slate-700/70 text-white rounded-xl px-4 py-2 transition-colors flex items-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                    Queue Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="queueSize" className="block text-sm font-medium text-slate-300 mb-1">
                    Queue Size
                  </label>
                  <input
                    type="number"
                    id="queueSize"
                    name="queueSize"
                    value={formData.queueSize}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 