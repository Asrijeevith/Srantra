"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiEdit, FiEye, FiPlus, FiInfo } from 'react-icons/fi';
import Navbar from '@/components/Navbar';

export default function MyQueues() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup");
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Enhanced background with multiple layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-900 to-slate-900" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
      
      {/* Fixed navbar with highest z-index */}
      <div className="fixed top-0 left-0 right-0 z-[100]">
        <Navbar />
      </div>
      
      {/* Main content with proper spacing for fixed navbar */}
      <div className="relative z-10 pt-28">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              My Queues
            </h1>
            <motion.button
              onClick={() => router.push('/queue')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus className="w-5 h-5" />
              Create Queue
            </motion.button>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm flex items-start gap-3"
              >
                <FiInfo className="flex-shrink-0 mt-0.5 text-red-300" />
                <p className="text-red-300">{error}</p>
              </motion.div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : queues.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-8 text-center border border-slate-700/30"
              >
                <p className="text-slate-400 text-lg">You haven't created any queues yet.</p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {queues.map((queue, index) => (
                  <motion.div
                    key={queue.token}
                    variants={itemVariants}
                    custom={index}
                    className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group"
                  >
                    <div className="relative">
                      {/* Decorative elements */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-600/10 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/10 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                        {queue.name}
                      </h2>
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
                        <motion.button
                          onClick={() => handleViewQueue(queue.token)}
                          className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl px-4 py-2 transition-colors flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiEye className="w-4 h-4" />
                          View
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteQueue(queue.token)}
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl px-4 py-2 transition-colors flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 