'use client';

import Navbar from "@/components/Navbar";
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    value: "support@srantra.com",
    link: "mailto:support@srantra.com"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    value: "+91 8317614534",
    link: "tel:+918317614534"
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Visit Us",
    value: "Gmr Institute of Technology,Rajam",
    link: "https://maps.app.goo.gl/BR3Xepri8VP83DWK7"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Working Hours",
    value: "Mon - Fri: 9:00 AM - 6:00 PM",
    subtext: "Weekends: Closed"
  }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [businessCount, setBusinessCount] = useState(1000);

  useEffect(() => {
    // Generate random number on client side only
    setBusinessCount(1000 + Math.floor(Math.random() * 1000));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save data to MongoDB
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (formRef.current) {
      formRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (formRef.current) {
        formRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const gradientPosition = isHovered 
    ? { x: mousePosition.x - 100, y: mousePosition.y - 100 }
    : { x: 0, y: 0 };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <Navbar />
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              } 
            }}
            className="text-center mb-16 relative z-10"
          >
            <motion.span 
              className="inline-block px-5 py-2.5 bg-blue-600/10 text-blue-400 rounded-full text-sm font-medium mb-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Contact Us
            </motion.span>
            <motion.h1 
              className="text-4xl font-bold sm:text-5xl md:text-6xl tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Get in Touch</span>
              <span className="block text-gray-400 mt-4 text-xl font-normal">We'd love to hear from you</span>
            </motion.h1>
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-lg text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Have questions or feedback? Our team is here to help.
            </motion.p>
          </motion.div>

          <div className="flex flex-col space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
              <h2 className="text-2xl font-bold text-white">Contact Information</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    whileHover={{ y: -3 }}
                    className="group bg-gray-800/50 p-5 rounded-xl hover:bg-gray-800/80 transition-all duration-300 border border-gray-700/50 backdrop-blur-sm"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors duration-300">
                        {info.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-200">{info.title}</h3>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            className="mt-1 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group-hover:text-blue-400"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {info.value}
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                          </a>
                        ) : (
                          <>
                            <p className="mt-1 text-sm text-gray-400">{info.value}</p>
                            {info.subtext && (
                              <p className="text-xs text-gray-500 mt-1">{info.subtext}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-8 p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">Connect With Us</h3>
                <p className="text-gray-400 mb-5 text-sm">Follow us on social media for the latest updates and news.</p>
                <div className="flex items-center justify-left mt-4 space-x-6">
                  {[
                    { icon: <FaGithub className="w-6 h-6" />, href: "https://github.com/Asrijeevith" },
                    { icon: <FaLinkedin className="w-6 h-6" />, href: "https://linkedin.com/in/srijeevith2288/" },
                  ].map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={containerVariants}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative bg-gray-800/50 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden"
              style={{
                '--x': `${gradientPosition.x}px`,
                '--y': `${gradientPosition.y}px`
              }}
            >
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(59, 130, 246, 0.15), transparent 80%)',
                }}
                animate={{
                  opacity: isHovered ? 0.3 : 0,
                  transition: { duration: 0.5, ease: 'easeOut' }
                }}
              />
              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div 
                      className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 border-2 border-green-500/20"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.1, 1],
                        rotate: [0, 10, -5, 0],
                        transition: { 
                          duration: 0.6,
                          ease: 'easeOut'
                        }
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: 1,
                          transition: { 
                            delay: 0.2,
                            type: 'spring',
                            stiffness: 500,
                            damping: 15
                          }
                        }}
                      >
                        <CheckCircle className="h-10 w-10 text-green-400" />
                      </motion.div>
                    </motion.div>
                    <h3 className="mt-4 text-xl font-medium text-white">Message Sent!</h3>
                    <p className="mt-2 text-gray-400">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : submitStatus === 'error' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div 
                      className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 border-2 border-red-500/20"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.1, 1],
                        transition: { 
                          duration: 0.4,
                          ease: 'easeOut'
                        }
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: 90 }}
                        animate={{ 
                          scale: 1,
                          rotate: 0,
                          transition: { 
                            delay: 0.2,
                            type: 'spring',
                            stiffness: 500,
                            damping: 15
                          }
                        }}
                      >
                        <XCircle className="h-10 w-10 text-red-400" />
                      </motion.div>
                    </motion.div>
                    <h3 className="mt-4 text-xl font-medium text-white">Error</h3>
                    <p className="mt-2 text-gray-400">
                      Something went wrong. Please try again later.
                    </p>
                    <button
                      onClick={() => setSubmitStatus(null)}
                      className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Try again
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      variants={itemVariants}
                      className="relative overflow-hidden"
                    >
                      <motion.h2 
                        className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.1
                          } 
                        }}
                      >
                        Send us a message
                      </motion.h2>
                      <motion.p 
                        className="text-gray-400 mb-8 text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.2
                          } 
                        }}
                      >
                        We'll get back to you within 24 hours
                      </motion.p>
                      <motion.div 
                        className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: '100px',
                          transition: { 
                            duration: 0.8,
                            ease: 'easeOut',
                            delay: 0.3
                          } 
                        }}
                      />
                    </motion.div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-200"
                            placeholder="John Doe"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                      >
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-200"
                            placeholder="you@example.com"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-500" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-200"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                      >
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                          Subject
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="subject"
                            id="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-200"
                            placeholder="How can we help?"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                          Message <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-gray-200 resize-none"
                            placeholder="Your message here..."
                          />
                        </div>
                      </motion.div>

                      <motion.div 
                        className="pt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75 }}
                      >
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          className={`group w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 overflow-hidden ${
                            isSubmitting 
                              ? 'bg-gray-600 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400'
                          }`}
                        >
                          <motion.span 
                            className="relative z-10 flex items-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: { 
                                duration: 0.5,
                                ease: 'easeOut'
                              } 
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Send Message
                              </>
                            )}
                          </motion.span>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{
                              x: isHovered ? '100%' : '-100%',
                              transition: { 
                                duration: 0.8,
                                ease: 'easeInOut'
                              }
                            }}
                          />
                        </motion.button>
                      </motion.div>
                    </form>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full-width CTA Section - Outside the main container */}
      <div className="w-full bg-gradient-to-br from-blue-900 to-cyan-900">
        <div className="relative overflow-hidden py-20">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative z-10">
                    <motion.div 
                      className="inline-block px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: 0.2,
                          duration: 0.6
                        } 
                      }}
                      viewport={{ once: true }}
                    >
                      <span className="text-cyan-300 font-medium">✨ 100% Free - No Credit Card Needed</span>
                    </motion.div>
                    
                    <motion.h2 
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: 0.3,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1]
                        } 
                      }}
                      viewport={{ once: true }}
                    >
                      Queue Management <span className="text-cyan-300">Made Simple</span>
                    </motion.h2>
                    <motion.p 
                      className="text-xl text-blue-100 max-w-4xl mx-auto mb-12"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: 0.4,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1]
                        } 
                      }}
                      viewport={{ once: true }}
                    >
                      Join {businessCount}+ businesses that have transformed their customer experience with our completely free queue management solution. No hidden fees, no credit card required.
                    </motion.p>
                    
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                      {[
                        {
                          icon: '🚀',
                          title: 'Easy to Use',
                          desc: 'Simple and intuitive interface',
                          highlight: true
                        },
                        {
                          icon: '⚡',
                          title: 'Instant Setup',
                          desc: 'Get started in minutes',
                          highlight: true
                        },
                        {
                          icon: '✨',
                          title: 'All Features Included',
                          desc: 'Everything you need to manage queues',
                          highlight: true
                        }
                      ].map((feature, index) => (
                        <motion.div 
                          key={index}
                          className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${feature.highlight ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-400/20 hover:border-blue-400/40 shadow-lg' : 'bg-white/5 border-white/10'}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { 
                              delay: 0.3 + (index * 0.1),
                              duration: 0.6,
                              ease: [0.16, 1, 0.3, 1]
                            } 
                          }}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          viewport={{ once: true }}
                        >
                          <div className="text-4xl mb-4">{feature.icon}</div>
                          <h4 className="text-white text-xl font-bold mb-2">{feature.title}</h4>
                          <p className="text-blue-100/80">{feature.desc}</p>
                          {feature.highlight && (
                            <div className="mt-3">
                              <span className="inline-block px-3 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-200 rounded-full">
                                Included for Free
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                      <motion.a
                        href="/signup"
                        className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            delay: 0.5,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1]
                          } 
                        }}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: '0 15px 30px -5px rgba(14, 165, 233, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        viewport={{ once: true }}
                      >
                        <span className="relative z-10 flex items-center">
                          Get Started Now
                          <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.a>
                      <motion.a
                        href="/#features"
                        className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white font-medium text-lg rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center group backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            delay: 0.6,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1]
                          } 
                        }}
                        whileHover={{ 
                          scale: 1.03,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        viewport={{ once: true }}
                      >
                        <span className="relative z-10 flex items-center">
                          Explore Features
                          <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </motion.a>
                    </div>
                    <motion.p 
                      className="text-blue-100/70 text-sm mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          delay: 0.7,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1]
                        } 
                      }}
                      viewport={{ once: true }}
                    >
                      No credit card required • 24/7 support
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
