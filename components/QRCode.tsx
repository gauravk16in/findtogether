import React from 'react';

// A simple placeholder QR code SVG
const QRCode: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 0H60V60H0V0ZM12 12H48V48H12V12Z" fill="black"/>
    <path d="M24 24H36V36H24V24Z" fill="black"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M88 0H148V60H88V0ZM100 12H136V48H100V12Z" fill="black"/>
    <path d="M112 24H124V36H112V24Z" fill="black"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M0 88H60V148H0V88ZM12 100H48V136H12V100Z" fill="black"/>
    <path d="M24 112H36V124H24V112Z" fill="black"/>
    <path d="M136 76H148V88H136V76ZM136 100H148V112H136V100ZM136 124H148V148H124V136H112V124H100V112H88V100H100V88H112V76H124V88H112V100H124V112H136V124H124V112H112V124H100V136H88V148H76V136H64V124H76V112H88V124H100V136H112V148H124V136H136V124ZM64 64H76V76H64V64ZM88 64H100V76H88V64ZM64 88H76V100H64V88ZM76 76H88V88H76V76Z" fill="black"/>
  </svg>
);

export default QRCode;