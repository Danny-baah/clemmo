import React from 'react';

/**
 * ProcessProgress - Horizontal progress navigation bar showing:
 * 01 ───── 02 ───── 03 ───── 04
 * Supports direct ref manipulation for continuous 60fps rAF updates without React re-renders.
 */
export default function ProcessProgress({
  steps = [],
  activeStep = 0,
  onStepClick,
  trackFillRef,
  navItemRefs,
}) {
  const fillPercentage = (activeStep / Math.max(steps.length - 1, 1)) * 100;

  return (
    <div className="process-header-bar">
      {/* Header Eyebrow & Headline */}
      <div className="process-header-top">
        <div className="process-header-titles">
          <div className="process-eyebrow">
            <span className="process-eyebrow-rule" aria-hidden="true" />
            <span className="process-eyebrow-text">UNSER PROZESS</span>
          </div>
          <h2 className="process-headline">
            Vom ersten Gedanken zum fertigen Set.
          </h2>
        </div>
      </div>

      {/* 4-Step Horizontal Progress Navigation */}
      <nav className="process-progress-nav" aria-label="Prozessschritte Fortschritt">
        {/* Background track line and active fill line */}
        <div className="progress-track-line" aria-hidden="true">
          <div
            ref={trackFillRef}
            className="progress-track-fill"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>

        {/* Step Items */}
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;

          let stateClass = '';
          if (isActive) stateClass = 'process-progress-item--active';
          else if (isCompleted) stateClass = 'process-progress-item--completed';

          return (
            <button
              key={step.id}
              ref={(el) => {
                if (navItemRefs && navItemRefs.current) {
                  navItemRefs.current[idx] = el;
                }
              }}
              type="button"
              className={`process-progress-item ${stateClass}`}
              onClick={() => onStepClick && onStepClick(idx)}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="progress-badge">{step.id}</span>
              <span className="progress-label">{step.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
