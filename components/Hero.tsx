import React from 'react';
import ArrowDownIcon from './icons/ArrowDownIcon';
import PlayIcon from './icons/PlayIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import UserIcon from './icons/UserIcon';
import { Page } from '../App';
import { useAuth } from '../src/contexts/AuthContext';

interface HeroProps {
  onNavigate: (page: Page) => void;
  onReportMissing: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, onReportMissing }) => {
  const { user } = useAuth();
  
  return (
    <section className="relative h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", filter: 'blur(4px) brightness(1)' }}></div>
      
      {/* Gradient and Dot Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-blue-100/20 z-10"></div>
      <div className="absolute inset-0 dot-pattern z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-between mx-auto px-6 lg:px-12 pt-32 pb-16">
          
          <div className="flex-grow flex items-center pb-2">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-gray-900/90 tracking-tighter max-w-4xl leading-tight mb-2">
                  Every second matters when a loved one goes missing
              </h1>
          </div>

          <div className="flex flex-wrap items-end justify-start md:justify-between gap-6">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 max-w-sm border border-black/10 order-1">
                  <p className="text-gray-800 text-base mb-4 leading-relaxed">
                      With every report, every search, and every connection we are turning technology into a lifeline for families
                  </p>
                  <a href="#" className="flex items-center gap-2 text-black font-medium group">
                      <ArrowDownIcon className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                      Explore
                  </a>
              </div>
              
              <button 
                onClick={onReportMissing}
                className="bg-white/50 backdrop-blur-md rounded-2xl py-6 px-8 border border-black/10 order-2 flex items-center justify-center text-black font-medium group text-lg hover:bg-white/70 transition-colors"
              >
                {!user && <UserIcon className="w-5 h-5 mr-2 text-gray-600" />}
                <span>Find Now</span>
                <ArrowRightIcon className="w-5 h-5 ml-3 transition-transform transform -rotate-45" />
              </button>

              <div className="flex-grow md:flex-grow-0 order-3"></div>

              <button className="bg-white/50 backdrop-blur-md rounded-full w-32 h-32 flex items-center justify-center text-lg font-medium group border border-black/10 hover:bg-white/70 transition-colors ml-auto order-4 text-black">
                  <PlayIcon className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Watch
              </button>
          </div>
      </div>
    </section>
  );
};

export default Hero;