import React from 'react';
import CasesGrid from '../components/CasesGrid';

interface CasesPageProps {
  onViewCase: (id: number) => void;
}

const CasesPage: React.FC<CasesPageProps> = ({ onViewCase }) => {
  return (
    <>
      <CasesGrid onViewCase={onViewCase} />
    </>
  );
};

export default CasesPage;