import React from 'react';
import { ACTIVE_CASES_DATA } from '../constants';
import CloseIcon from '../components/icons/CloseIcon';
import ShareIcon from '../components/icons/ShareIcon';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import PlusIcon from '../components/icons/PlusIcon';
import MapPinIcon from '../components/icons/MapPinIcon';

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

interface CaseDetailPageProps {
  caseData: Case;
  onClose: () => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
}

const statusStyles: { [key: string]: string } = {
  'High Priority': 'text-red-400',
  'Active Search': 'text-blue-400',
  'New': 'text-green-400',
};

const InfoBlock: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={className}>
    <h3 className="text-sm font-medium text-gray-400 tracking-wide uppercase">{title}</h3>
    <div className="mt-2 text-gray-200">{children}</div>
  </div>
);


const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseData, onClose, isLoggedIn, onOpenLogin }) => {
  const statusColor = statusStyles[caseData.status] || 'text-gray-400';

  const handleReportSighting = () => {
    if (isLoggedIn) {
      alert('Thank you for your vigilance. The reporting form will be implemented soon.');
    } else {
      onOpenLogin();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
    >
      <div
        className="relative bg-[#111] text-gray-200 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-white/10 flex justify-end">
             <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className={statusColor}>Status: {caseData.status}</span>
                <span>·</span>
                <span>Case ID: #{caseData.id.toString().padStart(5, '0')}</span>
              </div>

              <div>
                <h1 id="case-title" className="text-4xl md:text-5xl font-bold text-white">{caseData.name}</h1>
                <p className="mt-2 text-lg text-gray-400">
                  Last Seen: {caseData.lastSeenDate} · {caseData.lastSeenLocation}
                </p>
              </div>

              <hr className="border-white/10" />

              <InfoBlock title="Case Details">
                <p className="text-base leading-relaxed">{caseData.description}</p>
              </InfoBlock>
              
              <InfoBlock title="Lead Contact">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0">
                          <img src={caseData.imageUrl} alt={caseData.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">{caseData.contact.name || 'Contact Information Available'}</p>
                            <p className="text-sm text-gray-400">{caseData.contact.role || 'Official Contact'}</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                        Contact <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
              </InfoBlock>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 bg-black/40 p-8 md:p-10 space-y-6 border-l border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Reported By</p>
                        <p className="font-semibold text-white">{caseData.reportedBy || 'Official Report'}</p>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ShareIcon className="w-5 h-5"/>
                </button>
              </div>

              <InfoBlock title="Last Known Location">
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                    <img src={caseData.mapUrl} alt={`Map of ${caseData.lastSeenLocation}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30"></div>
                     <MapPinIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-red-500"/>
                </div>
                <p className="text-sm mt-2 text-gray-400">{caseData.lastSeenLocation}</p>
              </InfoBlock>
              
              <InfoBlock title="Heatmap Analysis">
                 <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <img src={caseData.heatmapUrl} alt="AI generated heatmap" className="w-full h-full object-cover" />
                 </div>
                 <p className="text-sm mt-2 text-gray-400">AI-generated probability map of potential locations.</p>
              </InfoBlock>

            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 p-6 border-t border-white/10 bg-[#111]">
            <button 
              onClick={handleReportSighting}
              className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                Report a Sighting <PlusIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CaseDetailPage;