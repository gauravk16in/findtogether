import React from 'react';
import { FOOTER_MAIN_LINKS, FOOTER_LEGAL_LINKS } from '../constants';
import InstagramIcon from './icons/InstagramIcon';
import XIcon from './icons/XIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { Page } from '../App';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onLoginClick: () => void;
}


const Footer: React.FC<FooterProps> = ({ onNavigate, onLoginClick }) => {
  
  const handleLinkClick = (key: (typeof FOOTER_MAIN_LINKS)[0]['key']) => {
    if (key === 'login') {
      onLoginClick();
    } else {
      onNavigate(key);
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-600 px-6 lg:px-12 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 py-16">
          {/* Links Section */}
          <div className="w-full md:w-auto">
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {FOOTER_MAIN_LINKS.map(link => (
                <button 
                  key={link.name} 
                  onClick={() => handleLinkClick(link.key)}
                  className="text-left hover:text-black transition-colors text-lg"
                >
                  {link.name}
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-6">
              <a href="#" className="hover:text-black transition-colors">
                <InstagramIcon className="w-7 h-7" />
              </a>
              <a href="#" className="hover:text-black transition-colors">
                <XIcon className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-black transition-colors">
                <WhatsAppIcon className="w-7 h-7" />
              </a>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="text-left md:text-right">
              <h4 className="font-semibold text-lg text-black mb-2">Contact Us</h4>
              <p className="text-lg">
                  <a href="tel:1800-100-3434" className="hover:text-black transition-colors">1800-100-3434 (Toll-Free)</a>
              </p>
              <p className="text-lg">
                  <a href="mailto:helpme@findtogether.org" className="hover:text-black transition-colors">helpme@findtogether.org</a>
              </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-bold text-black text-base tracking-tight">FINDTOGETHER</span>
            <span>©FindTogether, 2025</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {FOOTER_LEGAL_LINKS.map(link => (
              <a key={link} href="#" className="hover:text-black transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;