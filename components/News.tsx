import React from 'react';
import { NEWS_ARTICLES } from '../constants';
import ArrowRightIcon from './icons/ArrowRightIcon';

const News: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">In The News</h2>
            <a href="#" className="group hidden sm:inline-flex items-center text-lg font-medium text-white">
              <span>View All</span>
              <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEWS_ARTICLES.map((article, index) => (
            <div key={index} className="group">
              <div className="overflow-hidden mb-4">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm text-gray-400 mb-2">{article.category}</p>
              <h3 className="text-xl font-bold mb-2 group-hover:underline">{article.title}</h3>
              <p className="text-md text-gray-300">via {article.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;