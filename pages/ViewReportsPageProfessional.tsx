import React, { useState, useEffect } from 'react';
import CloseIcon from '../components/icons/CloseIcon';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import UserIcon from '../components/icons/UserIcon';
import MapPinIcon from '../components/icons/MapPinIcon';
import ShareIcon from '../components/icons/ShareIcon';

// Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

// Check if Google Maps API is available
const isGoogleMapsAvailable = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY';

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
        created_at: string;
      }>;
    };
  };
}

interface ViewReportsPageProps {
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const getStatusColor = (status: string) => {
  const colors = {
    'High Priority': 'bg-red-500 text-white',
    'Active Search': 'bg-blue-500 text-white',
    'New': 'bg-green-500 text-white',
    'Closed': 'bg-gray-500 text-white'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500 text-white';
};

const getPriorityBadge = (status: string, createdAt: string) => {
  const isUrgent = status === 'High Priority';
  const isRecent = (new Date().getTime() - new Date(createdAt).getTime()) < (24 * 60 * 60 * 1000);
  
  if (isUrgent) return { text: 'URGENT', color: 'bg-red-600 text-white animate-pulse' };
  if (isRecent) return { text: 'NEW', color: 'bg-green-600 text-white' };
  return null;
};

// Google Maps Static API integration
const getMapUrl = (location: string, size: string = '600x400') => {
  if (!location) return null;
  const encodedLocation = encodeURIComponent(location);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=14&size=${size}&maptype=roadmap&markers=color:red%7C${encodedLocation}&key=${GOOGLE_MAPS_API_KEY}`;
};

// Heatmap placeholder - would integrate with actual heatmap service
const getHeatmapUrl = (location: string, caseId: number) => {
  return `https://via.placeholder.com/600x400/ff6b6b/ffffff?text=AI+Heatmap+Analysis+for+Case+${caseId}`;
};

const ReportCard: React.FC<{ report: Report; onViewDetail: (report: Report) => void }> = ({ report, onViewDetail }) => {
  const person = report.cases.persons;
  const mainPhoto = person.photos[0]?.image_url || `https://via.placeholder.com/120x120/e5e7eb/6b7280?text=${person.name.charAt(0)}`;
  const priority = getPriorityBadge(report.cases.status, report.created_at);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 relative overflow-hidden">
      {priority && (
        <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full ${priority.color}`}>
          {priority.text}
        </div>
      )}
      
      <div className="flex items-start gap-6">
        <div className="relative flex-shrink-0">
          <img 
            src={mainPhoto} 
            alt={person.name}
            className="w-24 h-24 rounded-2xl object-cover shadow-lg"
          />
          <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full ${getStatusColor(report.cases.status)} flex items-center justify-center text-xs font-bold`}>
            {person.photos.length}
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{person.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">Age: {person.age}</span>
                <span>•</span>
                <span>Case #{report.case_id.toString().padStart(6, '0')}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.cases.status)}`}>
                  {report.cases.status}
                </span>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{formatRelativeTime(report.created_at)}</div>
              <div className="text-xs">{formatDate(report.created_at)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Reporter</div>
              <div className="font-semibold text-gray-900">{report.reporter_name}</div>
              <div className="text-gray-600">{report.reporter_relation}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Last Seen</div>
              <div className="font-semibold text-gray-900">{person.last_seen_date}</div>
              <div className="text-gray-600 truncate">{person.last_seen_location}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">Contact</div>
              <div className="font-semibold text-gray-900">{report.reporter_contact || 'Available'}</div>
              <div className="text-gray-600">{report.reporter_whatsapp ? 'WhatsApp Available' : 'Phone Only'}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate max-w-xs">{person.last_seen_location}</span>
            </div>
            
            <button
              onClick={() => onViewDetail(report)}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-black px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
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
  const mapUrl = getMapUrl(person.last_seen_location, '800x400');
  const heatmapUrl = getHeatmapUrl(person.last_seen_location, report.case_id);
  
  const shareReport = () => {
    const shareText = `Missing Person Alert: ${person.name}, Age ${person.age}, Last seen in ${person.last_seen_location}. Please share to help find them. Case #${report.case_id.toString().padStart(6, '0')}`;
    if (navigator.share) {
      navigator.share({
        title: `Help Find ${person.name}`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Report details copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-7xl max-h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Missing Person Report</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-300">
              <span>Case ID: #{report.case_id.toString().padStart(6, '0')}</span>
              <span>•</span>
              <span>Report ID: #{report.id.toString().padStart(4, '0')}</span>
              <span>•</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.cases.status)}`}>
                {report.cases.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={shareReport}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Share Report"
            >
              <ShareIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Close"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3">
            {/* Main Content */}
            <div className="xl:col-span-2 p-8 space-y-8">
              {/* Missing Person Details */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <UserIcon className="w-6 h-6 mr-3 text-blue-500" />
                  Missing Person Information
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {person.photos.map((photo, index) => (
                        <img
                          key={photo.id}
                          src={photo.image_url}
                          alt={`${person.name} photo ${index + 1}`}
                          className="w-32 h-32 rounded-xl object-cover shadow-lg hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(photo.image_url, '_blank')}
                        />
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Full Name</label>
                        <p className="text-xl font-bold text-gray-900 mt-1">{person.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Age</label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">{person.age} years</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Report Date</label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">{formatDate(report.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Physical Description</label>
                      <p className="text-gray-900 mt-2 leading-relaxed">{person.description}</p>
                    </div>
                    
                    {report.missing_person_identification && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Identification Details</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{report.missing_person_identification}</p>
                      </div>
                    )}
                    
                    {report.missing_person_social_media && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Social Media Information</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{report.missing_person_social_media}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Location & Timeline */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPinIcon className="w-6 h-6 mr-3 text-red-500" />
                  Last Known Location & Timeline
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Last Seen Location</label>
                      <p className="text-xl font-bold text-gray-900 mt-1">{person.last_seen_location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Last Seen Date & Time</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{person.last_seen_date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Days Missing</label>
                      <p className="text-lg font-semibold text-red-600 mt-1">
                        {Math.floor((new Date().getTime() - new Date(person.last_seen_date).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    {mapUrl ? (
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Location Map</label>
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={mapUrl} 
                            alt={`Map of ${person.last_seen_location}`}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x400/e5e7eb/6b7280?text=Map+of+${encodeURIComponent(person.last_seen_location)}`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Last Seen Here
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-xl p-8 text-center">
                        <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Map not available</p>
                        <p className="text-sm text-gray-500 mt-1">Please add Google Maps API key</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Reporter Information */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reporter Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Reporter Name</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{report.reporter_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Relationship</label>
                      <p className="text-gray-900 mt-1">{report.reporter_relation}</p>
                    </div>
                    {report.reporter_address && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Address</label>
                        <p className="text-gray-900 mt-1">{report.reporter_address}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {report.reporter_contact && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Contact Number</label>
                        <p className="text-gray-900 mt-1 font-mono">{report.reporter_contact}</p>
                      </div>
                    )}
                    {report.reporter_whatsapp && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">WhatsApp</label>
                        <p className="text-gray-900 mt-1 font-mono">{report.reporter_whatsapp}</p>
                      </div>
                    )}
                    {report.reporter_email && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Email</label>
                        <p className="text-gray-900 mt-1">{report.reporter_email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 bg-gray-50 p-8 space-y-8">
              {/* Case Status */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Case Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.cases.status)}`}>
                      {report.cases.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Days Active</span>
                    <span className="font-semibold text-gray-900">
                      {Math.floor((new Date().getTime() - new Date(report.cases.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Case Officer</span>
                    <span className="font-semibold text-gray-900">{report.cases.contact_name || 'Assigned'}</span>
                  </div>
                </div>
              </section>

              {/* AI Heatmap */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI Probability Analysis</h3>
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img 
                      src={heatmapUrl} 
                      alt="AI Heatmap Analysis"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-semibold">AI-Generated Heatmap</p>
                      <p className="text-xs opacity-90">Likelihood prediction zones</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>AI analysis shows high probability areas based on:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Last known location patterns</li>
                      <li>Similar case outcomes</li>
                      <li>Geographic movement data</li>
                      <li>Time-based probability factors</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors">
                    Report Sighting
                  </button>
                  <button 
                    onClick={shareReport}
                    className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-600 transition-colors"
                  >
                    Share Report
                  </button>
                  <button className="w-full bg-gray-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors">
                    Contact Reporter
                  </button>
                </div>
              </section>

              {/* Report Timeline */}
              <section className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Report Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Report Submitted</p>
                      <p className="text-sm text-gray-600">{formatDate(report.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Case Created</p>
                      <p className="text-sm text-gray-600">{formatDate(report.cases.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Status: {report.cases.status}</p>
                      <p className="text-sm text-gray-600">Active investigation</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewReportsPage: React.FC<ViewReportsPageProps> = ({ onClose }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

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

  const filteredAndSortedReports = reports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.cases.persons.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.cases.persons.last_seen_location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.cases.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'priority':
        const priorityOrder = { 'High Priority': 3, 'Active Search': 2, 'New': 1, 'Closed': 0 };
        return (priorityOrder[b.cases.status as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.cases.status as keyof typeof priorityOrder] || 0);
      default:
        return 0;
    }
  });

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative bg-gray-50 w-full max-w-[95vw] max-h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">Missing Person Reports</h1>
              <p className="text-gray-300 mt-2">Comprehensive view of all submitted reports</p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Close"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <input
                  type="text"
                  placeholder="Search by name, reporter, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 lg:w-80 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Active Search">Active Search</option>
                  <option value="New">New</option>
                  <option value="Closed">Closed</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">By Priority</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">
                  {filteredAndSortedReports.length} report{filteredAndSortedReports.length !== 1 ? 's' : ''} found
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>High Priority</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full ml-3"></div>
                  <span>Active</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full ml-3"></div>
                  <span>New</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-2xl font-bold text-gray-800">Loading Reports...</h3>
                <p className="text-gray-600 mt-3">Please wait while we fetch the latest data.</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 px-8 bg-red-50 rounded-2xl border border-red-200 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CloseIcon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-red-800">Error Loading Reports</h3>
                <p className="text-red-700 mt-3">{error}</p>
                <p className="text-sm text-gray-600 mt-2">Please ensure the backend server is running on port 4000</p>
              </div>
            ) : filteredAndSortedReports.length === 0 ? (
              <div className="text-center py-20 px-8 bg-gray-100 rounded-2xl max-w-2xl mx-auto">
                <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">No Reports Found</h3>
                <p className="text-gray-600 mt-3 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No reports match your current filters. Try adjusting your search criteria.'
                    : 'No missing person reports have been submitted yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAndSortedReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onViewDetail={handleViewDetail}
                  />
                ))}
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
