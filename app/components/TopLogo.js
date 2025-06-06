'use client';

import { motion } from 'framer-motion';

export default function TopLogo() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-black/50 backdrop-blur-sm py-2">
      <motion.img
        src="/images/logo.png"
        alt="Srantra"
        className="h-20 w-auto object-contain"
        style={{
          backgroundColor: 'transparent',
          mixBlendMode: 'color-dodge'
        }}
      />
    </div>
  );
} 