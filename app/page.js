"use client";

import Navbar from "@/components/Navbar";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { 
  ArrowRight, 
  Users2,
  Plus,
  PlusCircle,
  ChevronRight,
  Clock,
  BarChart3,
  Users,
  Shield,
  Star,
  CheckCircle,
  ChevronDown,
  Sparkles,
  Zap
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Optimize animations for users who prefer reduced motion
// Type definition for animation variants
/** @type {import('framer-motion').Variants} */
const useOptimizedAnimations = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return useMemo(() => ({
    hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: prefersReducedMotion ? {} : { scale: 1.02 },
    tap: prefersReducedMotion ? {} : { scale: 0.98 },
  }), [prefersReducedMotion]);
};

// Custom animated gradient background component
const AnimatedGradient = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(40px)'
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Floating particles effect
const FloatingParticles = ({ count = 30 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 100],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stats = [
  { value: "10000+", label: "Active Users", icon: <Users size={24} className="text-blue-400" /> },
  { value: "500+", label: "Organizations", icon: <Shield size={24} className="text-green-400" /> },
  { value: "99.9%", label: "Uptime", icon: <BarChart3 size={24} className="text-yellow-400" /> },
  { value: "4.8", label: "Rating", icon: <Star size={24} className="text-yellow-400" /> },
];

const features = [
  {
    icon: <CheckCircle size={40} className="text-green-400" />,
    title: "QR Code Based",
    description: "Users can join queues simply by scanning a QR code, no login required.",
    details: ["Easy to use for customers", "No app installation needed", "Instant queue joining"]
  },
  {
    icon: <Clock size={40} className="text-yellow-400" />,
    title: "Real-time Updates",
    description: "Notify users when their turn is near, reducing wait times and confusion.",
    details: ["Push notifications for updates", "Real-time queue status", "ETA predictions"]
  },
  {
    icon: <Users size={40} className="text-blue-400" />,
    title: "Easy Queue Management",
    description: "Admins can control queues, remove served tokens, and track status.",
    details: ["Dashboard for queue control", "Token management system", "Analytics and reporting"]
  }
];

const howItWorks = [
  {
    step: 1,
    icon: <Users size={48} className="text-blue-400" />,
    title: "Join Queue",
    description: "Scan the QR code at your location to join the queue instantly."
  },
  {
    step: 2,
    icon: <Clock size={48} className="text-yellow-400" />,
    title: "Get Updates",
    description: "Receive real-time updates about your queue position and estimated wait time."
  },
  {
    step: 3,
    icon: <CheckCircle size={48} className="text-green-400" />,
    title: "Complete Service",
    description: "Get notified when it's your turn and complete the service seamlessly."
  }
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const loading = status === 'loading';
  const user = session?.user || null;
  const router = useRouter();
  const animations = useOptimizedAnimations();

  // Handle scroll events to hide indicator at bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight - 100; // 100px threshold
      setShowScrollIndicator(scrollPosition < pageHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track if component is mounted to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Show loading state
  if (loading || !isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Loading QueueFlow...</p>
        </motion.div>
      </div>
    );
  }

  // Handle redirection if needed
  const handleGetStarted = (e) => {
    e.preventDefault();
    if (user) {
      router.push('/dashboard/queues');
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white overflow-x-hidden">
      <Navbar user={user} />
      
      {user ? (
        <>
          {/* Enhanced Hero Section - Welcome Back */}
          <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden mt-24">
            <AnimatedGradient />
            <FloatingParticles count={40} />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-gray-900/80 to-gray-950/90"></div>
            
            {/* Animated floating elements */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`floating-${i}`}
                className="absolute rounded-full bg-white/5"
                style={{
                  width: Math.random() * 300 + 100,
                  height: Math.random() * 300 + 100,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  filter: 'blur(60px)',
                  opacity: 0.3
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 50],
                }}
                transition={{
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />
            ))}
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
              <motion.div
                initial={animations.hidden}
                animate={animations.visible}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <motion.div 
                  className="inline-block mb-2 px-4 py-1.5 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-400/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="flex items-center text-blue-300 text-sm font-medium">
                    <Sparkles className="w-4 h-4 mr-1.5" /> Welcome back, {user.name?.split(' ')[0] || 'there'}!
                  </span>
                </motion.div>
                
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  Ready to manage your <span className="relative">
                    <span className="relative z-10 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">queues</span>
                    <span className="absolute -bottom-1 left-0 w-full h-2 bg-blue-500/20 rounded-full -z-10"></span>
                  </span>?
                </motion.h1>
                
                <motion.p 
                  className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  Everything you need to efficiently manage your customer flow is just a click away.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row justify-center gap-4 mb-12 sm:mb-16 px-4 sm:px-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Link 
                      href="/dashboard/queues" 
                      className="group relative block px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center text-base font-semibold">
                        <Users2 className="w-5 h-5 mr-2" />
                        Go to Dashboard
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Link 
                      href="/queues/new" 
                      className="group relative block px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-400/50 text-gray-200 hover:text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-base font-semibold"
                    >
                      <PlusCircle className="w-5 h-5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                      Create New Queue
                    </Link>
                  </motion.div>
                </motion.div>
                
                {/* Enhanced Stats */}
                <motion.div 
                  className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                >
                  {[
                    { value: '99.9%', label: 'Uptime', color: 'from-blue-400 to-cyan-400' },
                    { value: '24/7', label: 'Support', color: 'from-cyan-400 to-blue-400' },
                    { value: '1M+', label: 'Users', color: 'from-blue-400 to-purple-400' }
                  ].map((stat, index) => (
                    <div key={stat.label} className="text-center">
                      <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
            
            {/* Animated scroll indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, 10, 20]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-8 h-12 border-2 border-blue-400/50 rounded-full flex justify-center p-1">
                <motion.div 
                  className="w-1 h-2 bg-blue-400 rounded-full"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </section>
        </>
      ) : (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedGradient />
        {/* Enhanced background elements with 3D queue visualization */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 overflow-hidden">
          {/* Animated floating queue visualization */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 rounded-full"
              style={{
                width: Math.random() * 20 + 5,
                height: Math.random() * 20 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.8, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8 + Math.random() * 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <motion.div 
            className="max-w-5xl mx-auto text-center pt-24 pb-16 sm:pt-32 sm:pb-20"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
          >
            <div className="relative">
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }
              }}
            >
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
                  Srantra
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-lg rounded-full" />
              </span>
            </motion.h1>
            </div>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.8, 
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1]
                  } 
                }
              }}
            >
              Transform customer experiences with our AI-powered queue management system.
              <span className="block mt-2 text-blue-300 font-medium">
                Reduce wait times by up to 70% and boost customer satisfaction.
              </span>
            </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
                }}
              >
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl opacity-75 blur group-hover:opacity-100 group-hover:blur-md transition duration-300"></div>
                  <Link 
                    href="/auth/signin"
                    className="relative z-10 flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started Free
                    </span>
                    <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
                
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link 
                    href="#features"
                    className="relative z-10 flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300 group"
                  >
                    <span>See How It Works</span>
                    <svg className="ml-3 w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Animated feature highlights */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2
                    }
                  }
                }}
              >
                {[
                  {
                    icon: '⚡',
                    title: 'Lightning Fast',
                    description: 'Process customers in seconds with our optimized queue system',
                    color: 'from-blue-500 to-cyan-400'
                  },
                  {
                    icon: '🤖',
                    title: 'AI-Powered',
                    description: 'Smart algorithms predict and manage queue flow',
                    color: 'from-purple-500 to-pink-400'
                  },
                  {
                    icon: '📱',
                    title: 'Mobile Ready',
                    description: 'Manage queues from anywhere on any device',
                    color: 'from-cyan-400 to-blue-500'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`bg-gradient-to-br ${feature.color}/10 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:shadow-xl transition-all duration-500`}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { 
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1]
                        } 
                      }
                    }}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className={`text-4xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Scroll indicator */}
              {showScrollIndicator && (
                <motion.div 
                  className="fixed bottom-8 left-0 right-0 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  style={{ zIndex: 1000, textAlign: 'center' }}
                >
                  <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Features Section with animated cards */}
      <section id="features" className="relative py-24 px-6 sm:px-4 overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
          
          {/* Floating gradient orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -40, 0],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 30, 0],
              rotate: [0, -15, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 5
            }}
          />
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-20">
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Everything you need to manage your queues efficiently and provide an exceptional customer experience.
            </motion.p>
          </div>
          
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3
                  }
                }
              }}
            >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="h-full group relative p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 100,
                      damping: 15
                    }
                  }
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Animated border effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex-grow">
                    <motion.div 
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <motion.button
                      onClick={() => setActiveFeature(activeFeature === index ? null : index)}
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl flex items-center justify-center group/button transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                      whileHover={{ 
                        y: -2,
                        scale: 1.02,
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{activeFeature === index ? 'Show Less' : 'Learn More'}</span>
                      <motion.span
                        className="ml-2 inline-flex items-center justify-center"
                        animate={{
                          rotate: activeFeature === index ? 180 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </motion.button>
                    
                    <AnimatePresence>
                      {activeFeature === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: '1.5rem' }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-gray-800">
                            <ul className="space-y-3">
                              {feature.details.map((detail, i) => (
                                <motion.li 
                                  key={i}
                                  className="flex items-start text-sm text-gray-300"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * i }}
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                  {detail}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section with Interactive Timeline */}
      <section id="how-it-works" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.span 
              className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-500/10 text-blue-400 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Simple Steps
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Get Started in
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Just 3 Easy Steps
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Our platform is designed to be intuitive and easy to use. Here's how you can get started with QueueFlow today.
            </motion.p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line - very short and subtle */}
            <div className="absolute left-1/2 top-24 bottom-24 w-0.5 -translate-x-1/2">
              <div className="h-full w-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"></div>
            </div>
            
            <div className="space-y-20">
              {howItWorks.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: index * 0.15,
                      duration: 0.6
                    }
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
                >
                  {/* Step content */}
                  <motion.div 
                    className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
                    whileHover={{ 
                      x: index % 2 === 0 ? 10 : -10,
                      transition: { type: 'spring', stiffness: 300, damping: 10 }
                    }}
                  >
                    <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-xl hover:border-blue-500/30 transition-all duration-300 group">
                      {/* Floating number */}
                      <motion.div 
                        className={`absolute -top-6 -left-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20 z-10`}
                        initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                        whileInView={{ 
                          scale: 1, 
                          opacity: 1,
                          rotate: 5,
                        }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: index * 0.15 + 0.2,
                          type: 'spring',
                          stiffness: 500,
                          damping: 15
                        }}
                      >
                        {index + 1}
                      </motion.div>
                      
                      <div className="relative z-0">
                        <div className="flex items-center mb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-400 mr-4">
                            {step.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        </div>
                        <p className="text-gray-400">{step.description}</p>
                        
                        {/* Animated arrow - shorter and less intrusive */}
                        {index < howItWorks.length - 1 && (
                          <motion.div 
                            className={`absolute ${index % 2 === 0 ? 'right-4' : 'left-4'} -bottom-6`}
                            animate={{
                              y: [0, 6, 0],
                            }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-0.5 bg-gradient-to-b from-blue-400/50 to-transparent mb-1"></div>
                              <ChevronDown size={20} className="text-blue-400/70" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Step image/illustration */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <motion.div 
                      className="relative"
                      initial={{ scale: 0.95, opacity: 0 }}
                      whileInView={{ 
                        scale: 1, 
                        opacity: 1,
                        transition: { 
                          delay: index * 0.15 + 0.1,
                          duration: 0.6
                        }
                      }}
                      viewport={{ once: true }}
                    >
                      <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/50 p-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl -m-1"></div>
                        <div className="relative bg-gray-900/80 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-blue-400">
                              {step.icon}
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">Step {index + 1}</h4>
                            <p className="text-gray-400 text-sm">{step.title}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative elements */}
                      <motion.div 
                        className="absolute -z-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl -top-10 -right-10"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Show different content based on authentication status */}
            {!session ? (
              <motion.div 
                className="relative mt-24 py-20 px-6 sm:px-8 rounded-3xl overflow-hidden border border-gray-800/50"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
              {/* Original CTA content for non-logged in users */}
              {/* Animated background elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-950/90"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>
                <div className="absolute inset-0 bg-[url('https://tailwindcss.com/gradients/100x100-dark.svg')] bg-[size:100%_100%] opacity-10"></div>
              </div>
              
              <div className="relative max-w-4xl mx-auto">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-pink-400 bg-pink-500/10 rounded-full backdrop-blur-sm border border-pink-500/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Limited Time Offer
                </motion.div>
                
                <motion.h3 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Ready to Transform Your 
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                    {' '}Business?
                  </span>
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Join now and get <span className="font-semibold text-white ">free access</span> to Srantra. 
                </motion.p>
                
                <motion.div
                  className="flex flex-col sm:flex-row justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.a
                    href="#"
                    className="group relative px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300 overflow-hidden"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: '0 15px 30px -5px rgba(236, 72, 153, 0.5)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Your Free Trial
                      <Zap className="ml-3 group-hover:scale-110 transition-transform" size={20} fill="currentColor" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.a>
                  
                  <motion.a
                    href="#"
                    className="group relative px-8 py-4 text-lg font-medium rounded-xl bg-transparent text-white border border-gray-700 hover:border-pink-400/50 hover:bg-gray-800/30 transition-all duration-300 overflow-hidden"
                    whileHover={{ 
                      scale: 1.03,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Book a Personalized Demo
                      <Users2 className="ml-3 text-pink-400 group-hover:scale-110 transition-transform" size={20} />
                    </span>
                  </motion.a>
                </motion.div>
                
                <motion.div 
                  className="mt-6 text-center text-sm text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <p>Trusted by 5,000+ businesses worldwide</p>
                  <div className="flex items-center justify-center mt-4 space-x-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                        <Users2 className="w-4 h-4 text-white" />
                      </div>
                    ))}
                    <span className="text-xs">and many more...</span>
                  </div>
                </motion.div>
              </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Unique CTA Section - Only show when user is not logged in */}
      {!user && (
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900 border-t border-gray-800/50">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            
            {/* Animated gradient orbs */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -40, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 30, 0],
                rotate: [0, -15, 0]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 5
              }}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/80"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Srantra
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Revolutionizing queue management with cutting-edge technology and exceptional service.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <svg key="facebook" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>, label: 'Facebook' },
                  { icon: <svg key="twitter" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>, label: 'Twitter' },
                  { icon: <svg key="instagram" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>, label: 'Instagram' },
                  { icon: <svg key="linkedin" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" /></svg>, label: 'LinkedIn' },
                ].map((social, i) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['Features', 'How It Works', 'Pricing', 'About Us', 'Contact'].map((link, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'Help Center', 'Community', 'Blog'].map((link, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and news.</p>
              <form className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                  <ArrowRight className="ml-2 w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Srantra. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div 
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      </footer>
    </div>
  );
}

