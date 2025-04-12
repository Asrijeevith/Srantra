"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-center"
      >
        <h1 className="text-5xl font-bold text-blue-400 mb-6">
          About Srantra
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Srantra is a modern digital queue management solution designed to eliminate waiting time frustrations.
          Our mission is to simplify and streamline the way people wait, using QR codes, real-time updates,
          and intuitive queue control tools.
        </p>
        <p className="text-lg text-gray-400 mt-4">
          Whether you're running a hospital, bank, office, or event, Srantra gives your customers a smarter,
          faster, and more transparent experience.
        </p>
      </motion.div>
    </div>
  );
}
