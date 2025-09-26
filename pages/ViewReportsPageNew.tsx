import React, { useState, useEffect } from 'react';
import CloseIcon from '../components/icons/CloseIcon';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import UserIcon from '../components/icons/UserIcon';
import MapPinIcon from '../components/icons/MapPinIcon';
import ShareIcon from '../components/icons/ShareIcon';
import ChevronIcon from '../components/icons/ChevronIcon';
import PlusIcon from '../components/icons/PlusIcon';

interface Report {
  id: number;
  case_id: number;
  reporter_name: string;
  reporter_relation: string;
  reporter_whatsapp: string | null;
  reporter_address: string | null;
  reporter_contact: string | null;
  reporter_email: string | null;
  missing_person_identification: string | null;
  missing_person_social_media: string | null;
  created_at: string;
  cases: {
    id: number;
    status: string;
    reported_by: string | null;
    contact_name: string | null;
    contact_role: string | null;
    person_id: number;
    created_at: string;
    persons: {
      id: number;
      name: string;
      age: number;
      description: string;
      last_seen_location: string;
      last_seen_date: string;
      created_at: string;
      photos: Array<{
        id: number;
        image_url: string;
        person_id: number;
        created_at: string;
      }>;
    };
  };
}

interface ViewReportsPageProps {
  onClose: () => void;
}

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateOnly = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const statusStyles: { [key: string]: { pill: string, dot: string } } = {
  'High Priority': { pill: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  'Active Search': { pill: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  'New': { pill: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  'Closed': { pill: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' }
};

const InfoBlock: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={className}>
    <h3 className="text-sm font-medium text-gray-500 tracking-wide uppercase mb-2">{title}</h3>
    <div className="text-gray-900">{children}</div>
  </div>
);

const GoogleMap: React.FC<{ location: string; className?: string }> = ({ location, className = '' }) => {
  const encodedLocation = encodeURIComponent(location);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedLocation}`;
  
  return (
    <div className={`bg-gray-200 rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={mapUrl}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map of ${location}`}
      />
      {/* Fallback when API key is not set */}
      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <MapPinIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium">{location}</p>
          <p className="text-xs text-gray-500 mt-1">Map Preview</p>
        </div>
      </div>
    </div>
  );
};

const ReportCard: React.FC<{ report: Report; onViewDetail: (report: Report) => void }> = ({ report, onViewDetail }) => {
  const person = report.cases.persons;
  const mainPhoto = person.photos[0]?.image_url || '/api/placeholder/150/150';
  const style = statusStyles[report.cases.status] || { pill: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-black/10 transition-all duration-300">
      <div className="flex items-start gap-6">
        <img 
          src={mainPhoto} 
          alt={person.name}
          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
        />
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900 truncate">{person.name}</h3>
            <span className={`flex items-center gap-1.5 ${style.pill} px-2.5 py-1 text-xs font-bold rounded-full`}>
              <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
              {report.cases.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-500">Case ID:</span>
              <span className="ml-2 font-bold text-black">#{report.case_id.toString().padStart(5, '0')}</span>
            </div>
            <div>
              <span className="text-gray-500">Age:</span>
              <span className="ml-2 font-medium text-gray-900">{person.age} years</span>
            </div>
            <div>
              <span className="text-gray-500">Reporter:</span>
              <span className="ml-2 font-medium text-gray-900">{report.reporter_name}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>Last seen: {person.last_seen_location} on {formatDateOnly(person.last_seen_date)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Submitted: {formatDate(report.created_at)}
            </span>
            <button
              onClick={() => onViewDetail(report)}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Full Report
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDetailModal: React.FC<{ report: Report; onClose: () => void }> = ({ report, onClose }) => {
  const person = report.cases.persons;
  const style = statusStyles[report.cases.status] || { pill: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' };
  
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white w-full max-w-7xl max-h-[95vh] rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{person.name}</h1>
                <span className={`flex items-center gap-1.5 ${style.pill} px-3 py-1.5 text-sm font-bold rounded-full`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></span>
                  {report.cases.status}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>Case ID: <strong className="text-black">#{report.case_id.toString().padStart(5, '0')}</strong></span>
                <span>Report ID: <strong className="text-black">#{report.id.toString().padStart(5, '0')}</strong></span>
                <span>Submitted: <strong className="text-black">{formatDate(report.created_at)}</strong></span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-200"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column - Photos and Basic Info */}
            <div className="lg:col-span-1 p-6 bg-gray-50 border-r border-gray-200">
              <div className="space-y-6">
                {/* Photos */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Missing Person Photos</h3>
                  <div className="space-y-3">
                    {person.photos.length > 0 ? (
                      person.photos.map((photo, index) => (
                        <div key={photo.id} className="relative">
                          <img
                            src={photo.image_url}
                            alt={`${person.name} photo ${index + 1}`}
                            className="w-full h-48 rounded-lg object-cover border-2 border-gray-200"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            Photo {index + 1}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age:</span>
                      <span className="font-medium">{person.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Missing Since:</span>
                      <span className="font-medium">{formatDateOnly(person.last_seen_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Case Created:</span>
                      <span className="font-medium">{formatDateOnly(report.cases.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Missing Person Details */}
            <div className="lg:col-span-1 p-6 space-y-6">
              <InfoBlock title="Missing Person Details">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{person.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Age</label>
                    <p className="text-gray-900">{person.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Physical Description</label>
                    <p className="text-gray-900">{person.description || 'No description provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Seen Location</label>
                    <p className="text-gray-900 font-medium">{person.last_seen_location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Seen Date</label>
                    <p className="text-gray-900 font-medium">{formatDateOnly(person.last_seen_date)}</p>
                  </div>
                  {report.missing_person_identification && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Identification Details</label>
                      <p className="text-gray-900">{report.missing_person_identification}</p>
                    </div>
                  )}
                  {report.missing_person_social_media && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Social Media Handles</label>
                      <p className="text-gray-900">{report.missing_person_social_media}</p>
                    </div>
                  )}
                </div>
              </InfoBlock>

              <InfoBlock title="Location & Map">
                <div className="space-y-3">
                  <GoogleMap 
                    location={person.last_seen_location} 
                    className="aspect-video relative"
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{person.last_seen_location}</p>
                    <p className="text-xs text-gray-500">Last known location</p>
                  </div>
                </div>
              </InfoBlock>
            </div>

            {/* Right Column - Reporter & Case Info */}
            <div className="lg:col-span-1 p-6 bg-gray-50 border-l border-gray-200 space-y-6">
              <InfoBlock title="Reporter Information">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reporter Name</label>
                    <p className="text-lg font-semibold text-gray-900">{report.reporter_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Relation to Missing Person</label>
                    <p className="text-gray-900 font-medium">{report.reporter_relation}</p>
                  </div>
                  {report.reporter_contact && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Number</label>
                      <p className="text-gray-900">{report.reporter_contact}</p>
                    </div>
                  )}
                  {report.reporter_whatsapp && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                      <p className="text-gray-900">{report.reporter_whatsapp}</p>
                    </div>
                  )}
                  {report.reporter_email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <p className="text-gray-900">{report.reporter_email}</p>
                    </div>
                  )}
                  {report.reporter_address && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <p className="text-gray-900">{report.reporter_address}</p>
                    </div>
                  )}
                </div>
              </InfoBlock>

              <InfoBlock title="Case Management">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">Current Status</label>
                      <span className={`flex items-center gap-1.5 ${style.pill} px-2.5 py-1 text-xs font-bold rounded-full`}>
                        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                        {report.cases.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Case ID:</span>
                        <span className="font-mono font-bold text-black">#{report.case_id.toString().padStart(5, '0')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Report ID:</span>
                        <span className="font-mono font-bold text-black">#{report.id.toString().padStart(5, '0')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Person ID:</span>
                        <span className="font-mono font-bold text-black">#{person.id.toString().padStart(5, '0')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Case Created</label>
                    <p className="text-gray-900">{formatDate(report.cases.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Report Submitted</label>
                    <p className="text-gray-900">{formatDate(report.created_at)}</p>
                  </div>
                  {report.cases.contact_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Primary Contact</label>
                      <p className="text-gray-900">{report.cases.contact_name}</p>
                      {report.cases.contact_role && (
                        <p className="text-sm text-gray-600">{report.cases.contact_role}</p>
                      )}
                    </div>
                  )}
                </div>
              </InfoBlock>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                  <ShareIcon className="w-4 h-4" />
                  Share Case Details
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <PlusIcon className="w-4 h-4" />
                  Report Sighting
                </button>
              </div>
            </div>
          </div>
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

const ViewReportsPage: React.FC<ViewReportsPageProps> = ({ onClose }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/reports' 
          : 'http://localhost:4000/api/reports';
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        setReports(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching reports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredAndSortedReports = React.useMemo(() => {
    let filtered = [...reports];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(report => report.cases.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(report =>
        report.cases.persons.name.toLowerCase().includes(lowercasedQuery) ||
        report.reporter_name.toLowerCase().includes(lowercasedQuery) ||
        report.cases.persons.last_seen_location.toLowerCase().includes(lowercasedQuery) ||
        report.case_id.toString().includes(lowercasedQuery)
      );
    }

    // Sort reports
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [reports, searchQuery, filterStatus, sortBy]);

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
  };

  const SelectControl: React.FC<{ 
    id: string; 
    label: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
    children: React.ReactNode 
  }> = ({ id, label, value, onChange, children }) => (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="appearance-none w-full bg-gray-100 border-2 border-transparent text-gray-800 font-medium pl-4 pr-10 py-3 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
      >
        {children}
      </select>
      <ChevronIcon className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative bg-white w-full max-w-7xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="w-16 h-px bg-gray-300 mb-4"></div>
                <h1 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tighter leading-tight">Missing Person Reports</h1>
                <p className="text-xl text-gray-600 mt-3">
                  Comprehensive view of all submitted missing person reports with complete details and case management.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-200"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-auto flex items-center gap-4">
                <SelectControl 
                  id="filter-status" 
                  label="Filter by status" 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Active Search">Active Search</option>
                  <option value="New">New</option>
                  <option value="Closed">Closed</option>
                </SelectControl>
                <SelectControl 
                  id="sort-by" 
                  label="Sort by" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </SelectControl>
              </div>
              <div className="relative w-full md:ml-auto md:max-w-xs">
                <label htmlFor="search" className="sr-only">Search reports</label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search name, reporter, case ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border-2 border-transparent text-gray-800 font-medium pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-800">Loading Reports...</h3>
                <p className="text-gray-600 mt-3">Fetching all missing person reports.</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 px-8 bg-red-50 rounded-2xl border border-red-200">
                <h3 className="text-2xl font-bold text-red-800">Error Loading Reports</h3>
                <p className="text-red-700 mt-3 max-w-md mx-auto">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white font-medium px-6 py-3 rounded-full text-base hover:bg-red-700 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            ) : filteredAndSortedReports.length === 0 ? (
              <div className="text-center py-20 px-8 bg-gray-50 rounded-2xl border border-gray-200">
                <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">
                  {reports.length === 0 ? 'No Reports Submitted' : 'No Reports Match Your Search'}
                </h3>
                <p className="text-gray-600 mt-3 max-w-md mx-auto">
                  {reports.length === 0 
                    ? 'No missing person reports have been submitted yet. Reports will appear here once submitted through the Find Now form.'
                    : 'Try adjusting your search terms or filters to find the reports you\'re looking for.'
                  }
                </p>
                {reports.length > 0 && (
                  <button
                    onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                    className="mt-6 bg-black text-white font-medium px-6 py-3 rounded-full text-base hover:bg-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    {filteredAndSortedReports.length} report{filteredAndSortedReports.length !== 1 ? 's' : ''} found
                    {reports.length !== filteredAndSortedReports.length && ` (${reports.length} total)`}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {filteredAndSortedReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

export default ViewReportsPage;
