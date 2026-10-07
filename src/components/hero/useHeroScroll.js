import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for high-performance pinned hero scroll storytelling.
 * Decouples scroll listeners from React render cycles using refs & rAF.
 *
 * @param {Object} options
 * @param {React.RefObject} options.containerRef - Ref of the 400vh container
 * @param {number} options.totalFrames - Total extracted frames (e.g. 144)
 * @param {Function} options.onRenderProgress - Callback called on each rAF tick with interpolated progress and frameIndex
 */
export function useHeroScroll({ containerRef, totalFrames = 144, onRenderProgress }) {
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef(null);
  const isPastHeroRef = useRef(false);
  const [isPastHero, setIsPastHero] = useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = motionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Update targetProgress from scroll position
  const calculateScrollProgress = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    const maxScroll = rect.height - windowH;

    if (maxScroll <= 0) {
      targetProgressRef.current = 0;
      return;
    }

    // Total track available before hero container ends
    const scrollDistance = -rect.top;
    
    // We reserve the final 100vh of the container for the About section to slide up over the hero.
    // The hero canvas animation completes and settles during the distance before that.
    const animationDistance = Math.max(maxScroll - windowH, 1);
    const rawProgress = scrollDistance / animationDistance;
    const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

    targetProgressRef.current = clampedProgress;

    // Detect if hero animation has settled and About transition begins
    const past = scrollDistance >= animationDistance;
    if (past !== isPastHeroRef.current) {
      isPastHeroRef.current = past;
      setIsPastHero(past);
    }
  }, [containerRef]);

  // Animation Loop using requestAnimationFrame
  useEffect(() => {
    const EASE_FACTOR = 0.12; // As specified in requirements

    const tick = () => {
      if (prefersReducedMotionRef.current) {
        currentProgressRef.current = targetProgressRef.current;
      } else {
        const diff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(diff) > 0.0001) {
          currentProgressRef.current += diff * EASE_FACTOR;
        } else {
          currentProgressRef.current = targetProgressRef.current;
        }
      }

      const p = currentProgressRef.current;
      const frameIndex = Math.min(
        Math.max(Math.round(p * (totalFrames - 1)), 0),
        totalFrames - 1
      );

      if (onRenderProgress) {
        onRenderProgress(p, frameIndex);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    // Calculate initial position
    calculateScrollProgress();
    rafIdRef.current = requestAnimationFrame(tick);

    // Passive scroll and resize listeners
    const handleScroll = () => {
      calculateScrollProgress();
    };

    const handleResize = () => {
      calculateScrollProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [calculateScrollProgress, totalFrames, onRenderProgress]);

  return {
    isPastHero,
    currentProgressRef,
  };
}
