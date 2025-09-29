
import React from 'react';

type IconProps = {
  className?: string;
};

export const PremiumDnaIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 64 64" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    stroke="currentColor"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#007BFF', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#00C6FF', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path 
      d="M32 56C18.745 56 8 45.255 8 32S18.745 8 32 8" 
      stroke="url(#grad1)" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M32 8C45.255 8 56 18.745 56 32S45.255 56 32 56" 
      stroke="url(#grad1)" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeDasharray="4 8"
    />
    <path 
      d="M20 20L44 44" 
      stroke="url(#grad1)" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
     <path 
      d="M20 44L44 20" 
      stroke="url(#grad1)" 
      strokeWidth="3" 
      strokeLinecap="round"
    />
     <path 
      d="M26,32 A6,6 0 0,1 38,32" 
      stroke="url(#grad1)" 
      strokeWidth="3" 
      strokeLinecap="round"
      fill="none"
    />
     <path 
      d="M26,32 A6,6 0 0,0 38,32" 
      stroke="url(#grad1)" 
      strokeWidth="3" 
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);
