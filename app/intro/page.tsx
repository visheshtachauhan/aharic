'use client';

import { motion, useAnimation, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Montserrat, Raleway, Quicksand } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

const raleway = Raleway({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

const DreamySparkle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-1.5 h-1.5"
    style={{
      background: 'white',
      borderRadius: '50%',
      filter: 'blur(2px)',
      boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
    }}
    initial={{ 
      x: `${Math.random() * 100}vw`,
      y: `${Math.random() * 100}vh`,
      scale: 0,
      opacity: 0 
    }}
    animate={{
      y: [0, -30, 0],
      scale: [0, 1, 0],
      opacity: [0, 0.8, 0],
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      delay: delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const FlowingGradient = () => (
  <motion.div
    className="absolute inset-0"
    animate={{
      background: [
        'radial-gradient(circle at center, rgba(186, 230, 253, 0.4) 0%, rgba(125, 211, 252, 0.3) 30%, rgba(56, 189, 248, 0.2) 60%, rgba(14, 165, 233, 0.1) 100%)',
        'radial-gradient(circle at center, rgba(147, 197, 253, 0.4) 0%, rgba(96, 165, 250, 0.3) 30%, rgba(59, 130, 246, 0.2) 60%, rgba(37, 99, 235, 0.1) 100%)',
        'radial-gradient(circle at center, rgba(186, 230, 253, 0.4) 0%, rgba(125, 211, 252, 0.3) 30%, rgba(56, 189, 248, 0.2) 60%, rgba(14, 165, 233, 0.1) 100%)',
      ]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const DreamyBackground = ({ isReady }: { isReady: boolean }) => {
  return (
    <>
      {/* Initial white glow */}
      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: isReady ? [1, 0] : 1 
        }}
        transition={{ 
          duration: 3,
          ease: "easeOut"
        }}
      >
        <div className="absolute inset-0 bg-white" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, white 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
          }}
          animate={{
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Gradient background */}
      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 3 }}
      >
        {/* Base gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-cyan-100 to-rose-50" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/50 to-cyan-100/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-sky-100/40 to-blue-100/40" />
        
        {/* Animated color flows */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-200/40 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-200/30 to-transparent"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-100/20 to-transparent"
          animate={{
            y: ['100%', '-100%'],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Additional color pulses */}
        <FlowingGradient />
      </motion.div>

      {/* Enhanced sparkles */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <DreamySparkle key={i} delay={i * 0.15} />
        ))}
      </div>

      {/* Subtle light beams */}
      <motion.div
        className="fixed inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 0.2 : 0 }}
        transition={{ duration: 3 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 w-px h-screen origin-center"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
              transform: `rotate(${i * 72}deg) translateX(${50 + Math.random() * 50}%)`,
            }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </>
  );
};

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number; color: string }>>([]);
  const sparkleId = useRef(0);
  const cursorSize = useSpring(8, { damping: 25, stiffness: 300 });
  const cursorOpacity = useSpring(0.8, { damping: 25, stiffness: 300 });
  const cursorRotation = useSpring(0, { damping: 20, stiffness: 250 });

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Rotate cursor based on movement with reduced rotation
      const speed = Math.sqrt(e.movementX ** 2 + e.movementY ** 2);
      cursorRotation.set(speed * (e.movementX > 0 ? 0.5 : -0.5));
      
      // Add sparkles with varying colors
      if (Math.random() > 0.7) { // Reduced sparkle frequency
        const colors = [
          'rgba(147, 197, 253, 0.8)', // blue-300
          'rgba(103, 232, 249, 0.8)', // cyan-300
          'rgba(165, 243, 252, 0.8)', // cyan-200
          'rgba(186, 230, 253, 0.8)', // sky-200
          'rgba(224, 242, 254, 0.8)', // sky-100
        ];
        const newSparkle = {
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          id: sparkleId.current++,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        setSparkles(prev => [...prev, newSparkle]);
        
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1000);
      }
    };

    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      const isInteractive = !!hoveredElement?.matches('button, a, input, [role="button"]');
      setIsPointer(isInteractive);
      cursorSize.set(isInteractive ? 12 : 8);
      cursorOpacity.set(isInteractive ? 1 : 0.8);
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousemove', updateCursorType);
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousemove', updateCursorType);
    };
  }, [position, cursorSize, cursorOpacity, cursorRotation]);

  return (
    <>
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-plus-lighter"
        style={{
          x: position.x - 8,
          y: position.y - 8,
        }}
      >
        {/* Main Cursor */}
        <motion.div 
          className="relative"
          style={{ 
            width: cursorSize,
            height: cursorSize,
            rotate: cursorRotation,
            opacity: cursorOpacity,
            transform: `translate(-50%, -50%)`,
          }}
        >
          {/* Core */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-400 via-cyan-300 to-sky-200" />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-200 to-transparent opacity-50 blur-[2px]" />
          
          {/* Outer ring */}
          <div className="absolute -inset-1 rounded-full border border-cyan-200/30" />
          
          {/* Ambient glow */}
          <div className="absolute -inset-2 rounded-full bg-cyan-300/20 blur-md" />
          
          {/* Interactive state effects */}
          {isPointer && (
            <>
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-cyan-200/30"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="absolute -inset-3 rounded-full border border-cyan-100/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.5 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Enhanced Sparkle Trail */}
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="fixed top-0 left-0 pointer-events-none z-40"
          style={{ x: sparkle.x, y: sparkle.y }}
        >
          {/* Main sparkle */}
          <motion.div
            className="absolute w-2 h-2 -translate-x-1 -translate-y-1"
            style={{ background: sparkle.color, borderRadius: '50%' }}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{
              scale: [0.8, 0.4, 0],
              opacity: [0.8, 0.4, 0],
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute w-3 h-3 -translate-x-1.5 -translate-y-1.5 blur-sm"
            style={{ background: sparkle.color, borderRadius: '50%' }}
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{
              scale: [1, 0.5, 0],
              opacity: [0.4, 0.2, 0],
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Outer particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 -translate-x-0.5 -translate-y-0.5"
              style={{ 
                background: sparkle.color,
                borderRadius: '50%',
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0.5,
                opacity: 0.6,
              }}
              animate={{
                x: Math.cos(i * Math.PI / 2) * 10,
                y: Math.sin(i * Math.PI / 2) * 10,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      ))}
    </>
  );
};

const EnhancedSparkles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(60)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: 'white',
          borderRadius: '50%',
          filter: 'blur(1px)',
          boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
        }}
        initial={{ 
          scale: 0,
          opacity: 0,
          y: 0
        }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0],
          y: -30
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const TypewriterText = ({ text, delay, color, className }: { text: string; delay: number; color: string; className?: string }) => {
  const characters = Array.from(text);
  
  return (
    <motion.h1
      className={`text-5xl tracking-wide ${className}`}
      style={{
        color: color,
        textShadow: '0 0 20px rgba(186, 230, 253, 0.5)',
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: delay + index * 0.03, // Faster character appearance
            ease: "easeOut"
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const DreamyText = ({ isReady, onComplete }: { isReady: boolean; onComplete: () => void }) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const glowOpacity = useSpring(0, { damping: 15, stiffness: 60 });

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        setStartAnimation(true);
        glowOpacity.set(0.8);
      }, 800);

      // Start fade out after all text has appeared and been visible
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 800); // Call onComplete after fade out
      }, 3500);
    }
  }, [isReady, glowOpacity, onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: fadeOut ? 0 : (startAnimation ? 1 : 0) }}
      transition={{ duration: 0.8 }}
    >
      {/* Main text container */}
      <div className="relative flex flex-col items-center gap-4">
        {startAnimation && (
          <>
            {/* English Welcome */}
            <TypewriterText
              text="Welcome, Boss"
              delay={0.2}
              color="#1e3a8a"
              className="font-serif"
            />

            {/* Hindi Welcome */}
            <TypewriterText
              text="स्वागत है, बॉस"
              delay={0.8} // Reduced from 1.5
              color="#1e40af"
              className="font-['Noto_Sans_Devanagari']"
            />

            {/* Gujarati Welcome */}
            <TypewriterText
              text="સ્વાગત છે, બોસ"
              delay={1.4} // Reduced from 2.8
              color="#1e4ed8"
              className="font-['Noto_Sans_Gujarati']"
            />
          </>
        )}

        {/* Enhanced glow effect */}
        <motion.div
          className="absolute -inset-8"
          style={{
            background: 'radial-gradient(circle at center, rgba(186, 230, 253, 0.15), transparent 70%)',
            opacity: glowOpacity,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating orbs */}
      {[...Array(12)].map((_, i) => {
        // Randomly determine size class for each orb
        const sizeClass = Math.random() > 0.7 ? 'large' : Math.random() > 0.5 ? 'medium' : 'small';
        const sizes = {
          large: { width: 'w-4', height: 'h-4', blur: 'blur-[2px]' },
          medium: { width: 'w-3', height: 'h-3', blur: 'blur-[1.5px]' },
          small: { width: 'w-2', height: 'h-2', blur: 'blur-[1px]' }
        };

        // Ethereal color variations
        const colors = [
          'rgba(186, 230, 253, 0.5)', // sky-200
          'rgba(224, 242, 254, 0.5)', // sky-100
          'rgba(186, 230, 253, 0.4)', // lighter sky-200
          'rgba(207, 250, 254, 0.5)', // cyan-100
        ];

        return (
          <motion.div
            key={i}
            className={`absolute ${sizes[sizeClass].width} ${sizes[sizeClass].height} rounded-full ${sizes[sizeClass].blur}`}
            style={{
              background: `radial-gradient(circle at center, ${colors[i % colors.length]}, rgba(255, 255, 255, 0.2))`,
              boxShadow: '0 0 15px rgba(186, 230, 253, 0.3)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * (sizeClass === 'large' ? 120 : 80)],
              y: [0, (Math.random() - 0.5) * (sizeClass === 'large' ? 120 : 80)],
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        );
      })}

      {/* Breeze effect particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1"
          style={{
            background: 'linear-gradient(to right, rgba(186, 230, 253, 0.3), rgba(125, 211, 252, 0.15))',
            borderRadius: '50%',
            filter: 'blur(1px)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 100 + Math.random() * 50],
            y: [0, (Math.random() - 0.5) * 30],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </motion.div>
  );
};

const GuidingLights = ({ isReady, show }: { isReady: boolean; show: boolean }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const steps = [
    { 
      text: "Your Passion, Our Platform",
      textStyle: {
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 4px 8px rgba(0,0,0,0.2)',
        fontFamily: 'serif',
        letterSpacing: '0.05em',
        fontWeight: '600'
      },
      containerStyle: {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 8px 32px rgba(30,58,138,0.3)',
        transform: 'perspective(1000px) rotateX(5deg)',
        borderRadius: '2rem',
        padding: '2rem 3rem'
      } as const,
      backgroundAnimation: (
        <motion.div className="absolute inset-0 overflow-hidden">
          {/* Kitchen utensils floating */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`utensil-${i}`}
              className="absolute"
              initial={{ 
                x: Math.random() * dimensions.width,
                y: dimensions.height + 100,
                rotate: 0,
                opacity: 0 
              }}
              animate={{
                y: [-100, dimensions.height + 100],
                rotate: [0, 360],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
            >
              <div 
                className={`w-16 h-16 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 backdrop-blur-sm rounded-full 
                  flex items-center justify-center transform hover:scale-110 transition-transform`}
                style={{
                  boxShadow: '0 0 20px rgba(255,107,107,0.2)'
                }}
              >
                <div className={`w-10 h-10 bg-gradient-to-br from-orange-300/40 to-yellow-300/40 
                  ${i % 4 === 0 ? 'rounded-full' : 
                    i % 4 === 1 ? 'rounded-sm rotate-45' : 
                    i % 4 === 2 ? 'rounded-lg' : 
                    'rounded-md'}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )
    },
    {
      text: "From Your Heart to Their Plate",
      textStyle: {
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #60a5fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 4px 8px rgba(0,0,0,0.2)',
        fontFamily: 'serif',
        letterSpacing: '0.05em',
        fontWeight: '600'
      },
      containerStyle: {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 8px 32px rgba(37,99,235,0.3)',
        transform: 'perspective(1000px) rotateX(-5deg)',
        borderRadius: '2rem',
        padding: '2rem 3rem'
      } as const,
      backgroundAnimation: (
        <motion.div className="absolute inset-0 overflow-hidden">
          {/* Cooking ingredients */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`ingredient-${i}`}
              className="absolute"
              initial={{ 
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                scale: 0,
                rotate: 0
              }}
              animate={{
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                scale: [0, 1, 0],
                rotate: [0, 360],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              <div className={`w-20 h-20 backdrop-blur-md rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform
                ${i % 3 === 0 ? 'bg-gradient-to-br from-green-400/20 to-emerald-400/20' : 
                  i % 3 === 1 ? 'bg-gradient-to-br from-emerald-400/20 to-lime-400/20' : 
                  'bg-gradient-to-br from-lime-400/20 to-green-400/20'}`}
              >
                <div className={`w-12 h-12 
                  ${i % 4 === 0 ? 'rounded-full bg-gradient-to-br from-green-200/40 to-emerald-200/40' :
                    i % 4 === 1 ? 'rounded bg-gradient-to-br from-emerald-200/40 to-lime-200/40' :
                    i % 4 === 2 ? 'rounded-sm bg-gradient-to-br from-lime-200/40 to-green-200/40' :
                    'rounded-lg bg-gradient-to-br from-green-100/40 to-emerald-100/40'
                  }`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )
    },
    {
      text: "Let's Build Something Amazing Together",
      textStyle: {
        background: 'linear-gradient(135deg, #1e40af, #3b82f6, #93c5fd)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 4px 8px rgba(0,0,0,0.2)',
        fontFamily: 'serif',
        letterSpacing: '0.05em',
        fontWeight: '600'
      },
      containerStyle: {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 8px 32px rgba(59,130,246,0.3)',
        transform: 'perspective(1000px) rotateX(5deg)',
        borderRadius: '2rem',
        padding: '2rem 3rem'
      } as const,
      backgroundAnimation: (
        <motion.div className="absolute inset-0 overflow-hidden">
          {/* Restaurant elements */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={`restaurant-${i}`}
              className="absolute"
              initial={{ 
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                rotate: 0,
                opacity: 0
              }}
              animate={{
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                rotate: 360,
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut"
              }}
            >
              <div className={`backdrop-blur-lg rounded-2xl p-6 transform hover:scale-110 transition-transform
                ${i % 3 === 0 ? 'bg-gradient-to-br from-pink-400/10 to-rose-400/10' : 
                  i % 3 === 1 ? 'bg-gradient-to-br from-rose-400/10 to-pink-400/10' : 
                  'bg-gradient-to-br from-fuchsia-400/10 to-pink-400/10'}`}
              >
                <div className={`w-14 h-14 
                  ${i % 5 === 0 ? 'rounded-full bg-gradient-to-br from-pink-200/40 to-rose-200/40' :
                    i % 5 === 1 ? 'rounded-lg bg-gradient-to-br from-rose-200/40 to-pink-200/40' :
                    i % 5 === 2 ? 'rounded-sm bg-gradient-to-br from-fuchsia-200/40 to-pink-200/40' :
                    i % 5 === 3 ? 'rounded-3xl bg-gradient-to-br from-pink-100/40 to-rose-100/40' :
                    'rounded-md bg-gradient-to-br from-rose-100/40 to-pink-100/40'
                  }`} />
              </div>
            </motion.div>
          ))}

          {/* Sparkle effects */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                background: `rgba(${244 + Math.random() * 10}, ${114 + Math.random() * 50}, ${182 + Math.random() * 5}, 0.6)`,
                borderRadius: '50%',
                filter: 'blur(1px)'
              }}
              initial={{ 
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                scale: 0
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                y: [0, -40 - Math.random() * 60]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )
    }
  ];

  useEffect(() => {
    if (show && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, currentStep]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* Background animations container */}
      <div className="absolute inset-0 overflow-hidden">
        {steps.map((step, index) => (
          <motion.div
            key={`bg-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentStep ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {step.backgroundAnimation}
          </motion.div>
        ))}
      </div>

      {/* Content container */}
      <div className="relative flex flex-col items-center justify-center pointer-events-none max-w-4xl mx-auto px-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={`absolute ${index === currentStep ? 'pointer-events-auto' : 'pointer-events-none'}`}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{
              opacity: index === currentStep ? 1 : 0,
              y: index === currentStep ? 0 : 40,
              scale: index === currentStep ? 1 : 0.9,
            }}
            transition={{ 
              duration: 1.2,
              ease: "easeInOut",
              delay: index === currentStep ? 0.1 : 0
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Icon */}
            <motion.div 
              className="flex justify-center mb-8"
              animate={{
                y: isHovering ? [-4, 4, -4] : 0
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Icon content */}
            </motion.div>

            {/* Text box */}
            <motion.div
              className="relative px-12 py-8 rounded-2xl overflow-hidden"
              initial={{ opacity: 1 }}
              style={{
                background: step.containerStyle.background,
                backdropFilter: step.containerStyle.backdropFilter,
                border: step.containerStyle.border,
                boxShadow: step.containerStyle.boxShadow,
                transform: step.containerStyle.transform,
                borderRadius: step.containerStyle.borderRadius,
                padding: step.containerStyle.padding
              }}
              animate={{
                scale: isHovering ? 1.05 : 1,
                rotateY: isHovering ? [0, 2, -2, 0] : 0,
                boxShadow: isHovering
                  ? '0 0 50px rgba(255,255,255,0.3)'
                  : '0 0 30px rgba(255,255,255,0.1)',
              }}
              transition={{ 
                duration: 1.2, 
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0"
                animate={{
                  opacity: isHovering ? [0, 0.1, 0] : 0,
                  scale: isHovering ? [0.8, 1.2, 0.8] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.8), transparent)',
                  filter: 'blur(20px)',
                }}
              />
              
              <motion.h2
                className="text-7xl font-bold text-center tracking-wider relative z-10"
                style={step.textStyle}
                animate={{
                  scale: isHovering ? [1, 1.05, 1] : 1,
                  filter: isHovering ? 'brightness(1.2)' : 'brightness(1)',
                  letterSpacing: isHovering ? '0.12em' : '0.1em',
                }}
                transition={{ 
                  duration: 1.6,
                  ease: "easeInOut",
                  letterSpacing: {
                    duration: 0.8,
                    ease: "easeOut"
                  }
                }}
              >
                {step.text}
              </motion.h2>

              {/* Decorative elements */}
              <motion.div
                className="absolute -inset-px rounded-2xl"
                style={{
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  opacity: 0,
                }}
                animate={{
                  opacity: isHovering ? [0, 0.6, 0] : 0,
                  rotate: isHovering ? [0, 5, 0] : 0,
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const RippleTransition = ({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showAurora, setShowAurora] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isActive) {
      // Create multiple ripples from the last mouse position
      const newRipples = Array.from({ length: 12 }, (_, i) => ({
        x: mousePos.x,
        y: mousePos.y,
        id: Date.now() + i,
      }));
      setRipples(prev => [...prev, ...newRipples]);

      // Show aurora effect after ripples start
      setTimeout(() => setShowAurora(true), 800);

      // Trigger the completion callback after animation
      setTimeout(onComplete, 2000);
    }
  }, [isActive, mousePos.x, mousePos.y, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Aurora Effect */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: showAurora ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Northern lights effect */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(45deg, rgba(88, 28, 135, 0.15), rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))',
                  filter: 'blur(80px)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(-45deg, rgba(124, 58, 237, 0.12), rgba(59, 130, 246, 0.12), rgba(14, 165, 233, 0.12))',
                  filter: 'blur(90px)',
                }}
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Background fade */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Enhanced ripple effects */}
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 2,
                height: 2,
                background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                borderRadius: '50%',
                filter: 'blur(2px)',
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: [1, Math.random() * 150 + 100],
                opacity: [1, 0],
                x: [0, (Math.random() - 0.5) * 1200],
                y: [0, (Math.random() - 0.5) * 1200],
              }}
              transition={{
                duration: 2.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Enhanced light trails */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 1 }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '200px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #93c5fd, transparent)',
                  filter: 'blur(3px)',
                }}
                animate={{
                  x: [0, window.innerWidth],
                  opacity: [0, 0.9, 0],
                  scale: [1, Math.random() * 0.5 + 1],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.08,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Form emergence effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 via-transparent to-cyan-400/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: showAurora ? 1 : 0,
              scale: showAurora ? 1 : 0.8,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function DreamyAwakening() {
  const [isReady, setIsReady] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showRippleTransition, setShowRippleTransition] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsReady(true);
    setTimeout(() => {
      setShowText(true);
    }, 1500);
  }, []);

  const handleTextComplete = () => {
    setShowGuide(true);
  };

  const handleTransitionComplete = () => {
    router.push('/signup'); // Replace with your actual signup route
  };

  const handleClick = () => {
    setShowRippleTransition(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden cursor-pointer" onClick={handleClick}>
      <DreamyBackground isReady={isReady} />
      <EnhancedSparkles />
      <CursorEffect />
      <DreamyText isReady={showText} onComplete={handleTextComplete} />
      <GuidingLights isReady={showText} show={showGuide} />
      <RippleTransition isActive={showRippleTransition} onComplete={handleTransitionComplete} />
    </div>
  );
} 