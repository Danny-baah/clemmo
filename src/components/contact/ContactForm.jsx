import React, { useState } from 'react';

/**
 * ContactForm - Clean, compact editorial inquiry form matching the reference image.
 *
 * Fields:
 * - Vorname * | Nachname * (2-col row)
 * - E-Mail-Adresse *
 * - Betreff * (Select dropdown)
 * - Ihre Nachricht * (Textarea)
 * - Submit button ("Nachricht senden →") + inline privacy note
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <div className="contact-form-card" id="kontakt-formular">
      <div className="contact-form-header">
        <h3 className="contact-form-title">Nachricht senden</h3>
        <p className="contact-form-subtitle">
          Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
        </p>
      </div>

      {submitted ? (
        <div className="contact-form-success" role="alert" aria-live="polite">
          <div className="success-icon-badge" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h4 className="success-title">Vielen Dank für Ihre Nachricht!</h4>
          <p className="success-description">
            Wir haben Ihre Anfrage erhalten. Ein Berater von Clemmo HP wird sich schnellstmöglich bei Ihnen melden.
          </p>
          <button
            type="button"
            className="contact-submit-btn success-reset-btn"
            onClick={handleReset}
          >
            <span>Neue Nachricht</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <form className="contact-form-body" onSubmit={handleSubmit}>
          {/* Row 1: Vorname & Nachname */}
          <div className="form-row form-row-2col">
            <div className="form-field">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Vorname *"
                className="form-input"
                autoComplete="given-name"
                aria-label="Vorname"
              />
            </div>
            <div className="form-field">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Nachname *"
                className="form-input"
                autoComplete="family-name"
                aria-label="Nachname"
              />
            </div>
          </div>

          {/* Row 2: E-Mail-Adresse */}
          <div className="form-field">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="E-Mail-Adresse *"
              className="form-input"
              autoComplete="email"
              aria-label="E-Mail-Adresse"
            />
          </div>

          {/* Row 3: Betreff */}
          <div className="form-field">
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="form-input form-select"
              aria-label="Betreff"
            >
              <option value="">Betreff *</option>
              <option value="neues-projekt">Individuelles Baukasten-Modell anfragen</option>
              <option value="sonderedition">Limitierte Firmen-Edition</option>
              <option value="beratung">Architektur- & Modellberatung</option>
              <option value="sonstiges">Sonstiges Anliegen</option>
            </select>
          </div>

          {/* Row 4: Ihre Nachricht */}
          <div className="form-field">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Ihre Nachricht *"
              className="form-input form-textarea"
              aria-label="Ihre Nachricht"
            />
          </div>

          {/* Row 5: Action Button & Privacy Note Inline */}
          <div className="form-actions-row">
            <button
              type="submit"
              className="contact-submit-btn"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}</span>
              <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
            <p className="privacy-inline-text">
              Mit dem Absenden akzeptieren Sie unsere{' '}
              <a href="#datenschutz" className="privacy-link">Datenschutzerklärung</a>.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
