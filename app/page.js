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
  Zap,
  HelpCircle,
  BookOpen,
  LifeBuoy
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Map from './components/Map';

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
          <p className="text-gray-400">Loading Srantra...</p>
        </motion.div>
      </div>
    );
  }

  // Handle redirection if needed
  const handleGetStarted = (e) => {
    e.preventDefault();
    if (user) {
      router.push('/my-queues');
    } else {
      router.push('/auth/signup');
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
                      href="/my-queues" 
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
                      href="/queue" 
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
                    href="/signup"
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
                      y: -5,
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
                      onClick={() => setActiveFeature(feature)}
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl flex items-center justify-center group/button transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                      whileHover={{ 
                        y: -2,
                        scale: 1.02,
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Learn More</span>
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Feature Modal */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-lg w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveFeature(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-6">
                {activeFeature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{activeFeature.title}</h3>
              <p className="text-gray-300 mb-6">{activeFeature.description}</p>
              <div className="space-y-3">
                {activeFeature.details.map((detail, i) => (
                  <div key={i} className="flex items-start text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    {detail}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <motion.button
                  onClick={() => setActiveFeature(null)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    href="/signup"
                    className="group relative px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300 overflow-hidden"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: '0 15px 30px -5px rgba(236, 72, 153, 0.5)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Your Journey
                      <Zap className="ml-3 group-hover:scale-110 transition-transform" size={20} fill="currentColor" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.a>
                  
                  
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
            {/* Project Info */}
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
                A modern queue management system developed as a placement project, showcasing full-stack development skills and best practices.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <svg key="github" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.466.35.748.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>, label: 'GitHub', href: 'https://github.com/Asrijeevith' },
                  { icon: <svg key="linkedin" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>, label: 'LinkedIn', href: "https://www.linkedin.com/in/srijeevith2288/" },
                  { icon: <svg key="email" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>, label: 'Email', href: "mailto:jeevith5432@gmail.com" }
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

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Features', href: '#features', icon: <Star className="w-4 h-4 mr-2" />, isPage: false },
                  { name: 'How It Works', href: '#how-it-works', icon: <CheckCircle className="w-4 h-4 mr-2" />, isPage: false },
                  { name: 'FAQ', href: '/faq', icon: <HelpCircle className="w-4 h-4 mr-2" />, isPage: true },
                  { name: 'User Guide', href: '/user-guide', icon: <BookOpen className="w-4 h-4 mr-2" />, isPage: true },
                  { name: 'Support', href: '/support', icon: <LifeBuoy className="w-4 h-4 mr-2" />, isPage: true }
                ].map((link, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    {link.isPage ? (
                      <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center">
                        {link.icon}
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center">
                        {link.icon}
                        {link.name}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Technologies</h3>
              <ul className="space-y-3">
                {['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'MongoDB'].map((tech, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <span className="text-gray-400 hover:text-white transition-colors">
                      {tech}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Get in Touch</h3>
              <p className="text-gray-400 mb-4">Interested in this project? Feel free to reach out!</p>
              
                <Link href="/contact">
                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact Me
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.button>
                </Link>
              
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
