import React from 'react';

const DotGridIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="4" fill="currentColor" />
    <circle cx="18" cy="6" r="4" fill="currentColor" />
    <circle cx="30" cy="6" r="4" fill="currentColor" />
    <circle cx="42" cy="6" r="4" fill="currentColor" />
    
    <circle cx="6" cy="18" r="4" fill="currentColor" />
    <circle cx="18" cy="18" r="4" fill="currentColor" fillOpacity="0.3" />
    <circle cx="30" cy="18" r="4" fill="currentColor" />
    <circle cx="42" cy="18" r="4" fill="currentColor" fillOpacity="0.3" />

    <circle cx="6" cy="30" r="4" fill="currentColor" />
    <circle cx="18" cy="30" r="4" fill="currentColor" />
    <circle cx="30" cy="30" r="4" fill="currentColor" fillOpacity="0.3" />
    <circle cx="42" cy="30" r="4" fill="currentColor" fillOpacity="0.3" />

    <circle cx="6" cy="42" r="4" fill="currentColor" />
    <circle cx="18" cy="42" r="4" fill="currentColor" fillOpacity="0.3" />
    <circle cx="30" cy="42" r="4" fill="currentColor" />
    <circle cx="42" cy="42" r="4" fill="currentColor" />
  </svg>
);

export default DotGridIcon;
