import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const GAP = 20;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

const CarouselItem = ({ item, index, width, x, trackOffset, round }) => {
  // 3D rotation effect based on scroll position
  const range = [-(index + 1) * trackOffset, -index * trackOffset, -(index - 1) * trackOffset];
  const rotateY = useTransform(x, range, [45, 0, -45], { clamp: false });

  return (
    <motion.div
      className={`relative shrink-0 flex flex-col p-6 overflow-hidden cursor-grab active:cursor-grabbing
        ${round ? 'rounded-full aspect-square justify-center items-center' : 'rounded-2xl justify-between'} 
        bg-neutral-900 border border-neutral-800 shadow-xl`}
      style={{ width, rotateY, perspective: 1000 }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
        {item.icon}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold text-white">{item.title}</h3>
        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
};

export default function Carousel({
  items = [],
  autoplay = true,
  autoplayDelay = 3500,
  loop = true,
  round = false
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  
  // Calculate responsive item width (1 card mobile, 2 tablet, 3 desktop)
  const itemWidth = useMemo(() => {
    if (containerWidth < 640) return containerWidth - 40;
    if (containerWidth < 1024) return (containerWidth - GAP) / 2;
    return (containerWidth - (GAP * 2)) / 3;
  }, [containerWidth]);

  const trackOffset = itemWidth + GAP;
  const x = useMotionValue(0);

  // For infinite loop, we clone items at start and end
  const displayItems = useMemo(() => {
    if (!loop || items.length === 0) return items;
    return [...items.slice(-1), ...items, ...items.slice(0, 1)];
  }, [items, loop]);

  const [index, setIndex] = useState(loop ? 1 : 0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Resize Observer for true responsiveness
  useEffect(() => {
    const observe = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    if (containerRef.current) observe.observe(containerRef.current);
    return () => observe.disconnect();
  }, []);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIndex((prev) => prev + 1);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIndex((prev) => prev - 1);
  }, [isAnimating]);

  // Infinite Loop "Snap" Logic
  const handleAnimationComplete = () => {
    setIsAnimating(false);
    if (!loop) return;

    if (index >= displayItems.length - 1) {
      x.set(-trackOffset);
      setIndex(1);
    } else if (index <= 0) {
      x.set(-(items.length * trackOffset));
      setIndex(items.length);
    }
  };

  // Autoplay
  useEffect(() => {
    if (!autoplay || isAnimating) return;
    const interval = setInterval(handleNext, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, handleNext, autoplayDelay, isAnimating]);

  const activeDot = loop ? (index - 1 + items.length) % items.length : index;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 group" ref={containerRef}>
      <div className="relative overflow-visible">
        <motion.div
          className="flex"
          style={{ x, gap: GAP }}
          animate={{ x: -(index * trackOffset) }}
          transition={SPRING_OPTIONS}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={handleAnimationComplete}
          drag="x"
          dragConstraints={{ left: -(displayItems.length * trackOffset), right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) handleNext();
            else if (info.offset.x > 50) handlePrev();
          }}
        >
          {displayItems.map((item, i) => (
            <CarouselItem 
              key={i} 
              item={item} 
              index={i} 
              width={itemWidth} 
              x={x} 
              trackOffset={trackOffset}
              round={round}
            />
          ))}
        </motion.div>

        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev}
          className="absolute -left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="absolute -right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-1 transition-all duration-300 rounded-full ${
              activeDot === i ? 'w-8 bg-indigo-500' : 'w-2 bg-neutral-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}