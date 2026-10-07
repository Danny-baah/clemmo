import React, { useState } from 'react';
import './footer.css';

/**
 * Footer - Complete Clemmo HP footer with upper CTA banner,
 * 5-column editorial navigation, verified contact data, newsletter subscription,
 * and bottom copyright bar matching the design reference image.
 */
export default function Footer() {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    if (targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-root">
      {/* ------------------------------------------------------------------
          1. UPPER CTA BANNER: "IHR PROJEKT BEGINNT HIER"
          ------------------------------------------------------------------ */}
      <div className="footer-cta-banner">
        <div className="footer-cta-inner">
          <div className="footer-cta-content">
            <div className="footer-cta-eyebrow">
              <span className="cta-eyebrow-dash" aria-hidden="true">—</span>
              <span className="cta-eyebrow-text">IHR PROJEKT BEGINNT HIER</span>
            </div>
            <h2 className="footer-cta-headline">
              Ihre Idee ist bereit.<br />
              <span className="footer-cta-highlight">Wir sind es auch.</span>
            </h2>
            <p className="footer-cta-subtext">
              Erzählen Sie uns, was Sie vorhaben – wir freuen uns auf Ihr Projekt.
            </p>
            <a
              href="#kontakt"
              onClick={(e) => handleSmoothScroll(e, '#kontakt')}
              className="footer-cta-btn"
              aria-label="Projekt anfragen und zum Kontaktformular scrollen"
            >
              <span>Projekt anfragen</span>
              <span className="cta-btn-arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <div className="footer-cta-media">
            <img
              src="/footer/footer_cta_model.jpg"
              alt="Baukastenmodell eines modernen Firmengebäudes bei Nacht"
              className="footer-cta-img"
              loading="lazy"
              decoding="async"
            />
            <div className="ai-discreet-badge" aria-hidden="true">
              <span>KI-generiert</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. MAIN 4-COLUMN FOOTER
          ------------------------------------------------------------------ */}
      <div className="footer-main-container">
        <div className="footer-main-inner">
          <div className="footer-cols-grid">
            {/* Column 1: Brand & Description & Socials */}
            <div className="footer-col footer-col-brand">
              <div className="footer-brand-header">
                <span className="footer-brand-wordmark">Clemmo<sup>®</sup></span>
                <span className="footer-brand-tagline">Klemmbausteine individuell nach Wunsch</span>
              </div>
              <p className="footer-brand-desc">
                Wir entwickeln und produzieren individuelle Baustein-Sets für Unternehmen, 
                Marken und besondere Projekte – präzise, kreativ und in höchster Qualität.
              </p>
              <div className="footer-social-links" aria-label="Social Media Kanäle">
                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-pill" aria-label="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-pill" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-pill" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Navigation (Single-Page In-Page Anchors) */}
            <div className="footer-col">
              <div className="footer-col-header">
                <span className="footer-col-title">NAVIGATION</span>
                <span className="footer-col-dash" aria-hidden="true">—</span>
              </div>
              <ul className="footer-links-list" role="list">
                <li><a href="#" onClick={(e) => handleSmoothScroll(e, '#')} className="footer-link">Home</a></li>
                <li><a href="#ueber-uns" onClick={(e) => handleSmoothScroll(e, '#ueber-uns')} className="footer-link">Über uns</a></li>
                <li><a href="#produkte" onClick={(e) => handleSmoothScroll(e, '#produkte')} className="footer-link">Produkte</a></li>
                <li><a href="#prozess" onClick={(e) => handleSmoothScroll(e, '#prozess')} className="footer-link">Unser Prozess</a></li>
                <li><a href="#qualitaet" onClick={(e) => handleSmoothScroll(e, '#qualitaet')} className="footer-link">Qualität</a></li>
                <li><a href="#kontakt" onClick={(e) => handleSmoothScroll(e, '#kontakt')} className="footer-link">Kontakt</a></li>
              </ul>
            </div>

            {/* Column 3: Rechtliches */}
            <div className="footer-col">
              <div className="footer-col-header">
                <span className="footer-col-title">RECHTLICHES</span>
                <span className="footer-col-dash" aria-hidden="true">—</span>
              </div>
              <ul className="footer-links-list" role="list">
                <li><a href="#impressum" className="footer-link">Impressum</a></li>
                <li><a href="#datenschutz" className="footer-link">Datenschutz</a></li>
                <li><a href="#agb" className="footer-link">AGB</a></li>
                <li><a href="#widerruf" className="footer-link">Widerruf</a></li>
                <li><a href="#versand" className="footer-link">Versand</a></li>
                <li><a href="#zahlung" className="footer-link">Zahlung</a></li>
              </ul>
            </div>

            {/* Column 4: Kontakt Details */}
            <div className="footer-col footer-col-contact">
              <div className="footer-col-header">
                <span className="footer-col-title">KONTAKT</span>
                <span className="footer-col-dash" aria-hidden="true">—</span>
              </div>
              <div className="footer-contact-items">
                {/* Location */}
                <div className="footer-contact-entry">
                  <div className="footer-contact-icon" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    <strong>Clemmo</strong>
                    <span>Adresse folgt</span>
                    <span>PLZ Ort</span>
                    <span>Deutschland</span>
                  </div>
                </div>

                {/* Telephone */}
                <div className="footer-contact-entry">
                  <div className="footer-contact-icon" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    <strong>Telefon</strong>
                    <span>+49 000 0000000</span>
                  </div>
                </div>

                {/* Email */}
                <div className="footer-contact-entry">
                  <div className="footer-contact-icon" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    <strong>E-Mail</strong>
                    <span>info@clemmo.de</span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="footer-contact-entry">
                  <div className="footer-contact-icon" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    <strong>WhatsApp</strong>
                    <span>+49 000 0000000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            3. BOTTOM COPYRIGHT & LEGAL BAR
            ------------------------------------------------------------------ */}
        <div className="footer-bottom-bar">
          <div className="footer-main-inner footer-bottom-inner">
            <span className="footer-copyright">
              © 2026 Clemmo. Alle Rechte vorbehalten.
            </span>
            <span className="footer-credits">
              Webdesign by EmanCopys
            </span>
            <div className="footer-bottom-links">
              <a href="#impressum" className="footer-bottom-link">Impressum</a>
              <span className="footer-divider-dot" aria-hidden="true">·</span>
              <a href="#datenschutz" className="footer-bottom-link">Datenschutz</a>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Bricks Wireframe in background */}
        <div className="footer-deco-bricks" aria-hidden="true">
          <svg width="220" height="180" viewBox="0 0 220 180" fill="none" stroke="rgba(87, 120, 119, 0.12)" strokeWidth="1.2">
            {/* Isometric Brick Wireframe 1 */}
            <path d="M 120 40 L 160 20 L 200 40 L 160 60 Z" />
            <path d="M 120 40 L 120 70 L 160 90 L 160 60" />
            <path d="M 200 40 L 200 70 L 160 90" />
            {/* Stud 1 */}
            <ellipse cx="150" cy="35" rx="6" ry="3.5" />
            <ellipse cx="170" cy="45" rx="6" ry="3.5" />
            {/* Isometric Brick Wireframe 2 */}
            <path d="M 80 80 L 120 60 L 160 80 L 120 100 Z" />
            <path d="M 80 80 L 80 110 L 120 130 L 120 100" />
            <path d="M 160 80 L 160 110 L 120 130" />
            {/* Stud 2 */}
            <ellipse cx="110" cy="75" rx="6" ry="3.5" />
            <ellipse cx="130" cy="85" rx="6" ry="3.5" />
          </svg>
        </div>
      </div>
    </footer>
  );
}
