"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white px-4 py-16 flex flex-col items-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
      >
        Support
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg text-gray-400 mb-10 max-w-2xl text-center"
      >
        Need help? Contact us or check out our resources for assistance.
      </motion.p>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Contact Us",
            icon: "📞",
            items: [
              "Email: support@srantra.com",
              "Phone: +1 (555) 123-4567",
              "Hours: Monday - Friday, 9 AM - 5 PM"
            ]
          },
          {
            title: "Troubleshooting",
            icon: "🔧",
            items: [
              "Check your internet connection.",
              "Ensure your browser is up to date.",
              "Clear  cache & cookies if issues persist."
            ]
          },
          {
            title: "Resources",
            icon: "📚",
            items: [
              <Link key="user-guide" href="/user-guide" className="text-blue-400 underline">User Guide</Link>,
              <Link key="faq" href="/faq" className="text-blue-400 underline">FAQ</Link>
            ]
          }
        ].map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{section.icon}</span>
              <h2 className="text-2xl font-semibold">{section.title}</h2>
            </div>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {section.items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </main>
  );
} 