// LogoSVG.jsx
import React from 'react';

const LogoSVG = (props) => (
  <svg
    width="100"
    height="auto"
    viewBox="0 0 400 200"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Background */}
    <rect width="100%" height="100%" fill="none" />

    {/* "g" in bold, stylish font */}
    <text
      x="10"
      y="150"
      fontFamily="Impact, Arial Black, sans-serif"
      fontSize="150"
      fill="#90EE90"
    >
      D
    </text>

    {/* Shorter "i" (dotless), so we can place the globe as the dot */}
    <text
      x="120"
      y="150"
      fontFamily="Impact, Arial Black, sans-serif"
      fontSize="100"
      fill="#90EE90"
    >
      ı
    </text>

    {/* Globe graphic (dot for "i") */}
    <g transform="translate(135, 60)">
      {/* Outer circle */}
      <circle cx="0" cy="0" r="15" fill="none" stroke="#90EE90" strokeWidth="3" />
      {/* Horizontal and vertical lines */}
      <line x1="-15" y1="0" x2="15" y2="0" stroke="#90EE90" strokeWidth="2" />
      <line x1="0" y1="-15" x2="0" y2="15" stroke="#90EE90" strokeWidth="2" />
      {/* Ellipses to suggest latitude/longitude */}
      <ellipse
        cx="0"
        cy="0"
        rx="15"
        ry="7"
        fill="none"
        stroke="#90EE90"
        strokeWidth="2"
      />
      <ellipse
        cx="0"
        cy="0"
        rx="7"
        ry="15"
        fill="none"
        stroke="#90EE90"
        strokeWidth="2"
        transform="rotate(45)"
      />
    </g>

    {/* "s" in bold, stylish font at x=180 */}
    <text
      x="180"
      y="150"
      fontFamily="Impact, Arial Black, sans-serif"
      fontSize="150"
      fill="#90EE90"
    >
      S
    </text>
  </svg>
);

export default LogoSVG;
