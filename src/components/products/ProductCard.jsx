import React from 'react';

/**
 * ProductCard - Displays an individual product tier panel with custom image,
 * description, 3 bullet points, and circular arrow control.
 */
export default function ProductCard({
  title,
  description,
  points = [],
  image,
  alt,
  variant = 'light',
  ctaText = 'Mehr erfahren',
  href = '#produkte',
  className = '',
}) {
  const variantClass = `product-card--${variant}`;

  return (
    <article className={`product-card ${variantClass} ${className}`}>
      {/* Top Product Media Image */}
      <div className="product-card-media">
        <img
          src={image}
          alt={alt || title}
          className="product-card-img"
          loading="lazy"
        />
        <div className="ai-subtle-tag" aria-hidden="true">
          <span>KI-generiert</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="product-card-body">
        <h3 className="product-card-title">{title}</h3>
        <p className="product-card-desc">{description}</p>

        {/* 3 Supporting Points */}
        <ul className="product-card-points" role="list">
          {points.map((pt, index) => (
            <li key={index} className="product-card-point">
              <span className="product-point-icon" aria-hidden="true">
                {pt.icon}
              </span>
              <span>{pt.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
