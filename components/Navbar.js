"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-md border-b border-gray-800/50 shadow-xl px-6 py-4 flex items-center justify-between h-18"
    >
      {/* Logo */}
      <Link href="/">
        <motion.h1
          whileHover={{ scale: 1.1 }}
          className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide hover:from-cyan-300 hover:to-blue-400 transition-all duration-300"
        >
          Srantra
        </motion.h1>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-5 items-center font-medium">
        <NavLink href="/about" text="About" />
        <NavLink href="/contact" text="Contact" />
        <NavLink
          href="/queue"
          text="+ Create Queue"
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-blue-500/30"
        />

        {session ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/70 text-white rounded-xl hover:bg-gray-700/80 transition-all duration-300 border border-gray-700 hover:border-gray-600"
            >
              <span>{session.user.name}</span>
              <img
                src={session.user.image}
                alt="profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-lg text-white rounded-xl shadow-2xl overflow-hidden border border-gray-800"
              >
                <Link
                  href="/my-queues"
                  className="block px-5 py-3 hover:bg-gray-800/50 transition-all duration-200 hover:pl-6"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Queues
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-5 py-3 hover:bg-gray-800/50 border-t border-gray-800 transition-all duration-200 hover:pl-6 text-rose-400 hover:text-rose-300"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <NavLink
              href="/login"
              text="Login"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-indigo-500/30"
            />
            <NavLink
              href="/signup"
              text="Sign Up"
              className="px-5 py-2 rounded-lg bg-white text-gray-900 font-medium shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-0.5"
            />
          </>
        )}
      </div>
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
        className={`cursor-pointer transition-all duration-300 relative group ${className} ${
          isActive ? 'text-white font-medium' : 'text-gray-300 hover:text-white'
        }`}
      >
        {text}
        <span 
          className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full ${
            isActive ? 'w-full' : ''
          }`}
        />
      </motion.span>
    </Link>
  );
}

