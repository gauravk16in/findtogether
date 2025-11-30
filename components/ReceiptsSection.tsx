import React from 'react';
import { RECEIPTS_CONTENT } from '../constants';

const ReceiptsSection: React.FC = () => {
  return (
    <section className="bg-white pt-12 pb-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="max-w-4xl mb-20">
          <div className="w-16 h-px bg-gray-300 mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight">
            {RECEIPTS_CONTENT.headline}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left: Text Content */}
          <div className="max-w-md">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-800 leading-snug">
              {RECEIPTS_CONTENT.subheadline}
            </h3>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              {RECEIPTS_CONTENT.description}
            </p>
          </div>
          
          {/* Right: Stats */}
          <div className="space-y-10">
            {RECEIPTS_CONTENT.stats.map((stat, index) => (
              <div key={index} className="border-t border-gray-200 pt-8 first:pt-0 first:border-t-0">
                <h4 className="text-2xl font-medium text-gray-900">
                  {stat.title}
                </h4>
                <p className="mt-4 text-base text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReceiptsSection;