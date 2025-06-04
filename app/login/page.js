"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FiMail } from 'react-icons/fi';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session) router.push("/");
  }, [session]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
        setUser(userCredential.user);
        setError('Please verify your email first. A new verification email has been sent.');
        setLoading(false);
        return;
      }

      // If email is verified, sign in with NextAuth
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

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
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white"
              required
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
        )}

        <p className="text-center text-gray-400 mt-4">
          Don't have an account? <Link href="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="flex justify-center gap-4">
          <h1 className="p-3 text-gray-400">Login with</h1> 
          <button onClick={() => signIn("google", { callbackUrl: "/" })} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition">
            <FcGoogle size={24} />
          </button>
          <h1 className="text-gray-400 p-3">or</h1>
          <button onClick={() => signIn("twitter", { callbackUrl: "/" })} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition">
            <FaXTwitter size={24} className="text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}