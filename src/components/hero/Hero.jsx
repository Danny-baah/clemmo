import React, { useRef, useCallback } from 'react';
import HeroCanvas from './HeroCanvas.jsx';
import HeroNavbar from './HeroNavbar.jsx';
import HeroText from './HeroText.jsx';
import { useHeroScroll } from './useHeroScroll.js';
import './hero.css';

/**
 * Hero - Main cinematic pinned hero container component.
 * Coordinates high-performance scroll storytelling between canvas, text, and navbar.
 */
export default function Hero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);

  const TOTAL_FRAMES = 144;

  // Called inside the requestAnimationFrame loop in useHeroScroll
  const handleRenderProgress = useCallback((progress, frameIndex) => {
    if (canvasRef.current) {
      canvasRef.current.renderFrame(frameIndex);
    }
    if (textRef.current) {
      textRef.current.updateProgress(progress);
    }
  }, []);

  const { isPastHero } = useHeroScroll({
    containerRef,
    totalFrames: TOTAL_FRAMES,
    onRenderProgress: handleRenderProgress,
  });

  return (
    <section ref={containerRef} className="hero-scroll-container" aria-label="Hero Präsentation">
      <div className="hero-sticky-viewport">
        {/* Navigation Bar */}
        <HeroNavbar isPastHero={isPastHero} />

        {/* HTML5 Canvas Video Sequence Layer */}
        <HeroCanvas ref={canvasRef} totalFrames={TOTAL_FRAMES} />

        {/* HTML Text Overlay with continuous scroll transitions */}
        <HeroText ref={textRef} />
      </div>
    </section>
  );
}
