import React, { useState, useMemo, useEffect } from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon';
import ChevronIcon from './icons/ChevronIcon';

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const statusStyles: { [key: string]: { pill: string, dot: string } } = {
  'High Priority': { pill: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  'Active Search': { pill: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  'New': { pill: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
};

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

type SortOption = 'newest' | 'oldest';
type StatusOption = 'all' | 'High Priority' | 'Active Search' | 'New';

interface CaseListItemProps {
  person: Case;
  onViewCase: (id: number) => void;
}

const CaseListItem: React.FC<CaseListItemProps> = ({ person, onViewCase }) => {
  const style = statusStyles[person.status] || { pill: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-md hover:border-black/10 transition-all duration-300">
      <img 
        src={person.imageUrl} 
        alt={person.name} 
        className="w-24 h-24 rounded-lg object-cover flex-shrink-0" 
      />
      
      <div className="flex-grow">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
          <span className={`flex items-center gap-1.5 ${style.pill} px-2.5 py-1 text-xs font-bold rounded-full`}>
              <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
              {person.status}
          </span>
        </div>
        
        <dl className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500">Age</dt>
            <dd className="text-gray-800 font-medium">{person.age}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Last Seen</dt>
            <dd className="text-gray-800 font-medium">{person.lastSeenDate}</dd>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <dt className="text-gray-500">Location</dt>
            <dd className="text-gray-800 font-medium">{person.lastSeenLocation}</dd>
          </div>
        </dl>
      </div>
      
      <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-auto flex-shrink-0">
        <button 
          onClick={() => onViewCase(person.id)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-black px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
          View Report
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface CasesGridProps {
  onViewCase: (id: number) => void;
}

const CasesGrid: React.FC<CasesGridProps> = ({ onViewCase }) => {
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Use dynamic API URL based on environment
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/cases'
          : '/api/cases';
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch cases from the server.');
        }
        const data = await response.json();
        setAllCases(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching cases:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);


  const filteredAndSortedCases = useMemo(() => {
    let cases = [...allCases];

    if (filterStatus !== 'all') {
      cases = cases.filter(p => p.status === filterStatus);
    }

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      cases = cases.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.lastSeenLocation.toLowerCase().includes(lowercasedQuery)
      );
    }

    cases.sort((a, b) => {
      const dateA = new Date(a.lastSeenDate).getTime();
      const dateB = new Date(b.lastSeenDate).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return cases;
  }, [allCases, searchQuery, filterStatus, sortBy]);

  const SelectControl: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ id, label, value, onChange, children }) => (
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-gray-800">Loading Active Cases...</h3>
          <p className="text-gray-600 mt-3">Please wait a moment.</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="text-center py-20 px-8 bg-red-50 rounded-3xl border border-red-200">
             <h3 className="text-2xl font-bold text-red-800">An Error Occurred</h3>
             <p className="text-red-700 mt-3 max-w-md mx-auto">
                Could not load case data. Please ensure the backend server is running and try again.
             </p>
             <p className="text-sm text-gray-500 mt-2">({error})</p>
          </div>
       )
    }

    if (filteredAndSortedCases.length > 0) {
      return (
        <div className="space-y-4">
          {filteredAndSortedCases.map((person) => (
            <CaseListItem key={person.id} person={person} onViewCase={onViewCase} />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-20 px-8 bg-gray-50 rounded-3xl border border-gray-200">
         <h3 className="text-2xl font-bold text-gray-800">No Cases Match Your Criteria</h3>
         <p className="text-gray-600 mt-3 max-w-md mx-auto">
            Try adjusting your search or clearing the filters to see all active cases.
         </p>
         <button
            onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
            className="mt-6 bg-black text-white font-medium px-6 py-3 rounded-full text-base hover:bg-gray-800 transition-colors"
         >
            Clear Filters
         </button>
      </div>
    );
  };

  return (
    <section className="bg-white py-24 pt-48 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
           <div className="w-16 h-px bg-gray-300 mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-medium text-gray-900 tracking-tighter leading-tight">Active Cases</h1>
          <p className="mt-6 text-xl text-gray-600">
            These are active missing person cases where community vigilance can make a critical difference. If you have any information, please report it.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
          <div className="w-full md:w-auto flex items-center gap-4">
            <SelectControl id="filter-status" label="Filter by status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as StatusOption)}>
              <option value="all">All Statuses</option>
              <option value="High Priority">High Priority</option>
              <option value="Active Search">Active Search</option>
              <option value="New">New</option>
            </SelectControl>
            <SelectControl id="sort-by" label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </SelectControl>
          </div>
          <div className="relative w-full md:ml-auto md:max-w-xs">
            <label htmlFor="search" className="sr-only">Search by name or location</label>
            <input
              id="search"
              type="text"
              placeholder="Search name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-2 border-transparent text-gray-800 font-medium pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Cases List */}
        {renderContent()}
      </div>
    </section>
  );
};

export default CasesGrid;
