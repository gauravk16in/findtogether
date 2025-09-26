import React from 'react';
import { TRACKS_DATA } from '../constants';
import ArrowRightIcon from './icons/ArrowRightIcon';

const Tracks: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12">Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {TRACKS_DATA.map((track, index) => (
            <div key={index} className="group">
              <div className="flex items-baseline mb-4">
                <span className="text-sm font-mono mr-4 text-gray-400">0{index + 1}</span>
                <h3 className="text-2xl font-bold">{track.title}</h3>
              </div>
              <p className="text-gray-300 mb-6 ml-10">{track.description}</p>
              <a href="#" className="inline-flex items-center text-white ml-10 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More
                <ArrowRightIcon className="w-4 h-4 ml-2"/>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tracks;