import React from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon';

const WhatWeDo: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Do</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              NEW INC supports a diverse range of creative practitioners with a values-led program and safe space for gathering and developing a sustainable practice. We are a global community of 800+ members and alumni who are shaping the future.
            </p>
            <button className="group inline-flex items-center text-lg font-medium text-white">
              <span>Learn More</span>
              <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://picsum.photos/seed/whatwedo/800/600" 
              alt="Creative collaboration" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;