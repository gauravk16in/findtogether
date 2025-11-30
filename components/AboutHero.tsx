import React from 'react';

const AboutHero: React.FC = () => {
  return (
    <section className="relative h-screen w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504455581135-b0f3a670f59a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      ></div>
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-10"></div>
      <div className="absolute inset-0 dot-pattern z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end mx-auto px-6 lg:px-12 pb-24 md:pb-32">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-gray-900 tracking-tighter max-w-4xl leading-tight">
          Technology and humanity, united to bring them home.
        </h1>
      </div>
    </section>
  );
};

export default AboutHero;