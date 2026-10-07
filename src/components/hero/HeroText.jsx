import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

/**
 * HeroText - Renders the initial and final text states with continuous,
 * GPU-accelerated CSS transformations driven by scroll progress without React re-renders.
 */
const HeroText = forwardRef(function HeroText(_props, ref) {
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Directly update DOM styles without causing React re-renders
  const updateProgress = (progress) => {
    // 1. Scroll Indicator: visible at start, fades out quickly (0.00 -> 0.08)
    if (scrollIndicatorRef.current) {
      const indicatorOpacity = Math.max(0, Math.min(1, 1 - progress / 0.08));
      const indicatorY = progress * 30;
      scrollIndicatorRef.current.style.opacity = indicatorOpacity.toFixed(3);
      scrollIndicatorRef.current.style.transform = `translateY(${indicatorY.toFixed(1)}px)`;
      scrollIndicatorRef.current.style.pointerEvents = indicatorOpacity < 0.05 ? 'none' : 'auto';
    }

    // 2. Initial State:
    // Full at 0.0 -> 0.18, fades/blurs out between 0.18 -> 0.45
    if (initialRef.current) {
      let initOpacity = 1;
      let initY = 0;
      let initBlur = 0;

      if (progress > 0.18) {
        const t = Math.min((progress - 0.18) / 0.24, 1);
        initOpacity = 1 - t;
        initY = -t * 40;
        initBlur = t * 10;
      }

      initialRef.current.style.opacity = initOpacity.toFixed(3);
      initialRef.current.style.transform = `translate3d(0, ${initY.toFixed(1)}px, 0)`;
      initialRef.current.style.filter = initBlur > 0.1 ? `blur(${initBlur.toFixed(1)}px)` : 'none';
      initialRef.current.style.pointerEvents = initOpacity < 0.05 ? 'none' : 'auto';
    }

    // 3. Final State:
    // Hidden at 0.0 -> 0.50, smoothly fades/glides in 0.50 -> 0.80, settles breathing at 0.80 -> 1.00
    if (finalRef.current) {
      let finalOpacity = 0;
      let finalY = 40;
      let finalBlur = 10;

      if (progress >= 0.50) {
        const t = Math.min((progress - 0.50) / 0.30, 1);
        finalOpacity = t;
        finalY = (1 - t) * 40;
        finalBlur = (1 - t) * 10;
      }

      finalRef.current.style.opacity = finalOpacity.toFixed(3);
      finalRef.current.style.transform = `translate3d(0, ${finalY.toFixed(1)}px, 0)`;
      finalRef.current.style.filter = finalBlur > 0.1 ? `blur(${finalBlur.toFixed(1)}px)` : 'none';
      finalRef.current.style.pointerEvents = finalOpacity < 0.1 ? 'none' : 'auto';
    }
  };

  useImperativeHandle(ref, () => ({
    updateProgress,
  }));

  // Initial setup at 0
  useEffect(() => {
    updateProgress(0);
  }, []);

  return (
    <div className="hero-text-overlay">
      {/* INITIAL TEXT STATE */}
      <div ref={initialRef} className="hero-text-block hero-text-block--initial">
        <div className="hero-eyebrow">
          <span className="eyebrow-rule" aria-hidden="true" />
          <span className="eyebrow-text">INDIVIDUELLE KLEMMBAUSTEIN-SETS</span>
        </div>

        <h1 className="hero-headline">
          <span className="headline-line headline-line--white">Deine Marke.</span>
          <span className="headline-line headline-line--accent">Deine Idee.</span>
        </h1>

        <p className="hero-subtext">
          Maßgeschneiderte Klemmbaustein-Sets
          <br />
          von A bis Z.
        </p>
      </div>

      {/* FINAL TEXT STATE */}
      <div ref={finalRef} className="hero-text-block hero-text-block--final">
        <div className="hero-eyebrow">
          <span className="eyebrow-rule" aria-hidden="true" />
          <span className="eyebrow-text">KLEMMBAUSTEINE INDIVIDUELL NACH WUNSCH</span>
        </div>

        <h2 className="hero-headline">
          <span className="headline-line headline-line--white">MAẞGESCHNEIDERTE</span>
          <span className="headline-line headline-line--accent">KLEMMBAUSTEIN-SETS</span>
        </h2>

        <p className="hero-subtext">
          Von der ersten Idee bis zur fertigen Lieferung.
        </p>

        <div className="hero-cta-group">
          <a href="#kontakt" className="hero-cta-button" id="hero-primary-cta">
            <span className="cta-label">PROJEKT ANFRAGEN</span>
            <span className="cta-arrow" aria-hidden="true">→</span>
          </a>

          <div className="hero-cta-secondary" aria-hidden="true">
            <span className="cta-secondary-divider" />
            <span className="cta-secondary-text">
              IDEEN IN ECHTE
              <br />
              PRODUKTE VERWANDELN
            </span>
          </div>
        </div>
      </div>

      {/* SCROLL TO EXPLORE INDICATOR */}
      <div ref={scrollIndicatorRef} className="hero-scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse-icon">
          <div className="scroll-wheel" />
        </div>
        <div className="scroll-label-group">
          <span className="scroll-arrow scroll-arrow--up">⌃</span>
          <span className="scroll-text">SCROLLEN ZUM ENTDECKEN</span>
          <span className="scroll-arrow scroll-arrow--down">⌄</span>
        </div>
      </div>
    </div>
  );
});

export default HeroText;
