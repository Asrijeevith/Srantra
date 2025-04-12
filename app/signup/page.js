"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Sign Up</h2>
        
        <form className="space-y-5">
          <input type="text" placeholder="Name" className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white" />
          <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white" />
          <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white" />
          <motion.button whileHover={{ scale: 1.03 }} className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
            Sign Up
          </motion.button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="flex justify-center gap-4">
          <h1 className="p-3 text-gray-400">Signup with</h1>  
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


