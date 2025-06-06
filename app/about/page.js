"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Users2, Clock, Heart, Globe, Lightbulb, Award, 
  ShieldCheck, GitBranch, Rocket, Trophy, Zap, Sparkles, BarChart2, 
  Layers, Code, Cloud, Server, Cpu, Lock, Shield, Zap as Lightning,HelpCircle,BookOpen,LifeBuoy, 
  TrendingUp, BarChart, PieChart, LineChart, Activity, Target, CheckCircle, 
  Star, Headset, MessageSquare,Users, ShoppingBag, Building2, Smile, Check, UserCheck, Settings, Award as AwardIcon
} from "lucide-react";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

// Stats and metrics data

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const stats = [
  { 
    value: "10K+", 
    label: "Happy Customers", 
    icon: <Heart className="w-8 h-8 text-pink-500" />,
    description: "Businesses transformed with our solutions"
  },
  { 
    value: "50+", 
    label: "Team Members", 
    icon: <Users2 className="w-8 h-8 text-blue-500" />,
    description: "Experts in queue management"
  },
  { 
    value: "100+", 
    label: "Countries Served", 
    icon: <Globe className="w-8 h-8 text-green-500" />,
    description: "Global reach, local impact"
  },
  { 
    value: "24/7", 
    label: "Customer Support", 
    icon: <Clock className="w-8 h-8 text-yellow-500" />,
    description: "Always here when you need us"
  }
];

const values = [
  {
    title: "Innovation",
    description: "We constantly push boundaries to deliver cutting-edge solutions that transform customer experiences.",
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    color: "from-yellow-400 to-amber-500"
  },
  {
    title: "Excellence",
    description: "We strive for the highest standards in everything we do, ensuring quality and reliability.",
    icon: <Award className="w-6 h-6 text-blue-500" />,
    color: "from-blue-400 to-cyan-500"
  },
  {
    title: "Integrity",
    description: "We believe in transparency, honesty, and doing the right thing, always.",
    icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
    color: "from-green-400 to-emerald-500"
  },
  {
    title: "Collaboration",
    description: "We work together across teams to achieve extraordinary results for our clients.",
    icon: <GitBranch className="w-6 h-6 text-purple-500" />,
    color: "from-purple-400 to-fuchsia-500"
  }
];

const features = [
  {
    title: "Real-time Analytics",
    description: "Get instant insights with our powerful analytics dashboard.",
    icon: <BarChart2 className="w-8 h-8" />,
    color: "text-blue-400"
  },
  {
    title: "Seamless Integration",
    description: "Easily connect with your existing systems and tools.",
    icon: <Layers className="w-8 h-8" />,
    color: "text-purple-400"
  },
  {
    title: "Developer Friendly",
    description: "Comprehensive API and documentation for developers.",
    icon: <Code className="w-8 h-8" />,
    color: "text-green-400"
  },
  {
    title: "Cloud Native",
    description: "Built for the cloud with scalability in mind.",
    icon: <Cloud className="w-8 h-8" />,
    color: "text-cyan-400"
  },
  {
    title: "Enterprise Ready",
    description: "Robust features for businesses of all sizes.",
    icon: <Server className="w-8 h-8" />,
    color: "text-pink-400"
  },
  {
    title: "Lightning Fast",
    description: "Optimized for speed and performance.",
    icon: <Lightning className="w-8 h-8" />,
    color: "text-yellow-400"
  }
];

const metrics = [
  { value: "98%", label: "Uptime", icon: <Activity className="w-6 h-6" /> },
  { value: "4.9/5", label: "Rating", icon: <Star className="w-6 h-6" /> },
  { value: "<1s", label: "Response Time", icon: <Zap className="w-6 h-6" /> },
  { value: "99.9%", label: "Reliability", icon: <Shield className="w-6 h-6" /> },
  { value: "24/7", label: "Support", icon: <Headset className="w-6 h-6" /> },
  { value: "1M+", label: "Processed Daily", icon: <BarChart className="w-6 h-6" /> }
];

const team = [
  {
    name: "Akri Sri Jeevith",
    role: "Founder",
    image: "/team/akri.jpg",
    social: { 
      twitter: "https://x.com/d_lufi85692",
      linkedin: "https://www.linkedin.com/in/srijeevith2288/"
    }
  },
  {
    name: "Lopinti Sravanthi",
    role: "Director",
    image: "/team/sravanthi.jpg",
    social: { 
      linkedin: "https://www.linkedin.com/in/sravanthi-lopinti/"
    }
  }
];

