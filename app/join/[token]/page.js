"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiInfo, FiUsers, FiClock, FiCheck, FiMail } from 'react-icons/fi';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Navbar from '@/components/Navbar';

function QueueContent({ token }) {
  const router = useRouter();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchQueueDetails = async () => {
      try {
        // Get phone number from localStorage if it exists
        const savedPhone = localStorage.getItem('queuePhone');
        const url = savedPhone ? `/api/join/${token}?phone=${savedPhone}` : `/api/join/${token}`;
        
        const response = await fetch(url);
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
        
        // Check if user is already in queue
        if (data.isInQueue) {
          setSuccess(true);
          setPosition(data.position);
          setEstimatedWaitTime(data.estimatedWaitTime);
        }
      } catch (error) {
        console.error('Error fetching queue:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueDetails();
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let userCredential;
      // First authenticate the user
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        // Send verification email for new users
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
        setUser(userCredential.user);
        setError('Please check your email for verification link. After verifying, you can join the queue.');
        setSubmitting(false);
        return;
      }

      // Check if email is verified for login
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        setError('Please verify your email first. A new verification email has been sent.');
        setSubmitting(false);
        return;
      }

      // If authentication successful and email verified, join the queue
      const response = await fetch(`/api/join/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        }),
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
      // Save phone number to localStorage
      localStorage.setItem('queuePhone', formData.phone);
      setSuccess(true);
      setPosition(data.position);
      setEstimatedWaitTime(data.estimatedWaitTime);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    
    try {
      await sendEmailVerification(user);
      setError('Verification email sent again. Please check your inbox.');
    } catch (error) {
      setError('Error sending verification email. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
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

              {verificationSent ? (
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiMail className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-xl font-semibold text-indigo-400">Verify Your Email</h2>
                  </div>
                  <p className="text-slate-300 mb-4">
                    We've sent a verification email to {formData.email}. Please check your inbox and click the verification link to continue.
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleResendVerification}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      Resend verification email
                    </button>
                    <button
                      onClick={() => setVerificationSent(false)}
                      className="text-slate-400 hover:text-slate-300 text-sm"
                    >
                      Back to form
                    </button>
                  </div>
                </div>
              ) : !success ? (
                <form onSubmit={handleAuth} className="space-y-4">
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
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-4 px-6 font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : (isLogin ? 'Login & Join Queue' : 'Sign Up & Join Queue')}
                  </button>
                </form>
              ) : null}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-300 mb-2">
                    <FiCheck className="w-5 h-5" />
                    <span className="font-medium">Successfully joined the queue!</span>
                  </div>
                  <p className="text-slate-300">Your position: #{position}</p>
                  {estimatedWaitTime && (
                    <p className="text-slate-300">Estimated wait time: {estimatedWaitTime} minutes</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JoinQueue({ params }) {
  return <QueueContent token={params.token} />;
} 