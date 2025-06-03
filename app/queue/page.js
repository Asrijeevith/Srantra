"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import QRCode from 'react-qr-code';
import { FiInfo, FiUsers, FiCalendar, FiClock, FiPlus, FiArrowRight, FiCheck, FiCopy, FiX } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

// Modern color scheme and effects
const colors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  dark: '#0f172a',
  light: '#f8fafc'
};

// Enhanced animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={itemVariants}
    custom={delay}
    className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/30 backdrop-blur-xl hover:border-indigo-500/50 transition-all duration-500 flex items-start gap-4"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
    <div className="relative z-10 flex-shrink-0">
      <motion.div 
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40"
        whileHover={{ rotate: 12, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
    </div>
    <div className="relative z-10 flex-1">
      <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">{title}</h3>
      <p className="text-slate-300 text-base leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function Queue() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });
  
  const features = [
    {
      icon: FiUsers,
      title: "Real-time Updates",
      description: "Get instant notifications when it's your turn in the queue."
    },
    {
      icon: FiCalendar,
      title: "Scheduling",
      description: "Set specific dates and times for your queue to be active."
    },
    {
      icon: FiClock,
      title: "Time Estimates",
      description: "Know approximately how long you'll need to wait."
    },
    {
      icon: FiInfo,
      title: "Detailed Info",
      description: "See all the important details about the queue at a glance."
    }
  ];
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchQueues = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch('/api/queues');
          if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Server returned an invalid response');
            }
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch queues");
          }
          
          const data = await response.json();
          setUserQueues(data.queues || []);
        } catch (error) {
          console.error('Error fetching queues:', error);
          setError(error.message || "An error occurred while loading queues");
        }
      }
    };

    fetchQueues();
  }, [status]);

  const handleConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleYes = async () => {
    if (status !== "authenticated") {
      router.push("/signup");
      return;
    }

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

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create queue');
      }

      if (!data.queue) {
        throw new Error('Invalid response from server');
      }

      setQRCodeData(data.queue.qrCode);
      setToken(data.queue.token);
      setShowQR(true);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating queue:', error);
      setError(error.message);
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Please sign in to continue</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Enhanced background with multiple layers */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-900 to-slate-900" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
      
      {/* Fixed navbar with highest z-index */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Main content with proper spacing for fixed navbar */}
      <div className="relative z-10 pt-24">
        <div className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm flex items-start gap-3"
              >
                <FiInfo className="flex-shrink-0 mt-0.5 text-red-300" />
                <p className="text-red-300">{error}</p>
              </motion.div>
            )}

            {showForm && (
              <motion.div
                key="queue-form-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row gap-12 items-center justify-center"
              >
                {/* Feature Cards */}
                <motion.div
                  ref={featuresRef}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={containerVariants}
                  className="hidden lg:flex flex-col gap-6 w-full max-w-md"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      custom={index}
                      className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                          <p className="text-slate-400">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.form
                  key="queue-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConfirmation();
                  }}
                  className="relative w-full max-w-xl bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl p-8 space-y-8 border border-slate-700/30 shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-3xl animate-pulse" />
                  <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse" />
                  
                  <motion.div 
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4">
                      Create New Queue
                    </h1>
                    <motion.div 
                      className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />
                  </motion.div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    {[
                      {
                        label: "Queue Name",
                        value: queueName,
                        onChange: setQueueName,
                        type: "text",
                        placeholder: "Enter queue name"
                      },
                      {
                        label: "Organization",
                        value: organization,
                        onChange: setOrganization,
                        type: "text",
                        placeholder: "Enter organization name"
                      },
                      {
                        label: "Queue Size",
                        value: queueSize,
                        onChange: setQueueSize,
                        type: "number",
                        placeholder: "Enter maximum queue size",
                        min: "1"
                      },
                      {
                        label: "Expiry Date",
                        value: expiryDate,
                        onChange: setExpiryDate,
                        type: "date"
                      }
                    ].map((field, index) => (
                      <motion.div
                        key={field.label}
                        variants={itemVariants}
                        custom={index}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-slate-300">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={field.placeholder}
                          min={field.min}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-white placeholder-slate-500 transition-all duration-300"
                          required
                        />
                      </motion.div>
                    ))}

                    <motion.div
                      variants={itemVariants}
                      custom={0.4}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-slate-300">
                        Description
                      </label>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter queue description"
                          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 min-h-[120px]"
                          required
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      custom={0.5}
                    >
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-4 px-6 font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Queue...
                          </>
                        ) : (
                          <>
                            <FiPlus className="w-5 h-5" />
                            Create Queue
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.form>
              </motion.div>
            )}
            
            {/* Confirmation Modal */}
            <AnimatePresence>
              {showConfirmation && (
                <motion.div
                  key="confirmation-dialog"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700/50 shadow-2xl"
                  >
                    <button
                      onClick={handleNo}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                    
                    <div className="text-center">
                      <motion.div
                        className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <FiInfo className="w-10 h-10 text-indigo-400" />
                      </motion.div>
                      
                      <h2 className="text-2xl font-bold text-white mb-3">Confirm Creation</h2>
                      <p className="text-slate-300 mb-6">Are you sure you want to create this queue?</p>
                      
                      <div className="flex justify-center gap-4">
                        <motion.button
                          onClick={handleNo}
                          className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          onClick={handleYes}
                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Confirm
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* QR Code Display */}
            {showQR && (
              <motion.div
                key="qr-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-5xl mx-auto"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - QR Code */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30 shadow-2xl"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                        Queue QR Code
                      </h2>
                      <p className="text-slate-400">Scan to join the queue</p>
                    </div>
                    
                    <div className="relative flex justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                      <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                        <QRCode
                          value={qrCodeData}
                          size={280}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          className="transform hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column - Queue Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Success Message */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/20">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <FiCheck className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Queue Created!</h2>
                          <p className="text-slate-300">Your queue is ready to use</p>
                        </div>
                      </div>
                    </div>

                    {/* Queue Token */}
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                          <FiInfo className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white">Queue Token</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-800/50 rounded-xl px-4 py-3 text-white font-mono text-sm truncate">
                          {token}
                        </div>
                        <motion.button
                          onClick={() => copyToClipboard(token)}
                          className="p-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                        </motion.button>
                      </div>
                    </div>

                    {/* Queue Link */}
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <FiArrowRight className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white">Queue Link</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-800/50 rounded-xl px-4 py-3 text-white font-mono text-sm truncate">
                          {qrCodeData}
                        </div>
                        <motion.button
                          onClick={() => copyToClipboard(qrCodeData)}
                          className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                        </motion.button>
                      </div>
                    </div>

                    {/* Create Another Queue Button */}
                    <motion.button
                      onClick={handleReset}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-4 px-6 font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiPlus className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" />
                      Create Another Queue
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}