const timeline = [
  {
    year: "2020",
    title: "Company Founded",
    description: "QueueFlow was founded with a vision to revolutionize queue management.",
    icon: <Rocket className="w-5 h-5 text-blue-500" />
  },
  {
    year: "2021",
    title: "First Major Client",
    description: "Secured our first enterprise client with 1000+ daily users.",
    icon: <Trophy className="w-5 h-5 text-yellow-500" />
  },
  {
    year: "2022",
    title: "Product Launch",
    description: "Launched our flagship queue management platform.",
    icon: <Zap className="w-5 h-5 text-purple-500" />
  },
  {
    year: "2023",
    title: "Global Expansion",
    description: "Expanded our services to over 50 countries worldwide.",
    icon: <Globe className="w-5 h-5 text-green-500" />
  },
  {
    year: "2024",
    title: "Award Winning",
    description: "Recognized as the best queue management solution of the year.",
    icon: <Award className="w-5 h-5 text-pink-500" />
  }
];

const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/\D/g, ''));
  const isPercentage = value.includes('%');
  const isTime = value.includes('s');
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(progress * target);
      
      if (isPercentage) {
        setCount(Math.min(currentCount, target) + '%');
      } else if (isTime) {
        setCount(`<${target}s`);
      } else {
        setCount(currentCount);
      }
      
      if (frame >= totalFrames) {
        clearInterval(counter);
        setCount(isTime ? `<${target}${suffix}` : `${target.toLocaleString()}${suffix}`);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [target, suffix, isPercentage, isTime]);
  
  return <span>{count}</span>;
};

