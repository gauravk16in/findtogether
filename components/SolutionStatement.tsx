import React from 'react';
import { SOLUTION_STATEMENT_CONTENT } from '../constants';

const SolutionStatement: React.FC = () => {
  return (
    <section className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="max-w-4xl mb-20">
          <div className="w-16 h-px bg-gray-300 mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight">
            {SOLUTION_STATEMENT_CONTENT.headline}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image */}
          <div className="w-full">
            <img 
              src={SOLUTION_STATEMENT_CONTENT.imageUrl} 
              alt={SOLUTION_STATEMENT_CONTENT.imageAlt}
              className="rounded-3xl w-full h-auto object-cover" 
            />
          </div>
          
          {/* Text Content */}
          <div className="max-w-xl space-y-6 text-lg text-gray-800 leading-relaxed">
            {SOLUTION_STATEMENT_CONTENT.paragraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionStatement;
