"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-800/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <motion.img
                src="/images/logo1.png"
                alt="Srantra"
                className="h-14 w-auto rounded-xl border-2 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                style={{
                  backgroundColor: 'transparent',
                  mixBlendMode: 'normal',
                  opacity: 1
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.3)',
                    '0 0 30px rgba(255,255,255,0.4)',
                    '0 0 20px rgba(255,255,255,0.3)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500 ease-out" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/about" text="About" />
            <NavLink href="/contact" text="Contact" />
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/queue"
                className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/40 to-cyan-500/40 backdrop-blur-sm text-white border border-white/30 hover:border-white/40 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">+ Create Queue</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>

            {session ? (
              <div className="relative">
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/15 transition-all duration-500 border border-white/20 hover:border-white/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-semibold">{session.user.name}</span>
                  <div className="relative">
                    <img
                      src={session.user.image}
                      alt="profile"
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/5 animate-pulse" />
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-xl text-white rounded-xl shadow-2xl overflow-hidden border border-white/20"
                    >
                      <Link
                        href="/my-queues"
                        className="block px-4 py-3 hover:bg-white/10 transition-all duration-300 hover:pl-6 border-b border-white/10"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Queues
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-all duration-300 hover:pl-6 text-rose-400 hover:text-rose-300"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/login"
                    className="px-5 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:bg-white/30"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/signup"
                    className="px-6 py-2.5 rounded-xl bg-white/40 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/50 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50"
          >
            <div className="px-4 py-4 space-y-4">
              <MobileNavLink href="/about" text="About" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/contact" text="Contact" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/queue" text="+ Create Queue" onClick={() => setMobileMenuOpen(false)} />
              {session ? (
                <>
                  <MobileNavLink href="/my-queues" text="My Queues" onClick={() => setMobileMenuOpen(false)} />
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/login" text="Login" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink href="/signup" text="Sign Up" onClick={() => setMobileMenuOpen(false)} />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, text, className = "" }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href} passHref>
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative cursor-pointer transition-all duration-500 group ${className} ${
          isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
        } text-lg`}
      >
        {text}
        <span 
          className={`absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full ${
            isActive ? 'w-full' : ''
          }`}
        />
      </motion.span>
    </Link>
  );
}

function MobileNavLink({ href, text, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <motion.span
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`block px-6 py-3 rounded-xl transition-colors text-lg ${
          isActive 
            ? 'bg-white/10 text-white font-semibold' 
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        {text}
      </motion.span>
    </Link>
  );
}

