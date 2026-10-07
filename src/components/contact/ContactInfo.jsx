import React from 'react';

/**
 * ContactInfo - Right column containing the architectural headquarters image
 * and the 2-column contact details block exactly matching the reference layout.
 */
export default function ContactInfo() {
  return (
    <div className="contact-right-panel">
      {/* Top: Architectural Studio / Headquarters Visual */}
      <div className="contact-building-image-wrap">
        <img
          src="/contact/contact_headquarters.jpg"
          alt="Clemmo HP Unternehmenssitz und Entwicklungsstudio"
          className="contact-building-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Bottom: 2-Column Direct Contact Information Block */}
      <div className="contact-info-block">
        {/* Sub-column 1: Adresse */}
        <div className="info-item info-item--address">
          <div className="info-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="info-content">
            <span className="info-label">Adresse</span>
            <div className="info-value address-lines">
              <strong>Clemmo HP</strong>
              <span>[Adresse]</span>
              <span>[PLZ Ort]</span>
              <span>Deutschland</span>
            </div>
          </div>
        </div>

        {/* Sub-column 2: Telefon & E-Mail */}
        <div className="info-item-group">
          {/* Telefon */}
          <div className="info-item">
            <div className="info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="info-content">
              <span className="info-label">Telefon</span>
              <span className="info-value">[Telefonnummer]</span>
            </div>
          </div>

          {/* E-Mail */}
          <div className="info-item">
            <div className="info-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div className="info-content">
              <span className="info-label">E-Mail</span>
              <span className="info-value">[E-Mail-Adresse]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