export default function AboutPage() {
  const { data: session } = useSession();
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState('story');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (typeof window !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 100; // Adjust based on your navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <Navbar />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"></div>
      </div>
      
      {/* Client-side only animated background */}
      {isClient && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-soft-light filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
        {/* Animated Background Canvas */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-gray-950 via-gray-900 to-gray-950">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>
          </div>

          {/* Floating Animated Particles - Client-side only */}
          {isClient && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-blue-500/20 backdrop-blur-sm"
                  initial={{
                    x: Math.random() * 100 + 'vw',
                    y: Math.random() * 100 + 'vh',
                    width: Math.random() * 20 + 10 + 'px',
                    height: Math.random() * 20 + 10 + 'px',
                    opacity: Math.random() * 0.2 + 0.1,
                  }}
                  animate={{
                    x: ['0%', Math.random() * 100 + 'vw', '0%'],
                    y: ['0%', Math.random() * 100 + 'vh', '0%'],
                    transition: {
                      duration: Math.random() * 40 + 20,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    },
                  }}
                />
              ))}
            </div>
          )}

          {/* Animated Orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-soft-light filter blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-soft-light filter blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full mix-blend-soft-light filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center px-4 sm:px-6 lg:px-8"
          >
            {/* Animated Badge */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <motion.span 
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 rounded-full text-sm font-medium mb-8 border border-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/5"
                whileHover={{
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                  transition: { duration: 0.3 },
                }}
              >
                <motion.span 
                  className="relative flex h-3 w-3 mr-2"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </motion.span>
                About Srantra
              </motion.span>
            </motion.div>
            
            {/* Animated Headline */}
            <motion.div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
              <div className="w-full">
                <motion.div 
                  className="font-bold mb-8 space-y-4 w-full"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
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
                  <motion.h1 
                    className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                  >
                    <motion.span 
                      className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      We're on a mission to
                    </motion.span>
                  </motion.h1>
                  <motion.h1 
                    className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                  >
                    <motion.span 
                      className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 bg-300%"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: 0.4,
                        backgroundPosition: {
                          repeat: Infinity,
                          duration: 8,
                          ease: 'linear',
                        }
                      }}
                    >
                      revolutionize queuing
                    </motion.span>
                  </motion.h1>
                </motion.div>
              </div>
              
              {/* Animated Underline */}
              <motion.div 
                className="h-1 bg-gradient-to-r from-blue-500/0 via-blue-500 to-cyan-500/0 mt-6 mx-auto max-w-md rounded-full"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
              />
            </motion.div>
            
            {/* Animated Description */}
            <motion.div
              className="relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.p 
                className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.8,
                      delay: 0.8,
                      ease: [0.16, 1, 0.3, 1]
                    }
                  }
                }}
              >
                Transforming waiting experiences with cutting-edge queue management solutions that delight customers and optimize business operations worldwide.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={fadeInUp}
            >
              <motion.button
                onClick={() => scrollToSection('story')}
                className={`px-8 py-4 ${activeSection === 'story' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-800'} text-white font-medium rounded-xl transition-all duration-300 flex items-center group`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Our Story
                <ArrowRight className={`ml-2 ${activeSection === 'story' ? 'group-hover:translate-x-1' : ''} transition-transform`} />
              </motion.button>
              
              <motion.button
                onClick={() => scrollToSection('team')}
                className={`px-8 py-4 ${activeSection === 'team' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-800 hover:bg-gray-700'} text-white font-medium rounded-xl border border-gray-700 transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Meet the Team
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Scroll padding for anchor links */}
        <style jsx global>{`
          html {
            scroll-padding-top: 5rem; /* Height of your navbar */
          }
          @media (min-width: 768px) {
            html {
              scroll-padding-top: 6rem; /* Slightly larger for larger screens */
            }
          }
        `}</style>

        {/* Tab Content */}
        <div className="relative">
          {/* Our Story Section */}
          <section 
            id="story" 
            className={`transition-all duration-500 ${activeSection === 'story' ? 'block' : 'hidden'}`}
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800"
            >
              <motion.div variants={fadeInUp} className="text-center mb-14">
                <motion.span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-4">
                  Our Story
                </motion.span>
                <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-300% animate-gradient" variants={fadeInUp}>
                  The QueueFlow Solution
                </motion.h2>
                <motion.div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-8 rounded-full" variants={fadeInUp}></motion.div>
              </motion.div>

              <motion.div className="grid md:grid-cols-5 gap-8 mb-16" variants={staggerContainer}>
                <motion.div className="md:col-span-3 space-y-6 text-gray-300" variants={fadeInUp}>
                  <p className="text-lg leading-relaxed">
                    <span className="text-white font-medium">QueueFlow is a modern queue management system</span> designed to streamline customer flow for businesses of all sizes. Our platform transforms traditional waiting experiences into efficient, digital-first interactions that benefit both businesses and their customers.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Born from the need to <span className="text-white font-medium">eliminate physical queues</span> and reduce wait times, our solution leverages QR code technology to create a seamless check-in process. Customers can join virtual queues from their mobile devices, receiving real-time updates about their position and estimated wait time.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Businesses using QueueFlow report <span className="text-blue-400 font-medium">reduced wait times</span> by up to 40% and <span className="text-cyan-400 font-medium">increased customer satisfaction</span> scores. Our platform is particularly valuable for healthcare providers, government offices, retail stores, and service businesses looking to optimize their operations.
                  </p>
                </motion.div>
                <motion.div className="md:col-span-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border border-gray-700/50 flex items-center justify-center" variants={fadeInUp}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">QR Code</div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider mb-4">Technology</div>
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto my-4 rounded-full"></div>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">40%</div>
                    <div className="text-gray-400 text-sm">Reduction in Wait Times</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Timeline */}
              <motion.div className="relative" variants={fadeInUp}>
                <div className="absolute left-0 md:left-1/2 h-full w-1 bg-gradient-to-b from-blue-500/20 via-cyan-500/50 to-transparent -translate-x-1/2"></div>
                <div className="space-y-12">
                  {[
                    {
                      year: "Check-In",
                      title: "Simple QR Code Scan",
                      description: "Customers scan a QR code to join the virtual queue from their smartphone, eliminating the need for physical waiting lines.",
                      icon: <Rocket className="w-6 h-6 text-blue-400" />
                    },
                    {
                      year: "Queue",
                      title: "Real-Time Updates",
                      description: "Customers receive live updates about their position in line and estimated wait times via SMS or in-app notifications.",
                      icon: <Zap className="w-6 h-6 text-cyan-400" />
                    },
                    {
                      year: "Wait",
                      title: "Freedom to Roam",
                      description: "Customers can wait comfortably anywhere while tracking their position in the queue, receiving alerts when their turn approaches.",
                      icon: <Globe className="w-6 h-6 text-purple-400" />
                    },
                    {
                      year: "Service",
                      title: "Seamless Service",
                      description: "When their turn comes, customers are notified and can proceed to the service counter without unnecessary waiting.",
                      icon: <CheckCircle className="w-6 h-6 text-green-400" />
                    },
                    {
                      year: "Feedback",
                      title: "Valuable Insights",
                      description: "Businesses receive analytics on queue performance, helping them optimize staff allocation and service efficiency.",
                      icon: <BarChart2 className="w-6 h-6 text-yellow-400" />
                    }
                  ].map((item, index) => (
                    <div key={index} className={`relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                      <div className="md:w-1/2 p-4">
                        <div className={`bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border ${index % 2 === 0 ? 'border-blue-500/20' : 'border-cyan-500/20'} hover:border-blue-500/50 transition-all duration-300`}>
                          <div className="flex items-center mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 mr-3">
                              {item.icon}
                            </div>
                            <span className="text-blue-400 font-medium">{item.year}</span>
                          </div>
                          <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                          <p className="text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:block md:w-1/2"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </section>


          
          {/* Meet the Team Section */}
          <section 
            id="team" 
            className={`mt-16 transition-all duration-500 ${activeSection === 'team' ? 'block' : 'hidden'}`}
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800"
            >
              <motion.h2 className="text-3xl md:text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 text-center" variants={fadeInUp}>
                Meet Our Team
              </motion.h2>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" variants={staggerContainer}>
                {team.map((member, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/30 transition-all duration-300 group"
                    variants={fadeInUp}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1)' }}
                  >
                    <div className="h-48 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gray-700/50 border-4 border-white/10 flex items-center justify-center text-4xl font-bold text-white/30">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                      <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                      <div className="flex justify-center space-x-4">
                        {member.social?.twitter && (
                          <a 
                            href={member.social.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="Twitter"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          </a>
                        )}
                        {member.social?.linkedin && (
                          <a 
                            href={member.social.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="LinkedIn"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
        </div>
      </div>

      
      {/* Values Section */}
      <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent w-full h-full"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
              }
            }}
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6"
              variants={fadeInUp}
            >
              Our Core Values
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={fadeInUp}
            >
              Built on a foundation of
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                integrity & innovation
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              These principles guide every decision we make and every product we build.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { 
                      delay: index * 0.15, 
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1]
                    }
                  }
                }}
                whileHover={{ y: -10 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${value.color.split(' ')[0]}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color}/10 backdrop-blur-sm flex items-center justify-center mb-6`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
                
                {/* Animated border effect */}
                <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-${value.color.split(' ')[0]}/20 transition-all duration-500 pointer-events-none`}></div>
              </motion.div>
            ))}
          </div>
          
          {/* Features grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-all duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { 
                      delay: 0.2 + (index * 0.1),
                      duration: 0.6
                    }
                  }
                }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </section>

      {/* CTA Section - Only shown when user is not logged in */}
      {!session?.user && (
        <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent w-full h-full"></div>
            <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
          </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6"
              variants={fadeInUp}
            >
              Ready to Get Started?
            </motion.span>
            
            <motion.div 
              variants={fadeInUp}
              className="w-full px-4"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Transform Your
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Queue Management
                </span>
              </h2>
            </motion.div>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Join thousands of businesses that have streamlined their operations and enhanced customer experiences with Srantra.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-6"
              variants={fadeInUp}
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg md:text-xl font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex items-center shadow-lg transition-all duration-300"
              >
                Start  for Free
                <ArrowRight className="ml-3" size={24} />
              </motion.a>
              
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg md:text-xl font-semibold rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all duration-300 flex items-center"
              >
                Learn More
              </motion.a>
            </motion.div>
            
            {/* Features included in free plan */}
            <motion.div 
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              variants={fadeInUp}
            >
              {[
                { icon: <Check className="w-5 h-5 text-green-400" />, text: "Unlimited Queues" },
                { icon: <Check className="w-5 h-5 text-green-400" />, text: "Basic Analytics" },
                { icon: <Check className="w-5 h-5 text-green-400" />, text: "Email Support" },
                { icon: <Check className="w-5 h-5 text-green-400" />, text: "Up to 50 Users" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {feature.icon}
                  <span className="text-gray-300 text-sm md:text-base">{feature.text}</span>
                </div>
              ))}
            </motion.div>
            
            {/* No credit card required */}
            <motion.div 
              className="mt-8 pt-6 border-t border-gray-800"
              variants={fadeInUp}
            >
              <p className="text-gray-400 text-sm">No credit card required • Cancel anytime • 24/7 Support</p>
            </motion.div>
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
      </section>
  
      )}
      {/* Progress Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-blue-400/20"
        style={{ width: `${scrollYProgress.get() * 100}%` }}
      />
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
                  { name: 'Features', href: '/#features', icon: <Star className="w-4 h-4 mr-2" />, isPage: false },
                  { name: 'How It Works', href: '/#how-it-works', icon: <CheckCircle className="w-4 h-4 mr-2" />, isPage: false },
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