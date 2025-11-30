import React from 'react';

const PulsatingPlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className}`}>
    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 5x5 Dot Grid */}
      {[...Array(5)].map((_, i) =>
        [...Array(5)].map((_, j) => (
          <circle
            key={`${i}-${j}`}
            cx={25 + i * 37.5}
            cy={25 + j * 37.5}
            r="6"
            fill="#C4B5FD"
          />
        ))
      )}
    </svg>
  </div>
);

export default PulsatingPlusIcon;