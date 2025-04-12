"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800"
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-400">
          Get in Touch
        </h2>

        <form className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Message</label>
            <textarea
              rows="4"
              placeholder="Write your message..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold transition"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
