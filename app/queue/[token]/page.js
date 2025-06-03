"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiClock, FiTrash2, FiEdit, FiCopy } from 'react-icons/fi';
import QRCode from 'react-qr-code';
import Navbar from '@/components/Navbar';

export default function QueueDetails({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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
          setQueue(data.queue);
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

  const handleDeleteQueue = async () => {
    if (!confirm('Are you sure you want to delete this queue?')) {
      return;
    }

    try {
      const response = await fetch(`/api/queues/${params.token}`, {
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

      router.push('/my-queues');
    } catch (error) {
      console.error('Error deleting queue:', error);
      setError(error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-slate-800/50 rounded-xl p-8 text-center">
            <p className="text-slate-400">Queue not found</p>
          </div>
        </div>
      </div>
    );
  }

  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join/${queue.token}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">{queue.name}</h1>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/queue/${queue.token}/edit`)}
                className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl px-4 py-2 transition-colors flex items-center gap-2"
              >
                <FiEdit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDeleteQueue}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl px-4 py-2 transition-colors flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
                <h2 className="text-xl font-bold text-white mb-4">Queue Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <FiUsers className="w-5 h-5 text-indigo-400" />
                    <span>Size: {queue.participants.length}/{queue.queueSize}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <FiCalendar className="w-5 h-5 text-purple-400" />
                    <span>Expires: {new Date(queue.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <FiClock className="w-5 h-5 text-blue-400" />
                    <span>Created: {new Date(queue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
                <h2 className="text-xl font-bold text-white mb-4">Share Queue</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-800/50 rounded-xl px-4 py-2 text-white font-mono text-sm truncate">
                      {joinUrl}
                    </div>
                    <button
                      onClick={() => copyToClipboard(joinUrl)}
                      className="p-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-colors"
                    >
                      <FiCopy className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-400 text-sm">Copied to clipboard!</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
              <h2 className="text-xl font-bold text-white mb-4">QR Code</h2>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl">
                  <QRCode value={joinUrl} size={200} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <h2 className="text-xl font-bold text-white mb-4">Participants</h2>
            {queue.participants.length === 0 ? (
              <p className="text-slate-400">No participants yet</p>
            ) : (
              <div className="space-y-3">
                {queue.participants.map((participant, index) => (
                  <div
                    key={participant.phone}
                    className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-400 font-medium">#{index + 1}</span>
                      <span className="text-white">{participant.name}</span>
                    </div>
                    <span className="text-slate-400">{participant.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 