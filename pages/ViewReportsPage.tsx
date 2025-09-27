import React, { useState, useEffect } from 'react';
import CloseIcon from '../components/icons/CloseIcon';
import MapPinIcon from '../components/icons/MapPinIcon';
import UserIcon from '../components/icons/UserIcon';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import ShareIcon from '../components/icons/ShareIcon';
import StarIcon from '../components/icons/StarIcon';

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
    persons: {
      id: number;
      name: string;
      age: number;
      description: string;
      last_seen_location: string;
      last_seen_date: string;
      photos: Array<{
        id: number;
        image_url: string;
      }>;
    };
  };
}

interface ViewReportsPageProps {
  onClose: () => void;
}

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusStyles: Record<string, string> = {
  'High Priority': 'bg-red-100 text-red-800 border-red-200',
  'Active Search': 'bg-blue-100 text-blue-800 border-blue-200',
  'New': 'bg-green-100 text-green-800 border-green-200',
  'Closed': 'bg-gray-100 text-gray-800 border-gray-200',
};

const getGoogleMapEmbedUrl = (location: string) => {
  // For now, use a basic embedded map until you provide the API key
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890123!2d-74.0059413!3d40.7589181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(location)}!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;
};

const ViewReportsPage: React.FC<ViewReportsPageProps> = ({ onClose }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/reports' 
          : 'http://localhost:4000/api/reports';
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch reports');
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

  // Modern Report Card Component
  const ReportCard: React.FC<{ report: Report; onClick: () => void }> = ({ report, onClick }) => {
    const person = report.cases?.persons;
    const mainPhoto = person?.photos?.[0]?.image_url || '/api/placeholder/300/300';
    
    return (
      <div className="group bg-white/50 backdrop-blur-md border border-black/10 rounded-3xl overflow-hidden hover:bg-white/70 hover:shadow-xl hover:border-black/20 transition-all duration-500 cursor-pointer"
           onClick={onClick}>
        
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={mainPhoto} 
            alt={person?.name || 'Missing person'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Floating Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-sm ${statusStyles[report.cases?.status] || 'bg-gray-100/90 text-gray-800'}`}>
              {report.cases?.status}
            </span>
          </div>
          
          {/* Case ID */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 text-xs font-mono bg-black/30 backdrop-blur-sm text-white rounded-full">
              #{report.case_id?.toString().padStart(5, '0')}
            </span>
          </div>
          
          {/* Bottom Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
              {person?.name || 'Unknown Person'}
            </h3>
            <p className="text-white/80 text-sm">
              {person?.age} years • {person?.last_seen_date}
            </p>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-5">
          {/* Location */}
          <div className="flex items-start gap-2 mb-4">
            <MapPinIcon className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {person?.last_seen_location}
              </p>
              <p className="text-xs text-gray-600">Last known location</p>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-700 line-clamp-2 mb-4 leading-relaxed">
            {person?.description}
          </p>
          
          {/* Reporter Info */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
            <UserIcon className="w-4 h-4 text-gray-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Reported by</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {report.reporter_name} • {report.reporter_relation}
              </p>
            </div>
          </div>
          
          {/* Contact Details Preview */}
          <div className="space-y-2 mb-4">
            {report.reporter_contact && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Phone: {report.reporter_contact}
              </div>
            )}
            {report.reporter_email && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Email: {report.reporter_email}
              </div>
            )}
            {report.reporter_whatsapp && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                WhatsApp: {report.reporter_whatsapp}
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {formatDate(report.created_at)}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-black group-hover:text-gray-800 transition-colors">
              <span>View Details</span>
              <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Comprehensive Report Detail Modal
  const ReportDetailModal: React.FC<{ report: Report; onClose: () => void }> = ({ report, onClose }) => {
    const person = report.cases?.persons;
    
    return (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" 
        onClick={onClose}
      >
        <div 
          className="relative bg-white/95 backdrop-blur-xl w-full max-w-7xl max-h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-black/10 my-8" 
          onClick={e => e.stopPropagation()}
        >
          {/* Premium Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
            <div className="p-6 lg:p-8">
              <div className="flex justify-between items-start">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-px bg-white/30"></div>
                    <span className={`px-4 py-2 text-xs font-bold rounded-full ${statusStyles[report.cases?.status] || 'bg-gray-100 text-gray-800'}`}>
                      {report.cases?.status}
                    </span>
                    <span className="px-4 py-2 text-xs font-mono bg-white/10 backdrop-blur-sm text-white rounded-full">
                      Case #{report.case_id?.toString().padStart(5, '0')}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-tight mb-3">
                    {person?.name || 'Missing Person Report'}
                  </h1>
                  <p className="text-lg text-white/80">
                    Complete case details with AI analysis and location mapping
                  </p>
                  <div className="flex items-center gap-6 mt-4 text-sm text-white/60">
                    <span>Submitted: {formatDate(report.created_at)}</span>
                    <span>•</span>
                    <span>Reporter: {report.reporter_name}</span>
                    <span>•</span>
                    <span>Relation: {report.reporter_relation}</span>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-grow overflow-y-auto">
            <div className="p-6 lg:p-8 space-y-8">
              
              {/* Hero Photos Section */}
              <div className="bg-white/50 backdrop-blur-md border border-black/10 rounded-3xl p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Personal Photos</h2>
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">AI Enhanced</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {person?.photos?.length > 0 ? (
                    person.photos.map((photo, idx) => (
                      <div key={photo.id || idx} className="group relative aspect-square">
                        <img 
                          src={photo.image_url} 
                          alt={`${person.name} - Photo ${idx + 1}`} 
                          className="w-full h-full rounded-2xl object-cover border border-gray-200 group-hover:shadow-lg transition-all duration-300" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors" />
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2">
                            <p className="text-white text-xs font-medium">Photo {idx + 1}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <div className="bg-gray-100 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-600 font-medium">No photos uploaded</p>
                        <p className="text-gray-400 text-sm mt-1">Photos help with identification</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comprehensive Information Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Column 1: Personal Details */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">{person?.name || 'Not specified'}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Age</p>
                        <p className="text-lg font-semibold text-gray-900">{person?.age} years old</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Physical Description</p>
                        <div className="text-sm text-gray-900 leading-relaxed space-y-2">
                          {person?.description && (
                            <p><strong>Appearance & Clothing:</strong> {person.description}</p>
                          )}
                          {report.missing_person_identification && (
                            <p><strong>Identifying Features:</strong> {report.missing_person_identification}</p>
                          )}
                          {!person?.description && !report.missing_person_identification && (
                            <p className="text-gray-500 italic">No physical description provided</p>
                          )}
                        </div>
                      </div>
                      {report.missing_person_identification && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Identification Details</p>
                          <p className="text-sm text-gray-900 leading-relaxed">{report.missing_person_identification}</p>
                        </div>
                      )}
                      {report.missing_person_social_media && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Social Media Profiles</p>
                          <p className="text-sm text-gray-900 leading-relaxed">{report.missing_person_social_media}</p>
                        </div>
                      )}
                      
                      {/* Additional Details Section */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Complete Case Summary</p>
                        <div className="text-sm text-gray-900 leading-relaxed space-y-1">
                          <p><strong>{person?.name}</strong>, {person?.age} years old, was last seen on <strong>{person?.last_seen_date}</strong> at <strong>{person?.last_seen_location}</strong>.</p>
                          {person?.description && (
                            <p>They were {person.description.toLowerCase()}.</p>
                          )}
                          {report.missing_person_identification && (
                            <p>Notable identifying features: {report.missing_person_identification}.</p>
                          )}
                          <p>This report was filed by <strong>{report.reporter_name}</strong> ({report.reporter_relation}) on {formatDate(report.created_at)}.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case Status & Timeline */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Case Status</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Current Status</p>
                        <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${statusStyles[report.cases?.status] || 'bg-gray-100 text-gray-800'}`}>
                          {report.cases?.status}
                        </span>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Reported By Organization</p>
                        <p className="text-sm font-medium text-gray-900">{report.cases?.reported_by || 'Individual Report'}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Contact Person</p>
                        <p className="text-sm font-medium text-gray-900">{report.cases?.contact_name || 'N/A'}</p>
                        {report.cases?.contact_role && (
                          <p className="text-xs text-gray-600 mt-1">{report.cases.contact_role}</p>
                        )}
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Case Created</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(report.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Reporter & Contact Information */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Reporter Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Reporter Name</p>
                        <p className="text-lg font-semibold text-gray-900">{report.reporter_name}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Relationship</p>
                        <p className="text-sm font-medium text-gray-900">{report.reporter_relation}</p>
                      </div>
                      {report.reporter_contact && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">Primary Phone</p>
                          </div>
                          <p className="text-sm font-mono text-gray-900">{report.reporter_contact}</p>
                        </div>
                      )}
                      {report.reporter_whatsapp && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                            </svg>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">WhatsApp</p>
                          </div>
                          <p className="text-sm font-mono text-gray-900">{report.reporter_whatsapp}</p>
                        </div>
                      )}
                      {report.reporter_email && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">Email Address</p>
                          </div>
                          <p className="text-sm font-mono text-gray-900">{report.reporter_email}</p>
                        </div>
                      )}
                      {report.reporter_address && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Address</p>
                          <p className="text-sm text-gray-900 leading-relaxed">{report.reporter_address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 3: Location & Analysis */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Last Known Location</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Location</p>
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">{person?.last_seen_location || 'Not specified'}</p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Date & Time</p>
                        <p className="text-sm font-medium text-gray-900">{person?.last_seen_date || 'Not specified'}</p>
                      </div>
                      {person?.last_seen_location && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden">
                          <iframe
                            title={`Map of ${person.last_seen_location}`}
                            width="100%"
                            height="200"
                            className="rounded-2xl"
                            loading="lazy"
                            allowFullScreen
                            src={getGoogleMapEmbedUrl(person.last_seen_location)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Heatmap Analysis */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">AI Heatmap Analysis</h3>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden">
                      <img 
                        src={`/heatmap/${report.case_id || 'placeholder'}.jpg`}
                        alt="AI Generated Heatmap" 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iaGVhdG1hcCIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI0MCUiIHN0b3AtY29sb3I9IiNmZmZmMDAiIHN0b3Atb3BhY2l0eT0iMC42Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iODAlIiBzdG9wLWNvbG9yPSIjMDBmZjAwIiBzdG9wLW9wYWNpdHk9IjAuNCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMGZmZmYiIHN0b3Atb3BhY2l0eT0iMC4yIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9InVybCgjaGVhdG1hcCkiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QUkgSGVhdG1hcCBBbmFseXNpczwvdGV4dD4KPC9zdmc+';
                        }}
                      />
                      <div className="p-4">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          AI-generated probability heatmap showing potential locations based on behavioral patterns, 
                          movement history, and environmental factors from the last known location.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-white/50 backdrop-blur-md border border-black/10 rounded-3xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Share This Report</h3>
                    <p className="text-gray-600 text-sm">Help spread awareness to find {person?.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                      <ShareIcon className="w-4 h-4" />
                      Share Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" 
        onClick={onClose}
      >
        <div 
          className="relative bg-white/95 backdrop-blur-xl w-full max-w-7xl max-h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-black/10" 
          onClick={e => e.stopPropagation()}
        >
          {/* Modern Header with gradient background */}
          <div className="flex-shrink-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 lg:p-8">
            <div className="flex justify-between items-start">
              <div className="max-w-4xl">
                <div className="w-16 h-px bg-white/30 mb-4"></div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-tight">
                  Missing Person Reports Overview
                </h1>
                <p className="text-lg md:text-xl text-white/80 mt-3 max-w-2xl">
                  Comprehensive overview of all submitted reports with AI analysis, maps, and detailed information
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Content with modern styling */}
          <div className="flex-grow overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-20 px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Reports</h3>
                <p className="text-gray-600">Fetching all report details and analysis...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 px-6">
                <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-3xl p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-red-800 mb-3">Connection Error</h3>
                  <p className="text-red-700 mb-2">{error}</p>
                  <p className="text-sm text-gray-600">Please ensure the backend server is running on localhost:4000</p>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <UserIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">No Reports Yet</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    No missing person reports have been submitted. When families use the "Find Now" feature, 
                    their detailed reports will appear here with full analysis and maps.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 lg:p-8">
                {/* Stats Header */}
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {reports.length} Active Report{reports.length !== 1 ? 's' : ''}
                      </h2>
                      <p className="text-gray-600 mt-1">All submitted cases with complete details and AI analysis</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Live Data
                      </div>
                      <span>Updated: {new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Modern Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {reports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onClick={() => setSelectedReport(report)}
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
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
};

export default ViewReportsPage;
