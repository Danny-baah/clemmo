import React from 'react';
import Hero from './components/hero/Hero.jsx';
import About from './components/about/About.jsx';
import Products from './components/products/Products.jsx';
import Process from './components/process/Process.jsx';

import Quality from './components/quality/Quality.jsx';
import Contact from './components/contact/Contact.jsx';
import Footer from './components/footer/Footer.jsx';

/**
 * App - Root application component.
 * Houses:
 * 1. Cinematic Hero (Layered scrub)
 * 2. About section ("Über uns")
 * 3. Products section ("Unsere Produkte" - normal document flow)
 * 4. Process section ("Unser Prozess" - pinned storytelling experience)
 * 5. Quality section ("Qualität" - normal document flow)
 * 6. Contact section ("Kontakt" - final conversion section)
 * 7. Footer (CTA banner + comprehensive 5-col navigation & brand footer)
 */
export default function App() {
  return (
    <div className="clemmo-app">
      {/* 1. Cinematic Scroll Hero (Fixed stage during scrubbing) */}
      <Hero />

      {/* 2. About Section ("Über uns") - Physical sheet sliding over hero */}
      <About />

      {/* 3. Products Section ("Unsere Produkte") - Normal document scroll */}
      <Products />

      {/* 4. Process Section ("Unser Prozess") - Pinned storytelling experience */}
      <Process />

      {/* 5. Quality Section ("Qualität") - Normal document scroll */}
      <Quality />

      {/* 6. Contact Section ("Kontakt") - Final conversion section */}
      <Contact />

      {/* 7. Footer - Final brand footer & project CTA */}
      <Footer />
    </div>
  );
}
