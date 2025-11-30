import React, { useState, useEffect } from 'react';
import { supabase } from '../src/services/supabase.frontend.service';
import { 
  Search, 
  Users, 
  MessageSquare, 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Filter, 
  MoreHorizontal,
  FileText,
  Download,
  Eye,
  Shield,
  AlertCircle,
  Calendar
} from 'lucide-react';

const App = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sightings_map');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from('cases')
          .select(`
            *,
            persons (
              *,
              photos (*)
            )
          `)
          .neq('status', 'Closed')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching cases:', error);
        } else {
          const casesData = (data || []) as any[];
          setCases(casesData);
          if (casesData.length > 0) {
            // Only set if not already set (or maybe always set to first if we want to reset on refresh? No, keep selection if possible, but here we just init)
             setSelectedCaseId((prev) => prev || casesData[0].id);
          }
        }
      } catch (err) {
        console.error('Exception fetching cases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
    
    const subscription = supabase
      .channel('cases_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, () => {
        fetchCases();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  
  const activeReport = activeCase ? {
    id: activeCase.id,
    name: activeCase.persons?.name || 'Unknown',
    reporter: activeCase.reported_by || 'Anonymous',
    age: activeCase.persons?.age || '?',
    height: 'N/A',
    lastSeen: activeCase.persons?.last_seen_location || 'Unknown',
    status: activeCase.status || 'Active',
    temperature: 'High Urgency',
    image: activeCase.persons?.photos?.[0]?.image_url || 'https://via.placeholder.com/150'
  } : null;

  // Content Switcher Logic
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CaseDetailsView caseData={activeCase} />;
      case 'sightings_map':
        return <SightingsMapView />;
      case 'timeline':
        return <TimelineView />;
      case 'documents':
        return <DocumentsView />;
      default:
        return <div className="p-10 text-center text-slate-400">View Coming Soon</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F2F4F8] font-sans text-slate-600 relative">
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col pt-24 px-4 md:px-8 h-full min-h-screen">
        
        <div className="flex-1 flex flex-col relative max-w-7xl mx-auto w-full">
            
            {/* 1. TABS ROW (Standardized Style) */}
            <div className="flex items-end pl-4 space-x-[-20px] overflow-x-auto no-scrollbar pt-4">
                {loading ? (
                  <div className="p-4 text-slate-400 text-sm">Loading...</div>
                ) : cases.length === 0 ? (
                  <div className="p-4 text-slate-400 text-sm">No active cases</div>
                ) : (
                  cases.map((c) => (
                    <TabItem 
                        key={c.id}
                        name={c.persons?.name || 'Unknown'} 
                        id={`ID: ${String(c.id).slice(0, 6)}`} 
                        date={new Date(c.created_at).toLocaleDateString()}
                        active={selectedCaseId === c.id}
                        onClick={() => setSelectedCaseId(c.id)}
                    />
                  ))
                )}
            </div>

            {/* MAIN CARD CONTAINER */}
            {!activeReport ? (
               <div className="bg-white/90 backdrop-blur-xl rounded-[40px] shadow-sm flex-1 flex items-center justify-center p-10 z-10 -mt-1 border border-white/50 min-h-[600px] mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">No Case Selected</h3>
                    <p className="text-slate-400 text-sm mt-2">Select a case from the tabs above to view details.</p>
                  </div>
               </div>
            ) : (
            <div className="bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] flex-1 flex flex-col p-6 md:p-10 z-10 -mt-1 border border-white/50 relative min-h-[600px] mb-8">
                
                {/* Background decorative blob */}
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="flex-shrink-0">
                    {/* Back Button */}
                    <div className="flex items-center text-slate-400 text-sm mb-6 cursor-pointer hover:text-slate-700 transition w-max group">
                        <div className="p-1 rounded-full group-hover:bg-slate-100 mr-2 transition-colors">
                            <ChevronLeft size={18} />
                        </div>
                        Back to Patients
                    </div>

                    {/* PROFILE HEADER SECTION */}
                    <div className="flex flex-col md:flex-row items-start justify-between mb-10">
                        <div className="flex items-center">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-[6px] border-[#F2F4F8] shadow-sm mr-6">
                                    <img src={activeReport.image} alt="Missing Person" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute bottom-1 right-6 w-5 h-5 bg-red-500 border-4 border-white rounded-full"></div>
                            </div>
                            
                            {/* Text Info */}
                            <div>
                                <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-1 tracking-tight">{activeReport.name}</h2>
                                <p className="text-slate-400 text-sm mb-4 font-medium tracking-wide">
                                    {activeReport.reporter}
                                </p>
                                
                                {/* Stats Row */}
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                    <StatBadge label="Age" value={activeReport.age} />
                                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    <StatBadge label="Height" value={activeReport.height} />
                                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    <StatBadge label="Urgency" value={activeReport.temperature} urgency />
                                </div>
                            </div>
                        </div>

                        {/* Action Button (Show Details Removed) */}
                        <div className="mt-4 md:mt-0 flex space-x-3">
                             <button className="bg-black hover:bg-slate-800 text-white p-2.5 rounded-full shadow-lg transition-all">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>

                    {/* PILL NAVIGATION */}
                    <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 no-scrollbar mask-gradient">
                        <NavPill label="Dashboard" onClick={() => setActiveTab('dashboard')} active={activeTab === 'dashboard'} />
                        <NavPill label="Sightings Map" onClick={() => setActiveTab('sightings_map')} active={activeTab === 'sightings_map'} />
                        <NavPill label="Timeline" onClick={() => setActiveTab('timeline')} active={activeTab === 'timeline'} />
                        <NavPill label="Documents" count={3} onClick={() => setActiveTab('documents')} active={activeTab === 'documents'} />
                        <NavPill label="Chat Logs" count={5} onClick={() => setActiveTab('chat')} active={activeTab === 'chat'} />
                        <NavPill label="Family Contact" onClick={() => setActiveTab('family')} active={activeTab === 'family'} />
                    </div>
                </div>

                {/* DYNAMIC CONTENT SECTION */}
                <div className="flex-1 bg-[#F9FAFC] rounded-[32px] p-6 md:p-8 overflow-hidden flex flex-col shadow-inner border border-slate-100 relative min-h-[400px]">
                   {renderContent()}
                </div>

            </div>
            )}
        </div>
      </main>
      
      {/* Global Style for scrollbar hiding & animations */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E2E8F0; border-radius: 20px; }
        
        @keyframes pulse-ring {
            0% { transform: scale(0.33); }
            80%, 100% { opacity: 0; }
        }
        .marker-ring {
            animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
      `}</style>
    </div>
  );
};

// --- VIEW COMPONENTS ---

// 4. SIGHTINGS MAP UI
const SightingsMapView = () => {
    const markers = [
       { id: 1, x: 20, y: 30, type: 'cctv', label: 'CCTV Match 85%' },
       { id: 2, x: 55, y: 45, type: 'user', label: 'Witness Report' },
       { id: 3, x: 70, y: 20, type: 'credit', label: 'Credit Card Usage' },
   ];

   return (
       <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-200 group min-h-[400px]">
           {/* Mock Map Background */}
           <img 
               src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
               className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
               alt="Map Visualization" 
           />
           
           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>

           {/* Controls */}
           <div className="absolute top-4 right-4 flex flex-col gap-2">
               <button className="bg-white p-2 rounded-lg shadow-md text-slate-600 hover:bg-slate-50"><Filter size={18}/></button>
               <button className="bg-white p-2 rounded-lg shadow-md text-slate-600 hover:bg-slate-50"><MapPin size={18}/></button>
           </div>

           {/* Markers */}
           {markers.map(m => (
               <div key={m.id} className="absolute cursor-pointer group/marker" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
                   <div className="relative">
                       {/* Pulse Ring */}
                       <div className="absolute -inset-4 bg-red-400/30 rounded-full marker-ring"></div>
                       {/* Pin */}
                       <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:-translate-y-1 ${m.type === 'cctv' ? 'bg-blue-500' : m.type === 'user' ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                           {m.type === 'cctv' && <Eye size={14} />}
                           {m.type === 'user' && <Users size={14} />}
                           {m.type === 'credit' && <FileText size={14} />}
                       </div>
                       {/* Tooltip */}
                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity">
                           {m.label}
                       </div>
                   </div>
               </div>
           ))}

           {/* Floating Info Card */}
           <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg border border-slate-100">
               <div className="flex items-start justify-between">
                   <div>
                       <h4 className="text-sm font-bold text-slate-800">Last Verified Location</h4>
                       <p className="text-xs text-slate-500 mt-1">North Ave. ATM • 24 mins ago</p>
                   </div>
                   <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">LIVE</span>
               </div>
               <div className="mt-3 flex items-center gap-2">
                    <div className="h-10 w-16 bg-slate-200 rounded-lg overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=60" className="w-full h-full object-cover" alt="cctv" />
                    </div>
                    <div className="text-xs text-slate-600">
                       <span>Matched with 85% confidence via </span>
                       <span className="font-semibold text-blue-500">CityCam Net</span>
                    </div>
               </div>
           </div>
       </div>
   );
};

// 5. TIMELINE UI
const TimelineView = () => {
   const events = [
       { id: 1, title: "Sighted at North Ave", time: "10:30 AM, Today", type: "sighting", icon: <Eye size={16}/>, color: "bg-blue-100 text-blue-600" },
       { id: 2, title: "Police Report Filed", time: "09:00 AM, Today", type: "admin", icon: <Shield size={16}/>, color: "bg-slate-100 text-slate-600" },
       { id: 3, title: "Credit Card Activity", time: "08:45 PM, Yesterday", type: "alert", icon: <AlertCircle size={16}/>, color: "bg-orange-100 text-orange-600" },
       { id: 4, title: "Reported Missing", time: "06:00 PM, Yesterday", type: "report", icon: <Phone size={16}/>, color: "bg-red-100 text-red-600" },
   ];

   return (
       <div className="h-full overflow-y-auto custom-scrollbar px-2">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-semibold text-slate-800">Case Timeline</h3>
               <button className="text-xs font-medium text-blue-500 hover:text-blue-600">Download Log</button>
           </div>
           <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 pb-8">
               {events.map((event, idx) => (
                   <div key={event.id} className="relative pl-6 group">
                       {/* Dot on line */}
                       <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${event.type === 'sighting' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                       
                       {/* Content Card */}
                       <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start">
                               <div className="flex items-center gap-3">
                                   <div className={`p-2 rounded-lg ${event.color}`}>
                                       {event.icon}
                                   </div>
                                   <div>
                                       <h4 className="text-sm font-semibold text-slate-800">{event.title}</h4>
                                       <span className="text-xs text-slate-400">{event.time}</span>
                                   </div>
                               </div>
                               <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={16}/></button>
                           </div>
                           {event.type === 'sighting' && (
                               <div className="mt-3 bg-slate-50 p-2 rounded-lg text-xs text-slate-600 border border-slate-100">
                                   Camera ID: <span className="font-mono">CAM-04</span> • Confidence: <span className="font-bold text-green-600">High</span>
                               </div>
                           )}
                       </div>
                   </div>
               ))}
           </div>
       </div>
   );
};

// 6. DOCUMENTS UI
const DocumentsView = () => {
    const docs = [
       { id: 1, name: "Police_Report_Initial.pdf", size: "2.4 MB", date: "Aug 04, 2025" },
       { id: 2, name: "CCTV_Snapshots_v2.zip", size: "145 MB", date: "Aug 04, 2025" },
       { id: 3, name: "Witness_Statement_01.docx", size: "24 KB", date: "Aug 03, 2025" },
       { id: 4, name: "Missing_Person_Poster.pdf", size: "1.1 MB", date: "Aug 03, 2025" },
   ];

   return (
       <div className="h-full">
           <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-semibold text-slate-800">Case Files</h3>
               <button className="flex items-center gap-2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg hover:bg-black transition">
                   <Download size={14}/> Upload New
               </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {docs.map(doc => (
                   <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-100 hover:shadow-md transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                           <div className="p-3 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                               <FileText size={20} />
                           </div>
                           <div>
                               <h4 className="text-sm font-semibold text-slate-700 truncate max-w-[150px] md:max-w-[200px]">{doc.name}</h4>
                               <p className="text-[10px] text-slate-400">{doc.date} • {doc.size}</p>
                           </div>
                       </div>
                       <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition">
                           <Download size={16} />
                       </button>
                   </div>
               ))}
           </div>
       </div>
   );
};

// Case Details View (Replaces SightingsTableView)
const CaseDetailsView = ({ caseData }: { caseData: any }) => {
    if (!caseData) return null;
    const person = caseData.persons;
    
    return (
        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Case Details</h3>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Physical Description</h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {person?.description || "No description provided."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Last Seen Details</h4>
                    <div className="space-y-3">
                        <div className="flex items-start">
                            <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                            <div>
                                <span className="block text-sm font-medium text-slate-700">Location</span>
                                <span className="text-sm text-slate-500">{person?.last_seen_location || "Unknown"}</span>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Clock className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                            <div>
                                <span className="block text-sm font-medium text-slate-700">Date & Time</span>
                                <span className="text-sm text-slate-500">{person?.last_seen_date || "Unknown"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Reporter Information</h4>
                    <div className="space-y-3">
                        <div className="flex items-start">
                            <Users className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                            <div>
                                <span className="block text-sm font-medium text-slate-700">Reported By</span>
                                <span className="text-sm text-slate-500">{caseData.reported_by || "Anonymous"}</span>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Shield className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                            <div>
                                <span className="block text-sm font-medium text-slate-700">Status</span>
                                <span className="text-sm text-slate-500">{caseData.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

const TabItem = ({ name, id, date, active, onClick }: any) => (
    <div onClick={onClick} className={`
        relative rounded-t-[30px] cursor-pointer transition-all group select-none
        px-10 min-w-[220px]
        ${active ? 'py-4 z-20' : 'py-3.5 mt-2 z-10 hover:-translate-y-1'}
    `}>
        {/* Background Shapes to create the folder effect */}
        <div className={`absolute inset-0 rounded-t-[30px] transition-colors ${active ? 'bg-white/90 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]' : 'bg-[#E3E8EF] group-hover:bg-[#DDE3EB]'}`}></div>
        
        {/* Content */}
        <div className="relative flex flex-col items-start justify-center h-full z-20">
            <div className="flex justify-between w-full items-center">
                <span className={`text-sm font-semibold tracking-tight ${active ? 'text-slate-800' : 'text-slate-400'}`}>
                    {name}
                </span>
                {date && <span className="text-[10px] text-slate-400 ml-2">{date}</span>}
            </div>
            <span className={`text-[10px] font-medium mt-0.5 ${active ? 'text-slate-400' : 'text-slate-400/70'}`}>{id}</span>
        </div>

        {/* The "Mask" to blend the active tab into the white card below */}
        {active && (
            <div className="absolute bottom-[-20px] left-0 right-0 h-10 bg-white/90 z-20"></div>
        )}
        
        {/* Close button on active tab */}
        {active && (
             <div className="absolute top-4 right-4 text-slate-300 hover:text-red-400 transition-colors">
                ×
             </div>
        )}
    </div>
);

const NavPill = ({ label, count, active, onClick }: { label: string, count?: number, active?: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`
        px-5 py-2.5 rounded-full text-sm whitespace-nowrap transition-all border
        ${active 
            ? 'bg-white border-slate-200 shadow-sm text-slate-800 font-semibold ring-2 ring-slate-50 ring-offset-1' 
            : 'bg-transparent border-transparent text-slate-500 hover:bg-white/50 hover:text-slate-700 font-medium'}
    `}>
        {label} 
        {count && (
            <span className={`ml-2 text-[10px] font-bold py-0.5 px-2 rounded-full transition-colors ${active ? 'bg-slate-100 text-slate-600' : 'bg-slate-200/50 text-slate-500'}`}>
                {count}
            </span>
        )}
    </button>
);

const StatBadge = ({ label, value, urgency }: { label: string, value: string | number, urgency?: boolean }) => (
    <span className={`flex items-center px-4 py-1.5 rounded-full ${urgency ? 'bg-orange-50' : 'bg-slate-100'} transition-colors hover:bg-white border border-transparent hover:border-slate-100 shadow-sm`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${urgency ? 'bg-orange-400' : 'bg-slate-400'}`}></span>
        <span className="text-slate-400 mr-1 font-medium">{label}:</span> 
        <strong className={`${urgency ? 'text-orange-600' : 'text-slate-700'}`}>{value}</strong>
    </span>
);

// Helpers
const getTypeColor = (type: string) => {
    if (type.includes("CCTV")) return "bg-blue-50 text-blue-500";
    if (type.includes("Phone")) return "bg-purple-50 text-purple-500";
    if (type.includes("Credit")) return "bg-emerald-50 text-emerald-500";
    return "bg-slate-100 text-slate-500";
}

const getIconForType = (type: string) => {
    if (type.includes("CCTV")) return <Users size={16} />;
    if (type.includes("Phone")) return <Phone size={16} />;
    if (type.includes("Credit")) return <MapPin size={16} />;
    return <MessageSquare size={16} />;
}

const getConfidenceColor = (conf: string) => {
    if (conf.includes("85") || conf.includes("Confirmed")) return "text-emerald-600 bg-emerald-50";
    if (conf.includes("Pending")) return "text-amber-600 bg-amber-50";
    return "text-slate-500 bg-slate-100";
}

export default App;