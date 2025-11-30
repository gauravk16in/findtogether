import React from 'react';
import Hero from '../components/Hero';
import MarketplaceInfo from '../components/MarketplaceInfo';
import ToolsSection from '../components/ToolsSection';
import HealingSection from '../components/HealingSection';
import FaqSection from '../components/FaqSection';
import { Page } from '../App';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onReportMissing: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onReportMissing }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} onReportMissing={onReportMissing} />
      <MarketplaceInfo />
      <ToolsSection />
      <HealingSection />
      <FaqSection />
    </>
  );
};

export default HomePage;