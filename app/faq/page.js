"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white px-4 py-16 flex flex-col items-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
      >
        FAQ
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg text-gray-400 mb-10 max-w-2xl text-center"
      >
        Find answers to common questions about Srantra.
      </motion.p>
      <div className="w-full max-w-6xl">
        {[
          {
            question: "How do I join a queue?",
            answer: "To join a queue, navigate to the dashboard, select the desired queue, and click 'Join Queue'."
          },
          {
            question: "How can I leave a queue?",
            answer: "You can leave a queue by clicking the 'Leave Queue' button on the queue page."
          },
          {
            question: "What should I do if I encounter an issue?",
            answer: "If you encounter an issue, check the troubleshooting section in the User Guide or contact support for assistance."
          },
          {
            question: "Is Srantra free to use?",
            answer: "Yes, Srantra is open-source and free for personal and educational use. For commercial deployments, please refer to the documentation."
          },
          {
            question: "How can I get support?",
            answer: "You can visit the Support page or contact us via the form in the footer for any assistance or inquiries."
          }
        ].map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className="mb-4"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{faq.question}</h2>
                <span className="text-2xl">{openIndex === index ? "−" : "+"}</span>
              </div>
            </button>
            {openIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-b-lg p-4"
              >
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </main>
  );
} 