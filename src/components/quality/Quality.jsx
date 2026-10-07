import React, { useEffect, useRef, useState } from 'react';
import QualityPrinciple from './QualityPrinciple';
import './quality.css';

/**
 * 4 Quality Principles data according to exact client specifications.
 */
const QUALITY_PRINCIPLES = [
  {
    number: '01',
    title: 'HOCHWERTIGE MATERIALIEN',
    description: 'Wir verwenden qualitativ hochwertige Bausteine für zuverlässige und langlebige Produkte.',
    iconType: 'shield',
  },
  {
    number: '02',
    title: 'PRÄZISE FERTIGUNG',
    description: 'Professionelle Produktionsprozesse und definierte Qualitätsstandards sorgen für präzise Ergebnisse.',
    iconType: 'gear',
  },
  {
    number: '03',
    title: 'SORGFÄLTIGE QUALITÄTSPRÜFUNG',
    description: 'Jedes Detail wird sorgfältig geprüft, bevor Ihr Set unser Haus verlässt.',
    iconType: 'magnifier',
  },
  {
    number: '04',
    title: 'LANGLEBIGE ERGEBNISSE',
    description: 'Robuste Konstruktionen für langlebige Modelle und professionellen Einsatz.',
    iconType: 'cube',
  },
];

/**
 * Quality Section ("Qualität") for Clemmo HP.
 *
 * Characteristics:
 * - Normal document scroll (calm, stable counterpoint to the interactive Process section)
 * - Premium editorial two-column layout
 * - Four concise quality principles with minimal line icons
 * - Dark feature panel (#162623) with macro component visual and CTA
 * - Large architectural model visual with studio lighting and blueprints
 * - Zero heavy drop shadows
 */
export default function Quality() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="qualitaet"
      ref={sectionRef}
      className={`quality-section ${isVisible ? 'is-visible' : ''}`}
      aria-label="Qualität"
    >
      <div className="quality-inner">
        <div className="quality-grid">
          {/* Left Column: Introduction, Principles & Feature Panel */}
          <div className="quality-content-col">
            {/* Introduction */}
            <div className="quality-header-wrap">
              <div className="quality-eyebrow">
                <span className="quality-eyebrow-rule" aria-hidden="true" />
                <span className="quality-eyebrow-text">QUALITÄT</span>
              </div>
              <h2 className="quality-headline">
                Qualität, auf die<br />
                Sie bauen können.
              </h2>
              <p className="quality-description">
                Jedes Set wird mit höchster Sorgfalt entwickelt, produziert und geprüft – für langlebige Ergebnisse, die Ihren Ansprüchen gerecht werden.
              </p>
            </div>

            {/* 4 Quality Principles */}
            <div className="quality-principles-grid">
              {QUALITY_PRINCIPLES.map((principle, index) => (
                <QualityPrinciple
                  key={principle.number}
                  number={principle.number}
                  title={principle.title}
                  description={principle.description}
                  iconType={principle.iconType}
                  index={index}
                />
              ))}
            </div>

            {/* Lower Dark Feature Panel (#162623) */}
            <div className="quality-feature-panel">
              <div className="feature-panel-content">
                <div className="feature-panel-top">
                  <span className="feature-panel-eyebrow">QUALITÄT SCHAFFT VERTRAUEN</span>
                  <h3 className="feature-panel-headline">
                    Setzen Sie auf<br />
                    nachhaltige <span className="feature-panel-highlight">Qualität.</span>
                  </h3>
                  <p className="feature-panel-subtext">
                    Unsere Erfahrung, die richtigen Partner und klare Standards sorgen dafür, dass Ihr Projekt auf einem starken Fundament steht.
                  </p>
                </div>
              </div>

              <div className="feature-panel-visual">
                <img
                  src="/quality/quality_macro_bricks.jpg"
                  alt="Detailaufnahme präzise gefertigter Clemmo Bausteine"
                  className="feature-panel-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="feature-panel-overlay" aria-hidden="true" />
                <div className="ai-discreet-badge" aria-hidden="true">
                  <span>KI-generiert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Main Architectural Model Visual */}
          <div className="quality-visual-container">
            <img
              src="/quality/quality_main_model.jpg"
              alt="Baukastenmodell eines modernen Firmengebäudes mit Konstruktionsplänen und Präzisionswerkzeugen"
              className="quality-main-img"
              loading="lazy"
              decoding="async"
            />
            <div className="image-badge-with-ai quality-visual-badge" aria-hidden="true">
              <span className="badge-dot" />
              <span className="badge-main-text">QUALITÄTSSTANDARDS & PRÜFUNG</span>
              <span className="badge-ai-notice">KI-generiert</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
