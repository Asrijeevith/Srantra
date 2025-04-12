"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full backdrop-blur-xl bg-gray-900/60 border-b border-gray-800 px-6 py-4 flex justify-between items-center z-50 shadow-lg"
    >
      <Link href="/">
        <h1 className="text-2xl font-extrabold text-white tracking-wide hover:text-blue-400 transition duration-200">
          Srantra
        </h1>
      </Link>

      <div className="hidden md:flex space-x-6 items-center text-l font-semibold text-gray-300">
        <NavLink href="/about" text="About" />
        <NavLink href="/contact" text="Contact" />
        <NavLink href="/queue" text="+ Create Queue" className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-md transition" />

        {session ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              <span>{session.user.name}</span>
              <img src={session.user.image} alt="profile" className="w-8 h-8 rounded-full" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg">
                <Link
                  href="/my-queues"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Queues
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white border-t border-gray-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink href="/login" text="Login" className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-md transition" />
            <NavLink href="/signup" text="Sign Up" className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-700 text-black shadow-md transition" />
          </>
        )}
      </div>
    </motion.nav>
  );
}

function NavLink({ href, text, className = "" }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      className={`cursor-pointer transition duration-200 hover:text-white ${className}`}
    >
      {text}
    </motion.a>
  );
}
