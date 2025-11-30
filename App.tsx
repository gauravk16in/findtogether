import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import LoginPage from './pages/LoginPage';
import ReportMissingPage from './pages/ReportMissingPage';
import VolunteerDashboard from './pages/VolunteerDashboard';

export type Page = 'home' | 'about' | 'contact' | 'individuals' | 'organizations' | 'cases' | 'volunteer';

type Case = {
  id: number;
  name: string;
  age: number;
  lastSeenLocation: string;
  lastSeenDate: string;
  imageUrl: string;
  status: string;
  description: string;
  contact: { name: string | null, role: string | null };
  reportedBy: string | null;
  mapUrl: string;
  heatmapUrl: string;
}

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [loginContext, setLoginContext] = useState<'report' | 'general'>('general');
  const [casesData, setCasesData] = useState<Case[]>([]);

  // Fetch cases data when the app loads
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/cases' 
          : 'http://localhost:4000/api/cases';
        console.log('Fetching cases from:', apiUrl);
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Cases data:', data);
          setCasesData(data);
        } else {
          console.error('Failed to fetch cases - HTTP', response.status);
          // Use fallback data if API fails
          setCasesData([]);
        }
      } catch (error) {
        console.error('Failed to fetch cases:', error);
        // Use fallback data if API fails
        setCasesData([]);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    const isModalOpen = selectedCaseId !== null || showLoginModal || showReportModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCaseId, showLoginModal, showReportModal]);

  const handleViewCase = (id: number) => {
    setSelectedCaseId(id);
  };

  const handleCloseCase = () => {
    setSelectedCaseId(null);
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
    setLoginContext('general');
  };

  const handleOpenReport = () => {
    if (!user) {
      // If user is not logged in, show login modal instead
      setLoginContext('report');
      setShowLoginModal(true);
    } else {
      // If user is logged in, show report modal
      setShowReportModal(true);
    }
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
  };
  
  const { user } = useAuth();

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // After successful login, if user was trying to report missing person, show the report modal
    if (loginContext === 'report') {
      setShowReportModal(true);
    }
    setLoginContext('general');
  };


  const selectedCase = casesData.find(c => c.id === selectedCaseId);

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'cases':
        return <CasesPage onViewCase={handleViewCase} />;
      case 'volunteer':
        return <VolunteerDashboard />;
      default:
        return <HomePage onNavigate={setCurrentPage} onReportMissing={handleOpenReport} />;
    }
  };

  return (
    <div className="bg-white text-black min-h-screen font-sans p-4">
      <div className="relative rounded-3xl overflow-hidden bg-white">
        <Header onNavigate={setCurrentPage} onLoginClick={handleOpenLogin} />
        <main>{renderPage()}</main>
        <Footer onNavigate={setCurrentPage} onLoginClick={handleOpenLogin} />
      </div>
      {selectedCase && (
        <CaseDetailPage
          caseData={selectedCase}
          onClose={handleCloseCase}
          isLoggedIn={!!user}
          onOpenLogin={handleOpenLogin}
        />
      )}
      {showLoginModal && (
        <LoginPage onClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} context={loginContext} />
      )}
      {showReportModal && (
        <ReportMissingPage onClose={handleCloseReport} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;