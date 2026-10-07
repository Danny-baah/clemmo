import React from 'react';

/**
 * GermanyMap - Recognizable vector silhouette outline of Germany with a location pin.
 */
export default function GermanyMap() {
  return (
    <div className="germany-map-wrapper" aria-label="Deutschlandkarte Standort">
      <svg
        viewBox="0 0 120 160"
        className="germany-silhouette-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Germany Geographic Contour Silhouette */}
        <path
          d="M 52,14 
             L 57,11 L 62,17 L 68,16 L 75,22 L 72,27 L 80,31 L 88,29 L 95,36 L 93,44 L 99,51 
             L 94,59 L 97,68 L 92,76 L 96,86 L 89,95 L 85,93 L 81,102 L 86,112 L 81,123 
             L 77,133 L 79,142 L 72,147 L 62,149 L 52,147 L 46,143 L 41,146 L 35,142 
             L 37,132 L 31,124 L 34,116 L 28,107 L 30,97 L 24,91 L 27,82 L 23,73 
             L 28,64 L 25,55 L 31,48 L 38,47 L 42,39 L 40,30 L 48,22 Z"
          fill="rgba(87, 120, 119, 0.2)"
          stroke="rgba(141, 175, 174, 0.55)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Location Marker Dot */}
        <circle cx="68" cy="98" r="3.5" fill="#5ce6b0" />
        <circle cx="68" cy="98" r="7" stroke="#5ce6b0" strokeWidth="0.8" opacity="0.45" />

        {/* Location Text Label */}
        <text
          x="77"
          y="101"
          fill="#ffffff"
          fontSize="7"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.02em"
        >
          Clemmo
        </text>
      </svg>
    </div>
  );
}
