import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

/**
 * HeroCanvas - Renders frame sequence with aspect-fill/object-fit-cover mathematics,
 * high-DPI scaling, progressive preloading, and instantaneous Frame 0 delivery.
 */
const HeroCanvas = forwardRef(function HeroCanvas({ totalFrames = 144 }, ref) {
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(totalFrames));
  const currentRenderedIndexRef = useRef(-1);

  // Helper to format frame path reliably across dev and production static builds
  const getFrameUrl = useCallback((index) => {
    const padded = String(index).padStart(3, '0');
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${cleanBase}/hero/frames/frame_${padded}.webp`;
  }, []);

  // Helper to find nearest loaded frame if current frame is still downloading
  const getNearestLoadedFrame = useCallback((index) => {
    const images = imagesRef.current;
    if (images[index]?.complete && images[index]?.naturalWidth > 0) {
      return images[index];
    }
    for (let offset = 1; offset < totalFrames; offset++) {
      const prev = index - offset;
      if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth > 0) {
        return images[prev];
      }
      const next = index + offset;
      if (next < totalFrames && images[next]?.complete && images[next]?.naturalWidth > 0) {
        return images[next];
      }
    }
    return null;
  }, [totalFrames]);

  // Draw a specific frame to canvas
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = getNearestLoadedFrame(index);
    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;

    if (cw === 0 || ch === 0) return;

    const targetW = Math.round(cw * dpr);
    const targetH = Math.round(ch * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Background fill to match dark brand tone #162623 / #0D1715
    ctx.fillStyle = '#0d1715';
    ctx.fillRect(0, 0, cw, ch);

    // Aspect-fit cover mathematics
    const iw = img.naturalWidth || 1280;
    const ih = img.naturalHeight || 720;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;

    // Desktop composition: slightly offset center horizontally to give breathing room
    // to left-aligned text, while keeping the building model prominent (matching reference image)
    const isDesktop = cw >= 1024;
    const xShift = isDesktop ? Math.min(cw * 0.05, 75) : 0;
    const dx = (cw - dw) * 0.5 + xShift;
    const dy = (ch - dh) * 0.5;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, dw, dh);

    ctx.restore();
    currentRenderedIndexRef.current = index;
  }, [getNearestLoadedFrame]);

  // Expose renderFrame method to parent
  useImperativeHandle(ref, () => ({
    renderFrame: (index) => {
      drawFrame(index);
    },
    redrawCurrent: () => {
      if (currentRenderedIndexRef.current >= 0) {
        drawFrame(currentRenderedIndexRef.current);
      } else {
        drawFrame(0);
      }
    }
  }), [drawFrame]);

  // Progressive Preloading Strategy
  useEffect(() => {
    let isCancelled = false;

    // 1. Frame 0: Top priority, load immediately
    const frame0 = new Image();
    frame0.src = getFrameUrl(0);
    frame0.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = frame0;
      drawFrame(0);
    };
    frame0.onerror = () => {
      console.warn('Frame 0 failed to load:', frame0.src);
    };
    imagesRef.current[0] = frame0;

    // If frame 0 is already cached, draw immediately
    if (frame0.complete && frame0.naturalWidth > 0) {
      drawFrame(0);
    }

    // 2. Early frames (1-24): high priority
    const preloadRange = (start, end) => {
      for (let i = start; i <= end && i < totalFrames; i++) {
        if (imagesRef.current[i]) continue;
        const img = new Image();
        img.src = getFrameUrl(i);
        imagesRef.current[i] = img;
      }
    };

    preloadRange(1, Math.min(24, totalFrames - 1));

    // 3. Progressive background loading for remaining frames
    let currentIdx = 25;
    const BATCH_SIZE = 8;
    let timerId = null;

    const loadNextBatch = () => {
      if (isCancelled || currentIdx >= totalFrames) return;
      const nextLimit = Math.min(currentIdx + BATCH_SIZE, totalFrames);
      for (let i = currentIdx; i < nextLimit; i++) {
        if (!imagesRef.current[i]) {
          const img = new Image();
          img.src = getFrameUrl(i);
          imagesRef.current[i] = img;
        }
      }
      currentIdx = nextLimit;
      if (currentIdx < totalFrames) {
        // Use requestIdleCallback or small timeout for smooth performance
        if ('requestIdleCallback' in window) {
          timerId = window.requestIdleCallback(loadNextBatch, { timeout: 250 });
        } else {
          timerId = setTimeout(loadNextBatch, 60);
        }
      }
    };

    // Begin progressive background loading shortly after Frame 0
    const initialTimer = setTimeout(() => {
      loadNextBatch();
    }, 100);

    // Resize handler to redraw current frame with updated aspect-cover math
    const handleResize = () => {
      if (currentRenderedIndexRef.current >= 0) {
        drawFrame(currentRenderedIndexRef.current);
      } else {
        drawFrame(0);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isCancelled = true;
      clearTimeout(initialTimer);
      if (timerId) {
        if ('cancelIdleCallback' in window && typeof timerId === 'number') {
          window.cancelIdleCallback(timerId);
        } else {
          clearTimeout(timerId);
        }
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [drawFrame, getFrameUrl, totalFrames]);

  return (
    <div className="hero-canvas-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-canvas-vignette" />
      <div className="hero-canvas-glow" />
    </div>
  );
});

export default HeroCanvas;
