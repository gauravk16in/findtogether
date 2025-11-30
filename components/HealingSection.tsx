import React, { useState, useEffect, useRef } from 'react';
import { HEALING_SECTION_CONTENT } from '../constants';
import WavyBlobIcon from './icons/WavyBlobIcon';
import PulsatingPlusIcon from './icons/PulsatingPlusIcon';

const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<HTMLElement | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new window.IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);

    const { current: currentObserver } = observer;
    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, options]);

  // Fix: Add 'as const' to ensure the hook returns a tuple type.
  // This prevents TypeScript from inferring a union array type, which caused
  // incorrect types for 'setPart1Ref' and 'isPart1Visible' during destructuring.
  return [setNode, entry?.isIntersecting] as const;
};


const HealingSection: React.FC = () => {
    const [setPart1Ref, isPart1Visible] = useIntersectionObserver({ threshold: 0.2 });
    const [setPart2Ref, isPart2Visible] = useIntersectionObserver({ threshold: 0.2 });
    const [setPart3Ref, isPart3Visible] = useIntersectionObserver({ threshold: 0.2 });


  return (
    <section className="bg-white text-black overflow-hidden">
      {/* Part 1: Healing loves company */}
      <div
        ref={setPart1Ref as unknown as React.Ref<HTMLDivElement>}
        className="py-32 px-6 lg:px-12 min-h-[70vh] flex items-center"
      >
        <div 
          className={`max-w-3xl transition-all duration-1000 ease-in-out ${isPart1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-6xl md:text-7xl font-medium leading-tight tracking-tighter">
            {HEALING_SECTION_CONTENT.part1.headline}
          </h2>
          <p className="mt-6 text-2xl text-gray-700">
            {HEALING_SECTION_CONTENT.part1.subheadline}
          </p>
          <a href="#" className="mt-8 inline-block text-lg text-gray-600 border-b border-gray-300 hover:border-black transition-colors">
            {HEALING_SECTION_CONTENT.part1.linkText}
          </a>
        </div>
      </div>

      {/* Part 2: Connection that means something */}
      <div 
        ref={setPart2Ref as unknown as React.Ref<HTMLDivElement>}
        className="py-32 px-6 lg:px-12"
      >
        <div 
            className={`relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center transition-all duration-1000 ease-in-out ${isPart2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-lg">
            <h3 className="text-4xl md:text-5xl font-medium leading-tight">
              {HEALING_SECTION_CONTENT.part2.title}
            </h3>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              {HEALING_SECTION_CONTENT.part2.description}
            </p>
          </div>
          <div className="flex justify-center items-center row-start-1 md:row-start-auto">
            <WavyBlobIcon className="w-64 h-64 md:w-80 md:h-80" />
          </div>
        </div>
      </div>
      
      {/* Part 3: Better health outcomes */}
      <div 
        ref={setPart3Ref as unknown as React.Ref<HTMLDivElement>}
        className="py-32 px-6 lg:px-12"
      >
        <div 
            className={`relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center transition-all duration-1000 ease-in-out ${isPart3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-lg">
            <h3 className="text-4xl md:text-5xl font-medium leading-tight">
              {HEALING_SECTION_CONTENT.part3.title}
            </h3>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              {HEALING_SECTION_CONTENT.part3.description}
            </p>
          </div>
          <div className="flex justify-center items-center">
            <PulsatingPlusIcon className="w-56 h-56 md:w-64 md:h-64" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealingSection;