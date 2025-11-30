import React from 'react';
import { SPACES_CONTENT } from '../constants';

const ToolsSection: React.FC = () => {
  return (
    <section className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
          <p className="text-2xl md:text-3xl text-gray-800/90 leading-snug">
            FindTogether connects families, communities, and authorities, putting powerful AI tools and real-time maps at your fingertips — so every step brings us closer to your loved ones.
          </p>
        </div>

        {/* Content Cards - Now directly showing 'Spaces' content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Card 1: Text Content */}
            <div className="bg-[#bde9d1] text-black rounded-3xl p-8 lg:p-10 h-full flex flex-col justify-between min-h-[400px]">
              <div>
                <span className="bg-black/10 text-black px-4 py-1.5 rounded-full text-sm font-medium">{SPACES_CONTENT.card1.tag}</span>
                <h3 className="text-4xl md:text-5xl font-medium mt-6 leading-tight tracking-tight">{SPACES_CONTENT.card1.title}</h3>
              </div>
              <p className="text-base text-black/70 mt-8">{SPACES_CONTENT.card1.description}</p>
            </div>

            {/* Card 2: Family Image */}
            <div className="rounded-3xl p-6 h-full flex items-center justify-center min-h-[400px]" style={{backgroundColor: '#fcdeb4'}}>
              <img 
                src={SPACES_CONTENT.card2.imageUrl} 
                alt={SPACES_CONTENT.card2.alt}
                className="w-full h-auto object-cover rounded-2xl shadow-lg max-h-[350px]"
              />
            </div>

            {/* Card 3: Lifestyle Image */}
            <div className="bg-gray-200 rounded-3xl overflow-hidden h-full">
              <img 
                src={SPACES_CONTENT.card3.imageUrl} 
                alt={SPACES_CONTENT.card3.alt}
                className="w-full h-full object-cover min-h-[400px]"
              />
            </div>

        </div>
      </div>
    </section>
  );
};

export default ToolsSection;