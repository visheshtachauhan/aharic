'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { useSpring } from "framer-motion";

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
      
      const speed = Math.sqrt(e.movementX ** 2 + e.movementY ** 2);
      cursorRotation.set(speed * (e.movementX > 0 ? 0.5 : -0.5));
      
      if (Math.random() > 0.7) {
        const colors = [
          'rgba(147, 197, 253, 0.8)',
          'rgba(103, 232, 249, 0.8)',
          'rgba(165, 243, 252, 0.8)',
          'rgba(186, 230, 253, 0.8)',
          'rgba(224, 242, 254, 0.8)',
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

    const updateCursorType = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a')) {
        setIsPointer(true);
        cursorSize.set(16);
        cursorOpacity.set(0.4);
      } else {
        setIsPointer(false);
        cursorSize.set(8);
        cursorOpacity.set(0.8);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', updateCursorType);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', updateCursorType);
    };
  }, [cursorRotation, cursorSize, cursorOpacity]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50"
        style={{
          width: cursorSize,
          height: cursorSize,
          x: position.x,
          y: position.y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: cursorOpacity,
          rotate: cursorRotation,
          background: isPointer ? 'rgba(125, 211, 252, 0.5)' : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '50%',
          filter: 'blur(3px)',
          transition: 'transform 0.1s ease-out',
        }}
      />
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="fixed top-0 left-0 pointer-events-none z-50"
          style={{
            x: sparkle.x,
            y: sparkle.y,
            width: 4,
            height: 4,
            background: sparkle.color,
            borderRadius: '50%',
            filter: 'blur(2px)',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [1, 1.5, 0], opacity: [1, 0.5, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </>
  );
};

const EnhancedSparkles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          filter: 'blur(3px)',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [0, 1.2, 0],
          opacity: [0, 0.9, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 4,
          repeat: Infinity,
          repeatType: "loop",
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

const TypewriterText = ({ text, delay, color, className }: { text: string; delay: number; color: string; className?: string }) => {
  const characters = Array.from(text);

  return (
    <div className={`inline-block ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: delay + index * 0.08,
          }}
          style={{ color }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

const DreamyText = ({ isReady, onComplete }: { isReady: boolean; onComplete: () => void }) => {
  const textLines = [
    { text: "In a world of menus...", delay: 0.5, color: '#4A5568' },
    { text: "endless scrolling...", delay: 1.8, color: '#4A5568' },
    { text: "and complicated choices...", delay: 3.5, color: '#4A5568' },
    { text: "one platform awakens.", delay: 5.5, color: '#007BFF' },
  ];

  const controls = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
      <AnimatePresence onExitComplete={onComplete}>
        {isReady && (
          <motion.div
            variants={controls}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-center"
          >
            {textLines.map((line, index) => (
              <h1 key={index} className="text-4xl md:text-5xl font-light mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>
                <TypewriterText {...line} />
              </h1>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const GuidingLights = ({ show }: { show: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const steps = [
    {
      title: "Effortless Setup",
      description: "Get your digital menu live in minutes.",
      icon: "✨",
      textStyle: { fontFamily: "'Quicksand', sans-serif" },
    },
    {
      title: "Real-time Updates",
      description: "Change prices, availability, and items instantly.",
      icon: "🔄",
      textStyle: { fontFamily: "'Quicksand', sans-serif" },
    },
    {
      title: "Deeper Insights",
      description: "Understand your customers like never before.",
      icon: "💡",
      textStyle: { fontFamily: "'Quicksand', sans-serif" },
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (show && currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [show, currentStep, steps.length]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="relative w-full max-w-5xl h-[500px]">
        {steps.map((step, index) => {
          const angle = (index / steps.length) * 2 * Math.PI - Math.PI / 2;
          const radiusX = dimensions.width / 2.5;
          const radiusY = dimensions.height / 3;
          const x = dimensions.width / 2 + radiusX * Math.cos(angle);
          const y = dimensions.height / 2 + radiusY * Math.sin(angle);

          return (
            <motion.div
              key={index}
              className="absolute p-6 rounded-2xl bg-white/20 backdrop-blur-lg shadow-2xl w-64 text-center"
              style={{
                left: x - 128,
                top: y - 100,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: index === currentStep ? 1 : 0.4,
                scale: index === currentStep ? 1.1 : 1,
                zIndex: index === currentStep ? 10 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex justify-center mb-4 text-5xl">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2" style={step.textStyle}>
                {step.title}
              </h3>
              <p className="text-sm text-gray-700" style={step.textStyle}>
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const RippleTransition = ({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isActive) {
      setRipples([{ id: Date.now(), x: mousePos.current.x, y: mousePos.current.y }]);
    }
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white"
          style={{
            left: ripple.x,
            top: ripple.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: '200vmax', height: '200vmax', opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onAnimationComplete={onComplete}
        />
      ))}
    </div>
  );
};

export default function DreamyAwakening() {
  const [showText, setShowText] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showRippleTransition, setShowRippleTransition] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTextComplete = useCallback(() => {
    setTimeout(() => setShowGuide(true), 500);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    router.push('/admin/login');
  }, [router]);

  const handleClick = useCallback(() => {
    if (showGuide) {
      setShowRippleTransition(true);
    }
  }, [showGuide]);

  return (
    <div className="relative w-screen h-screen overflow-hidden cursor-pointer" onClick={handleClick}>
      <DreamyBackground isReady={showText} />
      <EnhancedSparkles />
      <CursorEffect />
      <DreamyText isReady={showText} onComplete={handleTextComplete} />
      <GuidingLights show={showGuide} />
      <RippleTransition isActive={showRippleTransition} onComplete={handleTransitionComplete} />
    </div>
  );
}