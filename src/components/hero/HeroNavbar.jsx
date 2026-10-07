import React, { useState, useEffect } from 'react';

/**
 * HeroNavbar - Premium European B2B navigation bar.
 * Transparent over pinned hero; smoothly transitions to dark surface when hero releases.
 */
export default function HeroNavbar({ isPastHero = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Produkte');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const kontaktEl = document.getElementById('kontakt');
      const qualitaetEl = document.getElementById('qualitaet');
      const prozessEl = document.getElementById('prozess');
      const productsEl = document.getElementById('produkte');
      const aboutEl = document.getElementById('ueber-uns');

      if (kontaktEl && scrollY >= kontaktEl.offsetTop - 250) {
        setActiveItem('Kontakt');
      } else if (qualitaetEl && scrollY >= qualitaetEl.offsetTop - 250) {
        setActiveItem('Qualität');
      } else if (prozessEl && scrollY >= prozessEl.offsetTop - 250) {
        setActiveItem('Prozess');
      } else if (productsEl && scrollY >= productsEl.offsetTop - 250) {
        setActiveItem('Produkte');
      } else if (aboutEl && scrollY >= aboutEl.offsetTop - 250) {
        setActiveItem('Über uns');
      } else {
        setActiveItem(scrollY < 150 ? 'Startseite' : 'Über uns');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Startseite', href: '#' },
    { label: 'Über uns', href: '#ueber-uns' },
    { label: 'Produkte', href: '#produkte' },
    { label: 'Prozess', href: '#prozess' },
    { label: 'Qualität', href: '#qualitaet' },
    { label: 'Kontakt', href: '#kontakt' },
  ];

  return (
    <header className={`hero-header ${isPastHero ? 'hero-header--scrolled' : ''}`}>
      <nav className="hero-nav" aria-label="Hauptnavigation">
        {/* Brand Wordmark */}
        <div className="hero-brand">
          <a href="#" className="hero-brand-link" aria-label="Clemmo Startseite">
            <span className="brand-wordmark">Clemmo</span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hero-nav-links" role="list">
          {navLinks.map((link) => {
            const isActive = activeItem === link.label;
            return (
              <li key={link.label} className="hero-nav-item">
                <a
                  href={link.href}
                  className={`hero-nav-link ${isActive ? 'hero-nav-link--active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right CTA */}
        <div className="hero-nav-actions">
          <a href="#kontakt" className="nav-cta-button" aria-label="Projekt anfragen">
            <span>Projekt anfragen</span>
            <span className="nav-cta-arrow" aria-hidden="true">→</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Menü öffnen"
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'mobile-drawer--open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <ul className="mobile-drawer-links" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`mobile-drawer-link ${link.active ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mobile-drawer-cta-item">
            <a
              href="#kontakt"
              className="nav-cta-button mobile-full-cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Projekt anfragen</span>
              <span className="nav-cta-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
