import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCpu, FiGlobe, FiLayers, FiShield, FiZap } from 'react-icons/fi';

// --- CONFIGURATION ---
const SPRING_OPTIONS = { type: 'spring', stiffness: 180, damping: 25 };
const AUTOPLAY_DELAY = 5000;

const BANNER_DATA = [
  {
    title: 'Cloud Infrastructure',
    description: 'Scalable solutions for modern enterprise needs and high-traffic environments.',
    src: '/logo.png',
    icon: <FiLayers />
  },
  {
    title: 'Global Edge',
    description: 'Deploy your applications closer to your users for sub-millisecond latency.',
    src: '/picture2.png',
    icon: <FiGlobe />
  },
  {
    title: 'Neural Engines',
    description: 'Advanced AI processing and GPU acceleration at your fingertips.',
    src: '/picture3.png',
    icon: <FiCpu />
  },
  {
    title: 'Cyber Security',
    description: 'End-to-end encryption and military-grade protection for all your sensitive data.',
    src: '/picture4.png',
    icon: <FiShield />
  },
  {
    title: 'Fast Delivery',
    description: 'Lightning fast CDN and static hosting optimized for the modern web.',
    src: '/picture5.png',
    icon: <FiZap />
  },
];

// --- SUB-COMPONENT: CAROUSEL ITEM ---
const CarouselItem = ({ item, width, isActive }) => {
  return (
    <motion.div
      className="relative shrink-0 overflow-hidden bg-neutral-900"
      style={{ width }}
    >
      {/* Background Image with Object Fit */}
      <img
        src={item.src}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover select-none"
        loading="eager"
      />

      {/* Glassmorphism / Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 text-indigo-400 mb-4">
            <span className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-md border border-indigo-500/30">
              {item.icon}
            </span>
            <span className="uppercase tracking-[0.2em] text-sm font-semibold">Featured Solution</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            {item.title}
          </h2>
          <p className="text-lg md:text-2xl text-neutral-300 leading-relaxed max-w-xl">
            {item.description}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-indigo-50 transition-colors"
          >
            Explore Technology
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT: BANNER ---
export default function Banner() {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  // 1. Setup Infinite Loop (Clone last item to front, first item to back)
  const displayItems = useMemo(() => {
    if (BANNER_DATA.length === 0) return [];
    return [BANNER_DATA[BANNER_DATA.length - 1], ...BANNER_DATA, BANNER_DATA[0]];
  }, []);

  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // 2. Handle Responsiveness
  useEffect(() => {
    const observe = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    if (containerRef.current) observe.observe(containerRef.current);
    return () => observe.disconnect();
  }, []);

  // 3. Navigation Logic
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIndex((prev) => prev + 1);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIndex((prev) => prev - 1);
  }, [isAnimating]);

  // 4. The Infinite "Snap" Logic
  const handleAnimationComplete = () => {
    setIsAnimating(false);

    // If we've reached the clone of the first item at the end
    if (index >= displayItems.length - 1) {
      x.set(-containerWidth); // Snap instantly back to real first item
      setIndex(1);
    }
    // If we've reached the clone of the last item at the start
    else if (index <= 0) {
      x.set(-(BANNER_DATA.length * containerWidth)); // Snap instantly to real last item
      setIndex(BANNER_DATA.length);
    }
  };

  // 5. Autoplay
  useEffect(() => {
    const interval = setInterval(handleNext, AUTOPLAY_DELAY);
    return () => clearInterval(interval);
  }, [handleNext]);

  const activeDot = (index - 1 + BANNER_DATA.length) % BANNER_DATA.length;

  return (
    <section className="bg-black w-full min-h-[50vh] md:min-h-[70vh] flex flex-col">
      <div
        className="relative w-full overflow-hidden flex-grow h-[50vh]  md:h--[70vh]"
        ref={containerRef}
      >
        <motion.div
          className="flex h-full"
          style={{ x }}
          animate={{ x: -(index * containerWidth) }}
          transition={SPRING_OPTIONS}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={handleAnimationComplete}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100) handleNext();
            else if (info.offset.x > 100) handlePrev();
          }}
        >
          {displayItems.map((item, i) => (
            <CarouselItem
              key={i}
              item={item}
              width={containerWidth}
              // Logic: Is this slide the one currently represented by the active dot?
              isActive={activeDot === (i - 1 + BANNER_DATA.length) % BANNER_DATA.length}
            />
          ))}
        </motion.div>

        {/* Navigation UI: Smaller on mobile, floating on desktop */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2 md:gap-4 z-20">
          <button
            onClick={handlePrev}
            className="p-3 md:p-5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 transition-all active:scale-95"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 md:p-5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 transition-all active:scale-95"
            aria-label="Next slide"
          >
            <FiChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Progress Bar: Hidden on very small screens or made slim */}
        <div className="absolute bottom-8 left-6 md:bottom-14 md:left-20 flex gap-2 md:gap-3 z-20">
          {BANNER_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => !isAnimating && setIndex(i + 1)}
              className="group py-2 md:py-4 focus:outline-none"
            >
              <div className={`h-[3px] md:h-[4px] rounded-full transition-all duration-500 ${activeDot === i
                ? 'w-2  bg-yellow-500 '
                : 'w-2  bg-white/20 group-hover:bg-white/40'
                }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}