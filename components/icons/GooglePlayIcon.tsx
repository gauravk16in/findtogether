import React from 'react';

const GooglePlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.64,11.3,4.11,2.51a1,1,0,0,0-1.45,1L4.85,12,2.66,20.47a1,1,0,0,0,1.45,1l16.53-8.79A1,1,0,0,0,20.64,11.3Z" />
  </svg>
);

export default GooglePlayIcon;