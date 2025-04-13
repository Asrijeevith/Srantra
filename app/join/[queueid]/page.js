"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '@/components/Navbar';

export default function JoinQueue({ params }) {
  const [queueData, setQueueData] = useState(null);
  const [showJoin, setShowJoin] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await fetch(`/api/queues/${params.queueid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch queue data');
        }
        const data = await response.json();
        setQueueData(data.queue);
      } catch (error) {
        console.error('Error fetching queue data:', error);
        router.push('/');
      }
    };

    fetchQueueData();
  }, [params.queueid, router]);

  const handleJoin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/join/${params.queueid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to join queue');
      }

      const data = await response.json();
      setToken(data.token);
      setShowJoin(true);
    } catch (error) {
      console.error('Error joining queue:', error);
      alert('Failed to join the queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!queueData) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {!showJoin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="text-center">
                <h1 className="text-3xl text-white mb-4 font-bold">
                  {queueData.name}
                </h1>
                <p className="text-gray-400 mb-6">{queueData.description}</p>
                <div className="mt-6">
                  <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white rounded-lg py-4 px-8 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining Queue...
                      </>
                    ) : (
                      'Join Queue'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {showJoin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="text-center">
                <h1 className="text-3xl text-white mb-4 font-bold">
                  Welcome to {queueData.name}
                </h1>
                <p className="text-gray-400 mb-6">Your token number is:</p>
                <div className="bg-blue-500 text-white text-2xl font-bold p-4 rounded-lg mb-4">
                  {token}
                </div>
                <p className="text-gray-400 mb-6">Please wait for your turn.</p>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-green-500 text-white rounded-lg py-4 px-8 hover:bg-green-600 transition-all"
                >
                  Go Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
