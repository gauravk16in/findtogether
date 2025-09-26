import React from 'react';
import { SUPPORTERS_LOGOS } from '../constants';

const Support: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-black border-t border-gray-800">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Support</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-10 items-center">
          {SUPPORTERS_LOGOS.map((logo, index) => (
            <div key={index} className="flex justify-center items-center">
              <span className="text-gray-400 text-sm font-semibold tracking-widest text-center">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Support;