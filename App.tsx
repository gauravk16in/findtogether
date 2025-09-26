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
import ViewReportsPage from './pages/ViewReportsPage';

export type Page = 'home' | 'about' | 'contact' | 'individuals' | 'organizations' | 'cases';

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
  const [showViewReportsModal, setShowViewReportsModal] = useState<boolean>(false);
  const [loginContext, setLoginContext] = useState<'report' | 'general'>('general');
  const [casesData, setCasesData] = useState<Case[]>([]);

  // Fetch cases data when the app loads
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/cases' 
          : 'http://localhost:4000/api/cases';
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setCasesData(data);
        }
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    const isModalOpen = selectedCaseId !== null || showLoginModal || showReportModal || showViewReportsModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCaseId, showLoginModal, showReportModal, showViewReportsModal]);

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

  const handleOpenViewReports = () => {
    setShowViewReportsModal(true);
  };

  const handleCloseViewReports = () => {
    setShowViewReportsModal(false);
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
      default:
        return <HomePage onNavigate={setCurrentPage} onReportMissing={handleOpenReport} />;
    }
  };

  return (
    <div className="bg-white text-black min-h-screen font-sans p-4">
      <div className="relative rounded-3xl overflow-hidden bg-white">
        <Header onNavigate={setCurrentPage} onLoginClick={handleOpenLogin} onViewReports={handleOpenViewReports} />
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
      {showViewReportsModal && (
        <ViewReportsPage onClose={handleCloseViewReports} />
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