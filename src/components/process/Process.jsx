import React, { useEffect, useRef, useCallback } from 'react';
import ProcessProgress from './ProcessProgress';
import { PROCESS_STEPS, ProcessStepText, ProcessStepVisual } from './ProcessStep';
import './process.css';

/**
 * Clemmo HP - Pinned Scroll-Driven Process Section.
 *
 * Requirements:
 * 1. Pinned storytelling experience (480vh container, 100vh sticky stage)
 * 2. 60fps requestAnimationFrame lerp loop:
 *    currentProgress += (targetProgress - currentProgress) * 0.12
 * 3. NO REACT STATE RE-RENDERS on scroll frames:
 *    Updates text opacity, transforms, visual scale, and progress nav directly via refs.
 * 4. STRICT ZERO TEXT OVERLAP:
 *    Outgoing text fades to 0 before incoming text begins rising.
 * 5. Reversible: Works smoothly scrolling down and scrolling up.
 * 6. Releases cleanly into normal document flow after step 04.
 */
export default function Process() {
  const containerRef = useRef(null);
  const textRefs = useRef([]);
  const visualRefs = useRef([]);
  const navItemRefs = useRef([]);
  const trackFillRef = useRef(null);
  const completionRef = useRef(null);

  // Animation lerp state (kept completely outside React re-renders)
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef(null);

  /**
   * Directly updates DOM elements based on progress p in [0, 1]
   */
  const applyStyles = useCallback((p) => {
    // ------------------------------------------------------------------------
    // 1. Text Narrative Styles (CRITICAL: ZERO overlapping ghost text)
    // ------------------------------------------------------------------------
    // Step 0: [0.00, 0.24]
    let tOp0 = 0, tY0 = -25, tS0 = 0.98;
    if (p <= 0.18) {
      tOp0 = 1; tY0 = 0; tS0 = 1;
    } else if (p < 0.24) {
      const t = (p - 0.18) / 0.06;
      tOp0 = Math.max(0, 1 - t);
      tY0 = -25 * t;
      tS0 = 1 - 0.02 * t;
    }

    // Step 1: [0.24, 0.50]
    let tOp1 = 0, tY1 = 25, tS1 = 1.02;
    if (p >= 0.24 && p < 0.30) {
      const t = (p - 0.24) / 0.06;
      tOp1 = Math.min(1, Math.max(0, t));
      tY1 = 25 * (1 - t);
      tS1 = 1.02 - 0.02 * t;
    } else if (p >= 0.30 && p <= 0.44) {
      tOp1 = 1; tY1 = 0; tS1 = 1;
    } else if (p > 0.44 && p < 0.50) {
      const t = (p - 0.44) / 0.06;
      tOp1 = Math.max(0, 1 - t);
      tY1 = -25 * t;
      tS1 = 1 - 0.02 * t;
    } else if (p >= 0.50) {
      tOp1 = 0; tY1 = -25; tS1 = 0.98;
    }

    // Step 2: [0.50, 0.76]
    let tOp2 = 0, tY2 = 25, tS2 = 1.02;
    if (p >= 0.50 && p < 0.56) {
      const t = (p - 0.50) / 0.06;
      tOp2 = Math.min(1, Math.max(0, t));
      tY2 = 25 * (1 - t);
      tS2 = 1.02 - 0.02 * t;
    } else if (p >= 0.56 && p <= 0.70) {
      tOp2 = 1; tY2 = 0; tS2 = 1;
    } else if (p > 0.70 && p < 0.76) {
      const t = (p - 0.70) / 0.06;
      tOp2 = Math.max(0, 1 - t);
      tY2 = -25 * t;
      tS2 = 1 - 0.02 * t;
    } else if (p >= 0.76) {
      tOp2 = 0; tY2 = -25; tS2 = 0.98;
    }

    // Step 3: [0.76, 1.00]
    let tOp3 = 0, tY3 = 25, tS3 = 1.02;
    if (p >= 0.76 && p < 0.82) {
      const t = (p - 0.76) / 0.06;
      tOp3 = Math.min(1, Math.max(0, t));
      tY3 = 25 * (1 - t);
      tS3 = 1.02 - 0.02 * t;
    } else if (p >= 0.82) {
      tOp3 = 1; tY3 = 0; tS3 = 1;
    }

    const textConfigs = [
      { op: tOp0, y: tY0, s: tS0 },
      { op: tOp1, y: tY1, s: tS1 },
      { op: tOp2, y: tY2, s: tS2 },
      { op: tOp3, y: tY3, s: tS3 },
    ];

    textConfigs.forEach((cfg, idx) => {
      const el = textRefs.current[idx];
      if (el) {
        el.style.opacity = cfg.op;
        el.style.transform = `translateY(calc(-50% + ${cfg.y}px)) scale(${cfg.s})`;
        el.style.pointerEvents = cfg.op > 0.5 ? 'auto' : 'none';
      }
    });

    // ------------------------------------------------------------------------
    // 2. Right Column: Process Visual Images (Smooth crossfade & gentle scale)
    // ------------------------------------------------------------------------
    // Vis 0
    let vOp0 = 0, vY0 = -15, vS0 = 0.98;
    if (p <= 0.18) {
      vOp0 = 1; vY0 = 0; vS0 = 1;
    } else if (p < 0.26) {
      const t = (p - 0.18) / 0.08;
      vOp0 = Math.max(0, 1 - t);
      vY0 = -15 * t;
      vS0 = 1 - 0.02 * t;
    }

    // Vis 1
    let vOp1 = 0, vY1 = 15, vS1 = 1.03;
    if (p >= 0.20 && p < 0.28) {
      const t = (p - 0.20) / 0.08;
      vOp1 = Math.min(1, Math.max(0, t));
      vY1 = 15 * (1 - t);
      vS1 = 1.03 - 0.03 * t;
    } else if (p >= 0.28 && p <= 0.44) {
      vOp1 = 1; vY1 = 0; vS1 = 1;
    } else if (p > 0.44 && p < 0.52) {
      const t = (p - 0.44) / 0.08;
      vOp1 = Math.max(0, 1 - t);
      vY1 = -15 * t;
      vS1 = 1 - 0.02 * t;
    } else if (p >= 0.52) {
      vOp1 = 0; vY1 = -15; vS1 = 0.98;
    }

    // Vis 2
    let vOp2 = 0, vY2 = 15, vS2 = 1.03;
    if (p >= 0.46 && p < 0.54) {
      const t = (p - 0.46) / 0.08;
      vOp2 = Math.min(1, Math.max(0, t));
      vY2 = 15 * (1 - t);
      vS2 = 1.03 - 0.03 * t;
    } else if (p >= 0.54 && p <= 0.70) {
      vOp2 = 1; vY2 = 0; vS2 = 1;
    } else if (p > 0.70 && p < 0.78) {
      const t = (p - 0.70) / 0.08;
      vOp2 = Math.max(0, 1 - t);
      vY2 = -15 * t;
      vS2 = 1 - 0.02 * t;
    } else if (p >= 0.78) {
      vOp2 = 0; vY2 = -15; vS2 = 0.98;
    }

    // Vis 3
    let vOp3 = 0, vY3 = 15, vS3 = 1.03;
    if (p >= 0.72 && p < 0.80) {
      const t = (p - 0.72) / 0.08;
      vOp3 = Math.min(1, Math.max(0, t));
      vY3 = 15 * (1 - t);
      vS3 = 1.03 - 0.03 * t;
    } else if (p >= 0.80) {
      vOp3 = 1; vY3 = 0; vS3 = 1;
    }

    const visConfigs = [
      { op: vOp0, y: vY0, s: vS0 },
      { op: vOp1, y: vY1, s: vS1 },
      { op: vOp2, y: vY2, s: vS2 },
      { op: vOp3, y: vY3, s: vS3 },
    ];

    visConfigs.forEach((cfg, idx) => {
      const el = visualRefs.current[idx];
      if (el) {
        el.style.opacity = cfg.op;
        el.style.transform = `scale(${cfg.s}) translateY(${cfg.y}px)`;
        el.style.pointerEvents = cfg.op > 0.5 ? 'auto' : 'none';
      }
    });

    // ------------------------------------------------------------------------
    // 3. Horizontal Progress Navigation (Connecting line & active badges)
    // ------------------------------------------------------------------------
    let activeStepIdx = 0;
    if (p >= 0.745) {
      activeStepIdx = 3;
    } else if (p >= 0.495) {
      activeStepIdx = 2;
    } else if (p >= 0.245) {
      activeStepIdx = 1;
    } else {
      activeStepIdx = 0;
    }

    // Smoothly animate connecting line fill percentage
    let linePct = 0;
    if (p < 0.24) {
      linePct = (p / 0.24) * 16.66;
    } else if (p < 0.50) {
      linePct = 33.33 + ((p - 0.24) / 0.26) * 16.66;
    } else if (p < 0.76) {
      linePct = 66.66 + ((p - 0.50) / 0.26) * 16.66;
    } else {
      linePct = 100;
    }
    linePct = Math.min(100, Math.max(0, linePct));

    if (trackFillRef.current) {
      trackFillRef.current.style.width = `${linePct}%`;
    }

    // Update 4 navigation step buttons
    for (let i = 0; i < 4; i++) {
      const btn = navItemRefs.current[i];
      if (!btn) continue;

      if (i === activeStepIdx) {
        btn.className = 'process-progress-item process-progress-item--active';
        btn.setAttribute('aria-current', 'step');
      } else if (i < activeStepIdx) {
        btn.className = 'process-progress-item process-progress-item--completed';
        btn.removeAttribute('aria-current');
      } else {
        btn.className = 'process-progress-item';
        btn.removeAttribute('aria-current');
      }
    }

    // ------------------------------------------------------------------------
    // 4. Final Completion State Banner (Slides up gently at p >= 0.88)
    // ------------------------------------------------------------------------
    if (completionRef.current) {
      let compOp = 0;
      let compY = 32;
      let compPointer = 'none';

      if (p >= 0.88 && p < 0.95) {
        const t = (p - 0.88) / 0.07;
        compOp = Math.min(1, Math.max(0, t));
        compY = 32 * (1 - t);
        compPointer = 'auto';
      } else if (p >= 0.95) {
        compOp = 1;
        compY = 0;
        compPointer = 'auto';
      }

      completionRef.current.style.opacity = compOp;
      completionRef.current.style.transform = `translateY(${compY}px)`;
      completionRef.current.style.pointerEvents = compPointer;
    }
  }, []);

  // Continuous animation frame lerp loop
  const runAnimationLoop = useCallback(() => {
    rafIdRef.current = null;
    const diff = targetProgressRef.current - currentProgressRef.current;

    // Settle when close enough
    if (Math.abs(diff) < 0.0003) {
      currentProgressRef.current = targetProgressRef.current;
      applyStyles(currentProgressRef.current);
      return;
    }

    // Smooth exponential lerp (0.12 speed factor as requested)
    currentProgressRef.current += diff * 0.12;
    applyStyles(currentProgressRef.current);

    rafIdRef.current = requestAnimationFrame(runAnimationLoop);
  }, [applyStyles]);

  // Scroll listener
  useEffect(() => {
    const updateTargetProgress = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalDistance = rect.height - window.innerHeight;

      if (totalDistance <= 0) return;

      // Calculate normalized progress inside Process section: 0 -> 1
      const scrolled = -rect.top;
      const target = Math.max(0, Math.min(1, scrolled / totalDistance));
      targetProgressRef.current = target;

      // Handle prefers-reduced-motion immediately
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        currentProgressRef.current = target;
        applyStyles(target);
        return;
      }

      // Schedule animation frame if not already scheduled
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(runAnimationLoop);
      }
    };

    window.addEventListener('scroll', updateTargetProgress, { passive: true });
    window.addEventListener('resize', updateTargetProgress, { passive: true });

    // Initial check on mount: establish step 01
    applyStyles(0);
    updateTargetProgress();

    return () => {
      window.removeEventListener('scroll', updateTargetProgress);
      window.removeEventListener('resize', updateTargetProgress);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [applyStyles, runAnimationLoop]);

  // Jump smoothly to a specific stage milestone when clicking the navigation bubbles
  const handleStepClick = (idx) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const totalDistance = rect.height - window.innerHeight;

    const targetMilestones = [0.05, 0.35, 0.60, 0.85];
    const targetP = targetMilestones[idx] || 0;
    const targetScrollY = window.scrollY + rect.top + targetP * totalDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="prozess"
      ref={containerRef}
      className="process-scroll-container"
      aria-label="Unser Prozess"
    >
      {/* Pinned 100vh Sticky Viewport */}
      <div className="process-sticky-stage">
        <div className="process-inner">
          {/* Stable Header & Horizontal Progress Navigation */}
          <ProcessProgress
            steps={PROCESS_STEPS}
            activeStep={0}
            onStepClick={handleStepClick}
            trackFillRef={trackFillRef}
            navItemRefs={navItemRefs}
          />

          {/* Main Editorial Story Stage (Two columns: Text narrative & Visual sequence) */}
          <div className="process-story-stage">
            {/* Left Column: Text Viewport */}
            <div className="process-text-viewport">
              {PROCESS_STEPS.map((step, idx) => (
                <ProcessStepText
                  key={step.id}
                  step={step}
                  innerRef={(el) => (textRefs.current[idx] = el)}
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    transform: idx === 0 ? 'translateY(-50%) scale(1)' : 'translateY(calc(-50% + 25px)) scale(1.02)',
                    pointerEvents: idx === 0 ? 'auto' : 'none',
                  }}
                  isActive={idx === 0}
                />
              ))}
            </div>

            {/* Right Column: Visual Stage (Zero heavy shadows) */}
            <div className="process-visual-viewport">
              {PROCESS_STEPS.map((step, idx) => (
                <ProcessStepVisual
                  key={step.id}
                  step={step}
                  innerRef={(el) => (visualRefs.current[idx] = el)}
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    transform: idx === 0 ? 'scale(1) translateY(0)' : 'scale(1.03) translateY(15px)',
                    pointerEvents: idx === 0 ? 'auto' : 'none',
                  }}
                  isActive={idx === 0}
                />
              ))}
            </div>
          </div>

          {/* Final Completion State (Slides up gracefully at progress >= 0.88) */}
          <div
            ref={completionRef}
            className="process-completion-bar"
            style={{ opacity: 0, transform: 'translateY(32px)', pointerEvents: 'none' }}
          >
            <div className="completion-bar-left">
              <div className="completion-check-icon" aria-hidden="true">
                <svg
                  className="completion-check-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="completion-text-wrap">
                <span className="completion-badge-tag">PROZESS ABGESCHLOSSEN</span>
                <h4 className="completion-headline">Bereit für Ihr eigenes Projekt?</h4>
                <p className="completion-subtext">
                  Lassen Sie uns Ihre Idee gemeinsam Wirklichkeit werden.
                </p>
              </div>
            </div>

            <a href="#kontakt" className="completion-cta-button">
              <span>Projekt anfragen</span>
              <span className="completion-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
