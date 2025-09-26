import React, { useState } from 'react';
import { FAQ_DATA } from '../constants';
import ChevronIcon from './icons/ChevronIcon';

const FaqItem: React.FC<{ item: typeof FAQ_DATA[0]; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0 py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <span className="text-lg md:text-xl text-gray-800">{item.question}</span>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>
          <ChevronIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-gray-600 max-w-3xl pr-12">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};


const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleItemClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <section className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl">
            <h2 className="text-3xl font-medium text-gray-600 mb-10">FAQ</h2>
            <div>
                {FAQ_DATA.map((item, index) => (
                    <FaqItem 
                        key={index}
                        item={item}
                        isOpen={openIndex === index}
                        onClick={() => handleItemClick(index)}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;