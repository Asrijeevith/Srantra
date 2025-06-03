"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiTrash2, FiEdit, FiEye, FiPlus } from 'react-icons/fi';
import Navbar from '@/components/Navbar';

export default function MyQueues() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchQueues = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch('/api/queues');
          if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Server returned an invalid response');
            }
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch queues");
          }
          
          const data = await response.json();
          setQueues(data.queues || []);
        } catch (error) {
          console.error('Error fetching queues:', error);
          setError(error.message || "An error occurred while loading queues");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQueues();
  }, [status]);

  const handleDeleteQueue = async (token) => {
    if (!confirm('Are you sure you want to delete this queue?')) {
      return;
    }

    try {
      const response = await fetch(`/api/queues/${token}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned an invalid response');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete queue");
      }

      setQueues(queues.filter(queue => queue.token !== token));
    } catch (error) {
      console.error('Error deleting queue:', error);
      setError(error.message);
    }
  };

  const handleViewQueue = (token) => {
    router.push(`/queue/${token}`);
  };

  if (status === "loading") {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Queues</h1>
          <button
            onClick={() => router.push('/queue')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Create Queue
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {queues.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-8 text-center">
            <p className="text-slate-400">You haven't created any queues yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queues.map((queue) => (
              <motion.div
                key={queue.token}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30"
              >
                <h2 className="text-xl font-bold text-white mb-2">{queue.name}</h2>
                <p className="text-slate-400 mb-4">{queue.organization}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-white">{queue.participants.length}/{queue.queueSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-white">{new Date(queue.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewQueue(queue.token)}
                    className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl px-4 py-2 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteQueue(queue.token)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl px-4 py-2 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 