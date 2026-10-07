import React, { useRef, useEffect, useState } from 'react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import GermanyMap from './GermanyMap';
import './contact.css';

/**
 * 3 Concise Reasons to contact Clemmo HP matching the reference image.
 */
const REASONS = [
  {
    id: 'beratung',
    title: 'Persönliche Beratung',
    desc: 'Wir nehmen uns Zeit für Ihr Anliegen.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="10" x2="15" y2="10" />
      </svg>
    ),
  },
  {
    id: 'loesungen',
    title: 'Individuelle Lösungen',
    desc: 'Maßgeschneidert auf Ihre Anforderungen.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'umsetzung',
    title: 'Zuverlässige Umsetzung',
    desc: 'Von der Idee bis zum fertigen Set.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m11 17 2 2a1 1 0 0 0 1.42 0l6.58-6.59a1 1 0 0 0 0-1.41l-2.58-2.59a1 1 0 0 0-1.42 0L15 10.41" />
        <path d="m13 7-2-2a1 1 0 0 0-1.42 0L3 11.59a1 1 0 0 0 0 1.41l2.58 2.59a1 1 0 0 0 1.42 0L9 13.59" />
        <path d="m7 15 4-4" />
      </svg>
    ),
  },
];

/**
 * Contact - Final conversion section matching the compact two-tier reference layout.
 */
export default function Contact() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      className={`contact-section ${isVisible ? 'is-visible' : ''}`}
      aria-label="Kontakt"
    >
      {/* ------------------------------------------------------------------
          TIER 1: UPPER LIGHT AREA (Editorial 3-Column Layout)
          ------------------------------------------------------------------ */}
      <div className="contact-upper-tier">
        <div className="contact-inner-container">
          <div className="contact-main-grid">
            {/* Left: Eyebrow, Main Headline, Subtext & 3 Reasons */}
            <div className="contact-col-intro">
              <div className="contact-eyebrow">
                <span className="eyebrow-dash" aria-hidden="true">—</span>
                <span className="eyebrow-text">KONTAKT</span>
              </div>
              <h2 className="contact-main-headline">
                Lassen Sie uns<br />
                Ihr Projekt realisieren.
              </h2>
              <p className="contact-main-subtext">
                Ob Idee, Konzept oder ein konkretes Projekt – 
                wir freuen uns auf Ihre Anfrage und beraten 
                Sie gerne persönlich.
              </p>

              <div className="contact-reasons-list">
                {REASONS.map((reason) => (
                  <div key={reason.id} className="contact-reason-item">
                    <div className="reason-icon-wrapper" aria-hidden="true">
                      {reason.icon}
                    </div>
                    <div className="reason-text-wrapper">
                      <strong className="reason-title">{reason.title}</strong>
                      <span className="reason-desc">{reason.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Clean Floating Form Card */}
            <div className="contact-col-form">
              <ContactForm />
            </div>

            {/* Right: Architectural Studio Image & Direct Contact Info */}
            <div className="contact-col-visual">
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          TIER 2: LOWER DARK LOCATION PANEL (#162623)
          ------------------------------------------------------------------ */}
      <div className="contact-lower-tier">
        <div className="contact-inner-container">
          <div className="location-panel-grid">
            {/* Left: Standorts-Info */}
            <div className="location-left-block">
              <span className="location-eyebrow">STANDORT</span>
              <h3 className="location-headline">
                Hier finden<br />
                Sie uns.
              </h3>
              <p className="location-description">
                Unser Firmensitz befindet sich in zentraler Lage, optimal angebunden und für Kunden wie Partner schnell und komfortabel erreichbar.
              </p>
            </div>

            {/* Center: Stylized Dark Map */}
            <div className="location-center-map">
              <div className="location-map-frame">
                <img
                  src="/contact/contact_location_map.jpg"
                  alt="Kartografische Lage des Clemmo Studios"
                  className="location-map-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Right: Germany Map Silhouette & Transit Details */}
            <div className="location-right-details">
              {/* Germany Silhouette */}
              <div className="germany-map-col">
                <GermanyMap />
              </div>

              {/* Transit Details */}
              <div className="transit-col">
                <span className="transit-heading">GUT ERREICHBAR</span>
                
                <div className="transit-entry">
                  <div className="transit-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect width="18" height="12" x="3" y="6" rx="2" />
                      <circle cx="7" cy="18" r="2" />
                      <circle cx="17" cy="18" r="2" />
                    </svg>
                  </div>
                  <div className="transit-text">
                    <strong>Über die Autobahn</strong>
                    <span>Schnelle Direktanbindung</span>
                  </div>
                </div>

                <div className="transit-entry">
                  <div className="transit-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect width="16" height="16" x="4" y="3" rx="2" />
                      <path d="M4 11h16" />
                      <path d="M12 3v8" />
                      <circle cx="8" cy="15" r="1" />
                      <circle cx="16" cy="15" r="1" />
                    </svg>
                  </div>
                  <div className="transit-text">
                    <strong>Mit dem Zug</strong>
                    <span>Hauptbahnhof</span>
                  </div>
                </div>

                <div className="transit-entry">
                  <div className="transit-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.5-.1-.9.1-1.2.4l-.7.7 5.2 3.6-3 3-2.3-.5c-.3-.1-.7 0-.9.3l-.4.4 2.8 2 2 2.8c.3.2.4-.1.3-.4l-.5-2.3 3-3 3.6 5.2.7-.7c.3-.3.5-.7.4-1.2Z" />
                    </svg>
                  </div>
                  <div className="transit-text">
                    <strong>Nächster Flughafen</strong>
                    <span>Internationale Anbindung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
