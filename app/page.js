"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Users, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-64 pb-80 px-6 text-center relative flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-green-400/10 blur-3xl opacity-20 -z-10 rounded-full"></div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 leading-tight drop-shadow-md">
            Revolutionizing Queues
          </h1>
          <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
            Seamlessly manage queues with QR codes and real-time updates — making long wait times a thing of the past.
          </p>
          <div className="mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 flex items-center shadow-lg"
            >
              Get Started
              <ArrowRight className="ml-2" size={22} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <FeatureCard
            icon={<CheckCircle size={40} className="text-green-400" />}
            title="QR Code Based"
            description="Users can join queues simply by scanning a QR code, no login required."
          />
          <FeatureCard
            icon={<Clock size={40} className="text-yellow-400" />}
            title="Real-time Updates"
            description="Notify users when their turn is near, reducing wait times and confusion."
          />
          <FeatureCard
            icon={<Users size={40} className="text-blue-400" />}
            title="Easy Queue Management"
            description="Admins can control queues, remove served tokens, and track status."
          />
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center border border-gray-700 transition-all"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-blue-400">{title}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
    </motion.div>
  );
}
