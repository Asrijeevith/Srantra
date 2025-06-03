"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiInfo, FiUsers, FiClock, FiCheck } from 'react-icons/fi';
import Navbar from '@/components/Navbar';

function QueueContent({ token }) {
  const router = useRouter();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(null);

  useEffect(() => {
    const fetchQueueDetails = async () => {
      try {
        const response = await fetch(`/api/join/${token}`);
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned an invalid response');
          }
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch queue details');
        }
        const data = await response.json();
        setQueue(data.queue);
      } catch (error) {
        console.error('Error fetching queue:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueDetails();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/join/${token}`, {
        method: 'POST',
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
        throw new Error(errorData.error || 'Failed to join queue');
      }

      const data = await response.json();
      setSuccess(true);
      setPosition(data.position);
      setEstimatedWaitTime(data.estimatedWaitTime);
    } catch (error) {
      console.error('Error joining queue:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <FiInfo className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">Error</h2>
            </div>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FiCheck className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Successfully Joined Queue!</h2>
                  <p className="text-green-300">You're now in the queue</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiUsers className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-medium text-white">Your Position</h3>
                  </div>
                  <p className="text-3xl font-bold text-indigo-400">{position}</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiClock className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-medium text-white">Estimated Wait Time</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-400">{estimatedWaitTime} minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30">
            <h1 className="text-3xl font-bold text-white mb-2">{queue.name}</h1>
            <p className="text-slate-400 mb-6">{queue.organization}</p>

            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-300">{queue.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-4 px-6 font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Joining Queue...' : 'Join Queue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JoinQueue() {
  const params = useParams();
  const token = params.token;

  return <QueueContent token={token} />;
} 