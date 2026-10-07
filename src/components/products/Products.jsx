import React, { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import './products.css';

/**
 * Products - "Unsere Produkte" showcase section.
 * Follows the About section in natural document flow.
 * Displays three distinct product worlds (Kleine Sets, Individuelle Sets, Technische Sets).
 */
export default function Products() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const productsData = [
    {
      id: 'small',
      variant: 'light',
      title: 'Kleine Sets',
      description: 'Kompakte Sets, ideal für Promotions, Give-aways und Markenpräsenz.',
      image: './products/product_small.jpg',
      alt: 'Kompakte Clemmo HP Klemmbaustein-Sets für Give-aways und Promotions',
      points: [
        {
          text: 'Ideal für Marketing & Events',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12v10H4V12" />
              <path d="M2 7h20v5H2z" />
              <path d="M12 22V7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          ),
        },
        {
          text: 'Individuelle Gestaltungsmöglichkeiten',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          ),
        },
        {
          text: 'Kleine bis mittlere Stückzahlen',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          ),
        },
      ],
    },
    {
      id: 'custom',
      variant: 'teal',
      title: 'Individuelle Sets',
      description: 'Maßgeschneiderte Designs nach Ihren Vorstellungen – einzigartig und markengerecht.',
      image: './products/product_custom.jpg',
      alt: 'Maßgeschneiderte Clemmo HP Architektur- und Markenmodelle aus Klemmbausteinen',
      points: [
        {
          text: 'Eigene Designs und Markenwelten',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          ),
        },
        {
          text: 'Flexible Funktionen und Themen',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
        {
          text: 'Von der Idee bis zur Serienproduktion',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          ),
        },
      ],
    },
    {
      id: 'tech',
      variant: 'dark',
      title: 'Technische Sets',
      description: 'Komplexe Modelle mit speziellen Funktionen und technischen Anforderungen.',
      image: './products/product_tech.jpg',
      alt: 'Komplexe technische Modelle und Funktionsbausätze aus Klemmbausteinen',
      points: [
        {
          text: 'Technisch anspruchsvolle Konstruktionen',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4" />
              <path d="M12 19v4" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="m4.93 4.93 2.83 2.83" />
              <path d="m16.24 16.24 2.83 2.83" />
              <path d="m4.93 19.07 2.83-2.83" />
              <path d="m16.24 7.76 2.83-2.83" />
            </svg>
          ),
        },
        {
          text: 'Bewegliche Funktionen und Details',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
              <polyline points="7.5 19.79 7.5 14.6 3 12" />
              <polyline points="21 12 16.5 14.6 16.5 19.79" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          ),
        },
        {
          text: 'Für anspruchsvolle Projekte und Zielgruppen',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <section
      id="produkte"
      ref={sectionRef}
      className="products-section"
      aria-label="Unsere Produkte"
    >
      <div className="products-container">
        {/* Section Header Top Row */}
        <header className={`products-header reveal-init ${isVisible ? 'reveal-active' : ''}`}>
          <div className="products-header-left">
            <div className="products-eyebrow">
              <span className="products-eyebrow-rule" aria-hidden="true" />
              <span className="products-eyebrow-text">UNSERE PRODUKTE</span>
            </div>

            <h2 className="products-headline">
              <span className="products-headline-dark">Drei Produktwelten.</span>
              <span className="products-headline-accent">Unendliche Möglichkeiten.</span>
            </h2>

            <p className="products-subtext">
              Ob kleine Sets, individuelle Sonderanfertigungen oder komplexe technische Modelle –
              wir entwickeln und produzieren maßgeschneiderte Klemmbaustein-Lösungen für Ihre Marke.
            </p>
          </div>

          <div className="products-header-right">
            <a href="#produkte" className="products-outline-cta" aria-label="Alle Produkte ansehen">
              <span>Alle Produkte ansehen</span>
              <span className="products-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </header>

        {/* 3 Product Cards Showcase Grid */}
        <div className="products-grid">
          {productsData.map((prod, index) => (
            <ProductCard
              key={prod.id}
              title={prod.title}
              description={prod.description}
              points={prod.points}
              image={prod.image}
              alt={prod.alt}
              variant={prod.variant}
              ctaText="Mehr erfahren"
              href="#produkte"
              className={`reveal-init ${isVisible ? 'reveal-active' : ''} reveal-delay-${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
