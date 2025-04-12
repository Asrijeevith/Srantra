"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from 'react-qr-code';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function Queue() {
  const [queueName, setQueueName] = useState("");
  const [organization, setOrganization] = useState("");
  const [queueSize, setQueueSize] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [qrCodeData, setQRCodeData] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState("");
  const [userQueues, setUserQueues] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }
        const data = await response.json();
        
        if (!data.user) {
          router.push('/signup');
          return;
        }

        // Fetch user's queues
        const queuesResponse = await fetch('/api/queues');
        if (!queuesResponse.ok) {
          const errorData = await queuesResponse.json();
          throw new Error(errorData.error || "Failed to fetch queues");
        }
        
        const queuesData = await queuesResponse.json();
        setUserQueues(queuesData.queues || []);
      } catch (error) {
        setError(error.message || "An error occurred while loading queues");
        console.error('Error in checkAuth:', error);
      }
    };

    checkAuth();
  }, [router]);

  const handleConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleYes = async () => {
    setShowConfirmation(false);
    setLoading(true);
    setError("");

    try {
      if (selectedQueue) {
        router.push(`/queue/${selectedQueue}`);
        return;
      }

      // Validate form data
      if (!queueName.trim()) {
        throw new Error('Queue name is required');
      }
      if (!organization.trim()) {
        throw new Error('Organization is required');
      }
      if (!queueSize || isNaN(queueSize) || parseInt(queueSize) < 1) {
        throw new Error('Please enter a valid queue size (minimum 1)');
      }
      if (!expiryDate) {
        throw new Error('Expiry date is required');
      }
      if (!description.trim()) {
        throw new Error('Description is required');
      }

      const formData = {
        name: queueName,
        organization: organization,
        queueSize: parseInt(queueSize),
        expiryDate: new Date(expiryDate).toISOString(),
        description: description
      };

      const response = await fetch("/api/queues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create queue");
      }

      setQRCodeData(data.queue.qrCode);
      setShowForm(false);
      setShowQR(true);
    } catch (err) {
      console.error('Queue creation error:', err);
      setError(err.message || "An error occurred while creating the queue");
    } finally {
      setLoading(false);
    }
  };

  const handleNo = () => {
    setShowConfirmation(false);
  };

  const handleReset = () => {
    setQueueName("");
    setOrganization("");
    setQueueSize("");
    setExpiryDate("");
    setDescription("");
    setError("");
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.form
              key="queue-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmation();
              }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 space-y-8"
            >
              <h1 className="text-3xl font-bold text-white text-center mb-8">
                Create New Queue
              </h1>

              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-4">
                  <p className="text-red-500">{error}</p>
                </div>
              )}

              <motion.div
                variants={inputVariants}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Queue Name
                  </label>
                  <input
                    type="text"
                    value={queueName}
                    onChange={(e) => setQueueName(e.target.value)}
                    placeholder="Enter queue name"
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Enter organization name"
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Queue Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={queueSize}
                    onChange={(e) => setQueueSize(e.target.value)}
                    placeholder="Enter maximum queue size"
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter queue description"
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white rounded-lg py-3 px-6 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Queue'
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}
          {showConfirmation && (
            <motion.div
              key="confirmation-dialog"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-gray-800 rounded-lg p-8 w-96">
                <h2 className="text-2xl text-white mb-4">Are you sure?</h2>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleYes}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleNo}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg"
                  >
                    No
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {showQR && (
            <motion.div
              key="qr-code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 p-6 bg-gray-800 rounded-lg"
            >
              <h2 className="text-2xl text-white mb-4">Your Queue QR Code</h2>
              <div className="flex justify-center items-center mb-6">
                <QRCode
                  value={qrCodeData}
                  size={256}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="text-gray-400 text-center mb-4">
                Scan this QR code to join your queue
              </p>
              <button
                onClick={() => {
                  setShowQR(false);
                  setShowForm(true);
                  setQRCodeData("");
                }}
                className="w-full bg-blue-500 text-white rounded-lg py-3 px-6 hover:bg-blue-600 transition-all"
              >
                Create Another Queue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
