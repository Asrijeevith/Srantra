"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import QRCode from 'react-qr-code';
import { FiInfo, FiUsers, FiCalendar, FiClock, FiPlus, FiArrowRight, FiCheck, FiCopy, FiX } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

// Enhanced glass morphism effect
const glassStyle = {
  background: 'rgba(15, 23, 42, 0.7)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
};

// Particle background component
const ParticlesBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-indigo-500/10"
        initial={{
          x: Math.random() * 100,
          y: Math.random() * 100,
          width: Math.random() * 10 + 5,
          height: Math.random() * 10 + 5,
          opacity: Math.random() * 0.5 + 0.1
        }}
        animate={{
          x: [null, Math.random() * 100],
          y: [null, Math.random() * 100],
          transition: {
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }
        }}
      />
    ))}
  </div>
);

// Animation variants with enhanced spring physics
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1
    }
  },
  hover: {
    y: -5,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    whileHover="hover"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeInUp}
    custom={delay}
    className="relative overflow-hidden bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-8 rounded-3xl border border-gray-700/30 backdrop-blur-sm transition-all duration-500 group hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
    <div className="relative z-10">
      <motion.div 
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40"
        whileHover={{ rotate: 5, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
      <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

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
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
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
      setToken(data.queue.token);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 overflow-x-hidden">
      <ParticlesBackground />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10" />
      <div className="relative z-10">
        <Navbar />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key="queue-form-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row gap-12 items-center justify-center"
            >
              {/* Feature Cards - Only shown on larger screens */}
              <motion.div 
                ref={featuresRef}
                className="hidden lg:block w-full max-w-md"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div 
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    Powerful Queue Management
                  </h2>
                  <p className="text-gray-300">
                    Create and manage virtual queues with our advanced system
                  </p>
                </motion.div>
                
                <motion.div 
                  className="grid grid-cols-1 gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {features.map((feature, index) => (
                    <FeatureCard 
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      delay={index * 0.1}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Form Section */}
              <motion.form
                key="queue-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConfirmation();
                }}
                className="relative w-full max-w-xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl p-8 space-y-8 border border-gray-700/30 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl" />
                
                {/* Floating particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-indigo-500/10"
                    style={{
                      width: Math.random() * 10 + 5,
                      height: Math.random() * 10 + 5,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, Math.random() * 20 - 10],
                      x: [0, Math.random() * 20 - 10],
                      transition: {
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }
                    }}
                  />
                ))}

                <motion.div 
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                    Create New Queue
                  </h1>
                  <motion.div 
                    className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>

                <AnimatePresence>
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
                </AnimatePresence>

                <motion.div
                  variants={staggerContainer}
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
                      variants={fadeIn}
                      custom={index * 0.1}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium text-gray-300">
                        {field.label}
                      </label>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={field.placeholder}
                          min={field.min}
                          className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          required
                        />
                      </motion.div>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={fadeIn}
                    custom={0.4}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter queue description"
                        className="w-full bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[120px]"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    variants={fadeIn}
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
          {showConfirmation && (
            <motion.div
              key="confirmation-dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700/50 shadow-2xl"
              >
                <button
                  onClick={handleNo}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
                
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
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
                    <FiInfo className="w-8 h-8 text-indigo-400" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3">Confirm Creation</h2>
                  <p className="text-gray-300 mb-6">Are you sure you want to create this queue?</p>
                  
                  <div className="flex justify-center gap-4">
                    <motion.button
                      onClick={handleNo}
                      className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
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
          
          {/* QR Code Display */}
          {showQR && (
            <motion.div
              key="qr-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 shadow-2xl"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl" />
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  Queue Created Successfully!
                </h2>
                <p className="text-gray-400">Share this QR code with participants</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <motion.div
                  className="flex-1 flex justify-center"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-6 bg-white rounded-2xl shadow-lg">
                    <QRCode
                      value={qrCodeData}
                      size={256}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </motion.div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Queue Token</h3>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="flex-1 bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white font-mono truncate"
                        whileHover={{ scale: 1.01 }}
                      >
                        {token}
                      </motion.div>
                      <motion.button
                        onClick={() => copyToClipboard(token)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Copy to clipboard"
                      >
                        {copied ? <FiCheck className="w-5 h-5 text-green-400" /> : <FiCopy className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Queue Link</h3>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="flex-1 bg-gray-700/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white font-mono text-sm truncate"
                        whileHover={{ scale: 1.01 }}
                      >
                        {qrCodeData}
                      </motion.div>
                      <motion.button
                        onClick={() => copyToClipboard(qrCodeData)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Copy to clipboard"
                      >
                        {copied ? <FiCheck className="w-5 h-5 text-green-400" /> : <FiCopy className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleReset}
                    className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-3 px-6 font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiPlus className="w-5 h-5" />
                    Create Another Queue
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}