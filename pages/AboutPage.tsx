import React from 'react';
import AboutHero from '../components/AboutHero';
import ProblemStatement from '../components/ProblemStatement';
import SolutionStatement from '../components/SolutionStatement';
import SocialMission from '../components/SocialMission';
import ReceiptsSection from '../components/ReceiptsSection';

const AboutPage: React.FC = () => {
  return (
    <>
      <AboutHero />
      <ProblemStatement />
      <SolutionStatement />
      <SocialMission />
      <ReceiptsSection />
    </>
  );
};

export default AboutPage;
