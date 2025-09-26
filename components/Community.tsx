import React from 'react';
import { COMMUNITY_MEMBERS } from '../constants';

const Community: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12">Our Community</h2>
      </div>
      <div className="flex space-x-6 animate-scroll pl-6">
        {[...COMMUNITY_MEMBERS, ...COMMUNITY_MEMBERS].map((member, index) => (
          <div key={index} className="flex-shrink-0 w-80 group relative">
            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-sm text-gray-300">{member.field}</p>
            </div>
          </div>
        ))}
      </div>
       <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          /* The width is (number_of_items * (item_width + gap)) */
          width: calc(${COMMUNITY_MEMBERS.length * 2} * (20rem + 1.5rem));
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Community;