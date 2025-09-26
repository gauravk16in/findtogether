import React, { useState, useEffect, useRef } from 'react';
import { MARKETPLACE_STATS } from '../constants';
import DotGridIcon from './icons/DotGridIcon';

const MarketplaceInfo: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.2, // Trigger when 20% of the element is visible
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <p
          className={`text-3xl md:text-4xl lg:text-5xl text-gray-800/90 max-w-6xl leading-snug md:leading-snug lg:leading-snug transition-all duration-1000 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Findtogether unites technology and humanity to bring missing loved ones home. From AI-driven matching and heatmaps to real-time updates verified by officials, We create one secure space where families, NGOs, and governments can work together, faster, smarter, and with compassion.
        </p>

        <div className="mt-24 lg:mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {MARKETPLACE_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex items-start gap-4 transition-all duration-1000 ease-in-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <DotGridIcon className="w-10 h-10 text-black flex-shrink-0 mt-2" />
              <div>
                <h3
                  className={`text-6xl lg:text-7xl font-medium text-gray-400 transition-colors duration-500 ${
                    isVisible ? 'text-glow' : ''
                  }`}
                >
                  {stat.value}
                </h3>
                <p className="text-gray-600 mt-2 text-base">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketplaceInfo;