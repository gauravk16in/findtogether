import React from 'react';
import { ORGS_DATA } from '../constants';

const MemberAvatars: React.FC = () => (
  <div className="flex items-center">
    <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white -ml-2 first:ml-0"></div>
    <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-white -ml-2 first:ml-0"></div>
    <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-white -ml-2 first:ml-0"></div>
  </div>
);

const OrgCard: React.FC<{ org: typeof ORGS_DATA[0] }> = ({ org }) => (
  <div className={`relative rounded-3xl overflow-hidden w-full ${org.heightClass}`}>
    <img src={org.bgImageUrl} alt={org.name} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 dot-pattern opacity-50"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
    <div className="relative h-full flex flex-col justify-end p-6 text-black">
      <div className="bg-black/5 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <img src={org.logoUrl} alt={`${org.name} logo`} className="w-12 h-12 object-contain" />
      </div>
      <h3 className="text-2xl font-medium">{org.name}</h3>
      <div className="flex items-center gap-2 mt-2">
        <MemberAvatars />
        <span className="text-sm text-gray-800">{org.members}</span>
      </div>
    </div>
  </div>
);


const OrgsSection: React.FC = () => {
  return (
    <section className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        
        {/* Left Side: Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="flex flex-col gap-6 pt-0 sm:pt-12">
              <OrgCard org={ORGS_DATA[0]} />
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              <OrgCard org={ORGS_DATA[1]} />
              <OrgCard org={ORGS_DATA[2]} />
            </div>
          </div>
        </div>

        {/* Right Side: Text Content */}
        <div className="lg:col-span-2">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-px bg-gray-300 mb-6"></div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900/90 leading-tight">
              Built by the people who've been there. Backed by orgs that get it.
            </h2>
            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
              Join a platform packed with events and communities from trusted organizations, passionate communities, and experts doing the real work.
            </p>
            <button className="mt-8 bg-black text-white font-medium px-6 py-3 rounded-full text-base hover:bg-gray-800 transition-colors">
              Join Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrgsSection;