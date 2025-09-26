import React from 'react';

const ApplyCTA: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-blue-600 text-white text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Apply to NEW INC's Year 10</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Applications for our 2023-2024 cohort are now open. Join our community of creative practitioners and push the boundaries of your work.
        </p>
        <button className="px-10 py-4 bg-black text-white font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors">
          Apply Now
        </button>
      </div>
    </section>
  );
};

export default ApplyCTA;