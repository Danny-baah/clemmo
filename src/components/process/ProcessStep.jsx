import React from 'react';

/**
 * Story stages definition for the 4-step Clemmo HP Process.
 * Follows exact user specifications for labels, headlines, and supporting text.
 */
export const PROCESS_STEPS = [
  {
    id: '01',
    shortLabel: 'IDEE & KONZEPT',
    mobileLabel: 'KONZEPT',
    fullLabel: '01 · IDEE & KONZEPT',
    title: 'Idee & Konzept',
    headline: 'Aus einer Idee entsteht ein klares Konzept.',
    description:
      'Wir besprechen Ihre Anforderungen, Ziele und Vorstellungen und entwickeln darauf basierend ein maßgeschneidertes Konzept für Ihr individuelles Set.',
    imageSrc: '/process/step1_concept.jpg',
    imageAlt: 'Clemmo Modell- und Set-Skizzen auf Studiotisch mit Bausteinen',
    badge: 'KONZEPT & SKIZZE',
  },
  {
    id: '02',
    shortLabel: 'DESIGN & ENTWICKLUNG',
    mobileLabel: 'DESIGN',
    fullLabel: '02 · DESIGN & ENTWICKLUNG',
    title: 'Design & Entwicklung',
    headline: 'Aus dem Konzept wird ein präzises Modell.',
    description:
      'Unsere Designer entwickeln detaillierte Modelle und Konstruktionspläne – präzise, markengerecht und mit Blick auf Funktion, Ästhetik und Umsetzbarkeit.',
    imageSrc: '/process/step2_design.jpg',
    imageAlt: 'Maßgeschneidertes Baukastenmodell mit digitalem 3D-CAD-Entwurf im Hintergrund',
    badge: '3D-CAD & MODELLBAU',
  },
  {
    id: '03',
    shortLabel: 'PRODUKTION',
    mobileLabel: 'PRODUKTION',
    fullLabel: '03 · PRODUKTION',
    title: 'Produktion',
    headline: 'Ihre Idee geht in die Fertigung.',
    description:
      'Wir koordinieren die Produktion mit ausgewählten Partnern und achten auf höchste Qualitätsstandards, damit Ihr Set exakt nach Ihren Vorgaben umgesetzt wird.',
    imageSrc: '/process/step3_production.jpg',
    imageAlt: 'Präzisionsgefertigte Baukastenkomponenten und optische Qualitätskontrolle in Reinraum-Fertigung',
    badge: 'PRÄZISIONSFERTIGUNG',
  },
  {
    id: '04',
    shortLabel: 'LIEFERUNG & SUPPORT',
    mobileLabel: 'LIEFERUNG',
    fullLabel: '04 · LIEFERUNG & SUPPORT',
    title: 'Lieferung & Support',
    headline: 'Das fertige Set kommt an – zuverlässig und termingerecht.',
    description:
      'Ihr individuelles Set wird weltweit geliefert. Wir unterstützen Sie auch nach der Lieferung und stehen bei weiteren Projekten jederzeit gerne zur Seite.',
    imageSrc: '/process/step4_delivery.jpg',
    imageAlt: 'Vollendetes Clemmo Modell mit edler Markenverpackung und weltweitem Logistikservice',
    badge: 'FERTIGES SET & LOGISTIK',
  },
];

/**
 * Renders the editorial text block for one process step.
 * Uses inline style calculated via requestAnimationFrame for 60fps smoothness
 * while strictly guaranteeing zero ghost/overlap text between steps.
 */
export function ProcessStepText({ step, style, isActive, innerRef }) {
  return (
    <article
      ref={innerRef}
      className={`process-step-text ${isActive ? 'process-step-text--active' : ''}`}
      style={style}
      aria-hidden={!isActive}
    >
      <div className="step-number-display">{step.id}</div>
      <h3 className="step-label-title">{step.title}</h3>
      <div className="step-headline">{step.headline}</div>
      <p className="step-description">{step.description}</p>

      {step.id !== '04' ? (
        <div className="process-scroll-hint" aria-hidden="true">
          <span className="scroll-hint-arrow">↓</span>
          <span>Scrollen, um den nächsten Schritt zu sehen</span>
        </div>
      ) : (
        <div className="process-scroll-hint process-scroll-hint--final" aria-hidden="true">
          <span className="scroll-hint-arrow">↓</span>
          <span>Scrollen zum Projektabschluss</span>
        </div>
      )}
    </article>
  );
}

/**
 * Renders the visual stage element for one process step.
 * Smoothly cross-fades and scales (1.03 -> 1.00) into place without heavy shadows.
 */
export function ProcessStepVisual({ step, style, isActive, innerRef }) {
  return (
    <div
      ref={innerRef}
      className="process-visual-item"
      style={style}
      aria-hidden={!isActive}
    >
      <img
        src={step.imageSrc}
        alt={step.imageAlt}
        className="process-visual-img"
        loading="eager"
        decoding="async"
      />
      <div className="ai-subtle-tag" aria-hidden="true">
        <span>KI-generiert</span>
      </div>
      <div className="visual-badge" aria-hidden="true">
        <span className="badge-dot" />
        <span>{step.badge}</span>
      </div>
    </div>
  );
}

export default {
  PROCESS_STEPS,
  ProcessStepText,
  ProcessStepVisual,
};
