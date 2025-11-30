import React from 'react';

const AppleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.36,13.7a2.73,2.73,0,0,0,1.43-2.3,2.81,2.81,0,0,0-2.82-2.82,2.73,2.73,0,0,0-2.61,1.46,2.69,2.69,0,0,0-2.31-1.46A2.83,2.83,0,0,0,9.23,11.4a2.7,2.7,0,0,0,1.52,2.42A7.26,7.26,0,0,0,7,20.08a1,1,0,0,0,1,.92H17.1a1,1,0,0,0,1-.92,7.3,7.3,0,0,0-3.79-6.38Z" />
    <path d="M12.5,3A2.43,2.43,0,0,0,14.79,5,2.5,2.5,0,0,0,15,2.5,2.43,2.43,0,0,0,12.5,3Z" />
  </svg>
);

export default AppleIcon;