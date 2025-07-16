'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.matches('button, a, input, [role="button"]') ||
                          (target.closest('button, a, input, [role="button"]') !== null);
      setIsHovering(Boolean(isInteractive));
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className={`fixed top-0 left-0 w-6 h-6 rounded-full bg-[#FF7300]/20 pointer-events-none z-50 ${
        isHovering ? 'scale-150' : 'scale-100'
      }`}
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#FF7300] to-[#FF4B4B] opacity-30" />
      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF7300] to-[#FF4B4B] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  );
} 