import React from 'react';
import { SOCIAL_MISSION_CONTENT } from '../constants';

const SocialMission: React.FC = () => {
  return (
    <section className="bg-white pt-12 pb-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="max-w-4xl mb-20">
          <div className="w-16 h-px bg-gray-300 mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight">
            {SOCIAL_MISSION_CONTENT.headline}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image */}
          <div className="w-full">
            <img 
              src={SOCIAL_MISSION_CONTENT.imageUrl} 
              alt={SOCIAL_MISSION_CONTENT.imageAlt}
              className="rounded-3xl w-full h-auto object-cover" 
            />
          </div>
          
          {/* Text Content */}
          <div className="max-w-xl">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-800 leading-snug">
              {SOCIAL_MISSION_CONTENT.title}
            </h3>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              {SOCIAL_MISSION_CONTENT.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMission;
