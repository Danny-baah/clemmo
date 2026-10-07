import React from 'react';
import './about.css';

/**
 * About - "Über uns" section.
 * Renders as a physical sheet sliding upward over the fixed cinematic hero.
 * Uses verified B2B credentials, client-provided copy, and high-end editorial composition.
 */
export default function About() {
  const capabilities = [
    {
      id: '01',
      title: 'Individuelle Lösungen',
      desc: 'Maßgeschneiderte Klemmbaustein-Sets für Unternehmen und Marken.',
      image: './about/card1.jpg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="capability-icon">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      ),
    },
    {
      id: '02',
      title: 'Präzise Entwicklung',
      desc: 'Durchdachte Gestaltung und professionelle Produktentwicklung.',
      image: './about/card2.jpg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="capability-icon">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <path d="M7 8h10" />
          <path d="M7 12h6" />
        </svg>
      ),
    },
    {
      id: '03',
      title: 'Qualität & Sicherheit',
      desc: 'Hohe Qualitätsstandards und CE-konforme Umsetzung.',
      image: './about/card3.jpg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="capability-icon">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      id: '04',
      title: 'Zuverlässige Lieferung',
      desc: 'Import und Logistik bis zur fertigen Lieferung.',
      image: './about/card4.jpg',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="capability-icon">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="ueber-uns" className="about-section" aria-label="Über Clemmo HP">
      {/* Subtle organic curved transition edge overlapping the hero */}
      <div className="about-curved-boundary" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="about-curve-svg">
          <path d="M0,45 C380,12 860,6 1440,32 L1440,60 L0,60 Z" fill="#F0F5F7" />
        </svg>
      </div>

      <div className="about-container">
        {/* Main Editorial Two-Column Hero */}
        <div className="about-editorial-grid">
          {/* Left Column: Text & Credibility */}
          <div className="about-content-col">
            <div className="about-eyebrow">
              <span className="about-eyebrow-rule" aria-hidden="true" />
              <span className="about-eyebrow-text">Über Clemmo HP</span>
            </div>

            <h2 className="about-headline">
              <span className="headline-dark">ERFAHRUNG,</span>
              <span className="headline-accent">AUF DIE SIE BAUEN KÖNNEN.</span>
            </h2>

            <div className="about-paragraphs">
              <p className="about-lead">
                Seit vielen Jahren bewegen wir uns erfolgreich im internationalen Import und der
                Produktentwicklung. Bereits seit 2020 importieren und realisieren wir erfolgreich
                Baustein-Projekte für verschiedenste Unternehmen und Marken.
              </p>
              <p className="about-subcopy">
                Dank unserer langjährigen Erfahrung kennen wir die globalen Lieferketten,
                Produktionsprozesse und Qualitätsanforderungen im Detail.
              </p>
              <p className="about-subcopy">
                Wenn Sie Ihr eigenes Klemmbaustein-Projekt umsetzen möchten, haben Sie mit uns einen
                verlässlichen Partner an Ihrer Seite, der Ihr Wunschprodukt sicher von der ersten
                Idee bis zur fertigen Lieferung begleitet.
              </p>
            </div>

            {/* Verified Information Strip */}
            <div className="about-credibility-strip" role="list">
              <div className="credibility-item" role="listitem">
                <span className="credibility-num">01</span>
                <span className="credibility-title">SEIT 2020</span>
                <p className="credibility-desc">
                  Erfolgreiche Baustein-Projekte für Unternehmen und Marken.
                </p>
              </div>

              <div className="credibility-divider" aria-hidden="true" />

              <div className="credibility-item" role="listitem">
                <span className="credibility-num">02</span>
                <span className="credibility-title">INTERNATIONAL</span>
                <p className="credibility-desc">
                  Erfahrung mit Import, globalen Lieferketten und Produktion.
                </p>
              </div>

              <div className="credibility-divider" aria-hidden="true" />

              <div className="credibility-item" role="listitem">
                <span className="credibility-num">03</span>
                <span className="credibility-title">A BIS Z</span>
                <p className="credibility-desc">
                  Begleitung von der ersten Idee bis zur fertigen Lieferung.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Model Visual */}
          <div className="about-visual-col">
            <div className="about-image-card">
              <img
                src="./about/about_model.jpg"
                alt="Clemmo HP Maßgeschneidertes Architekturmodell aus Klemmbausteinen"
                className="about-model-image"
                loading="lazy"
              />
              <div className="about-image-badge" aria-hidden="true">
                <span className="badge-dot" />
                <span>ORIGINAL CLEMMO HP MODELL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Capability Feature Row */}
        <div className="about-capabilities-section">
          <div className="about-capabilities-grid">
            {capabilities.map((cap) => (
              <div key={cap.id} className="capability-card">
                <div className="capability-header">
                  <div className="capability-icon-wrap" aria-hidden="true">
                    {cap.icon}
                  </div>
                  <h3 className="capability-title">{cap.title}</h3>
                </div>
                <p className="capability-desc">{cap.desc}</p>
                <div className="capability-thumbnail-wrapper">
                  <img
                    src={cap.image}
                    alt={cap.title}
                    className="capability-thumbnail"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
