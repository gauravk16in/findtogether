

export const NAV_LINKS: { name: string; key: 'individuals' | 'organizations' | 'about' | 'cases' }[] = [
  { name: "Active Cases", key: "cases" },
  { name: "For Individuals", key: "individuals" }, 
  { name: "For Organizations", key: "organizations" }, 
  { name: "About", key: "about" }
];

export const MARKETPLACE_STATS = [
  { value: '40%+', label: 'Faster Reunions Reported' },
  { value: '10k+', label: 'Active Volunteers' },
  { value: '50+', label: 'Official Agencies Partnered' },
];

export const SPACES_CONTENT = {
  card1: {
    tag: 'Featuring Heatmap',
    title: 'Reuniting lives that matter.',
    description: 'Families, communities, and officials come together on FindTogether to share details, sightings, and support. Every connection builds hope and brings us closer to finding loved ones.',
  },
  card2: {
    imageUrl: '/img/fam.png',
    alt: 'Family Hugging each Other',
  },
  card3: {
    imageUrl: 'https://images.unsplash.com/photo-1687294782370-5ae92f081c47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwbG9jYXRpb24lMjBwaW5zfGVufDF8fHx8MTc1ODI4MDU1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    alt: 'Map View',
  }
};

export const HEALING_SECTION_CONTENT = {
  part1: {
    headline: "Every search deserves a homecoming.",
    subheadline: "The evidence is clear: collaboration accelerates outcomes. That’s what FindTogether was built for — combining AI, maps, and official support to reunite families faster.",
    linkText: "Why it Works",
  },
  part2: {
    title: "Connection that means something.",
    description: "In today’s world, thousands of families struggle with the pain of missing loved ones — facing uncertainty, fear, and long waits. With FindTogether, the story changes. By combining AI search, real-time maps, and official verification, families get faster leads and renewed hope. This impact isn’t by accident. It’s the power of technology, community, and compassion working together — transforming every report into a meaningful step toward reunion.",
  },
  part3: {
    title: "Better outcomes, faster reunions.",
    description: "A missing loved one isn’t just data, it’s a family’s hope on hold. Today, scattered reports and delays slow recovery and stretch the pain longer. FindTogether changes that. By uniting AI search, live maps, and official verification, families receive leads up to 40% faster and reduce manual searching efforts by over 60%.",
  },
};

export const FAQ_DATA = [
  {
    question: 'How does FindTogether actually help find missing persons?',
    answer: 'FindTogether uses AI-powered face recognition and data matching to scan reports, CCTV footage, and social signals. It then creates a live heatmap of possible sightings, which is verified by authorities before notifying families.'
  },
  {
    question: 'Is the system secure and trustworthy?',
    answer: 'Yes. All personal details and photos are stored securely in Supabase with strict access controls. Matches are always verified by government/NGO officials before reaching families, ensuring accuracy and trust.'
  },
  {
    question: 'What makes FindTogether different from existing systems?',
    answer: 'Unlike traditional reporting, FindTogether unifies families, communities, and officials into one platform. It combines AI search, real-time maps, and centralized reporting, reducing duplicate work and accelerating recoveries by up to 40% faster.'
  },
  {
    question: 'Can families use it directly, or is it only for authorities?',
    answer: 'Both. Families can submit reports directly, while officials and NGOs have dedicated dashboards for verification. This ensures collaboration, speed, and shared responsibility in every case.'
  }
];

export const ACTIVE_CASES_DATA = [
  {
    id: 1,
    name: 'Eleanor Vance',
    age: 28,
    lastSeenLocation: 'Northwood Park, Central City',
    lastSeenDate: '2024-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    status: 'High Priority',
    description: 'Eleanor was last seen wearing a blue raincoat and black jeans. She is 5\'7" with brown hair and green eyes. She may be disoriented and unfamiliar with the area. She has a small tattoo of a bird on her left wrist.',
    contact: { name: 'Robert Jackson', role: 'Lead Investigator' },
    reportedBy: 'Central City Police Dept.',
    mapUrl: 'https://images.unsplash.com/photo-1584486188544-dc5235539218?q=80&w=800&auto=format&fit=crop',
    heatmapUrl: 'https://i.imgur.com/Y3p9oM2.png',
  },
  {
    id: 2,
    name: 'Marcus Holloway',
    age: 35,
    lastSeenLocation: 'Downtown Metro Station',
    lastSeenDate: '2024-07-12',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    status: 'Active Search',
    description: 'Marcus is 6\'1" with short black hair and brown eyes. He was last seen carrying a black backpack and wearing a grey hoodie. He is known to frequent local coffee shops and libraries.',
    contact: { name: 'Maria Rodriguez', role: 'Family Spokesperson' },
    reportedBy: 'Family & Friends Network',
    mapUrl: 'https://images.unsplash.com/photo-1544607730-8c74996d9d0e?q=80&w=800&auto=format&fit=crop',
    heatmapUrl: 'https://i.imgur.com/Y3p9oM2.png',
  },
  {
    id: 3,
    name: 'Sofia Reyes',
    age: 19,
    lastSeenLocation: 'Riverside Library',
    lastSeenDate: '2024-07-18',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    status: 'High Priority',
    description: 'Sofia is a college student, last seen studying at the Riverside Library. She is 5\'4" with long, dark brown hair. She was wearing a red university sweatshirt and glasses. Her phone has been inactive since her disappearance.',
    contact: { name: 'Detective Miller', role: 'Lead Investigator' },
    reportedBy: 'City University Security',
    mapUrl: 'https://images.unsplash.com/photo-1529173054385-c852a41a2b10?q=80&w=800&auto=format&fit=crop',
    heatmapUrl: 'https://i.imgur.com/Y3p9oM2.png',
  },
  {
    id: 4,
    name: 'Liam Chen',
    age: 42,
    lastSeenLocation: 'Oakridge Shopping Mall',
    lastSeenDate: '2024-07-10',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    status: 'Active Search',
    description: 'Liam was last seen near the east entrance of Oakridge Shopping Mall. He is 5\'10" with black hair, and was wearing a black leather jacket and blue jeans. He drives a silver sedan, which was found in the mall parking lot.',
    contact: { name: 'Robert Jackson', role: 'Lead Investigator' },
    reportedBy: 'Oakridge County Sheriff',
    mapUrl: 'https://images.unsplash.com/photo-1555529771-788872635956?q=80&w=800&auto=format&fit=crop',
    heatmapUrl: 'https://i.imgur.com/Y3p9oM2.png',
  },
   {
    id: 5,
    name: 'Isabella Garcia',
    age: 22,
    lastSeenLocation: 'City University Campus',
    lastSeenDate: '2024-07-20',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop',
    status: 'New',
    description: 'Isabella is a student at City University and was last seen leaving the campus library. She is 5\'6" with blonde hair and was wearing a white t-shirt and light blue jeans. She often goes for walks in the adjacent city park.',
    contact: { name: 'Philip Cheng', role: 'Volunteer Coordinator' },
    reportedBy: 'Community Watch',
    mapUrl: 'https://images.unsplash.com/photo-1529173054385-c852a41a2b10?q=80&w=800&auto=format&fit=crop',
    heatmapUrl: 'https://i.imgur.com/Y3p9oM2.png',
  },
  {
    id: 6,
    name: 'David Kim',
    age: 55,
    lastSeenLocation: 'Harbor View Restaurant',
    lastSeenDate: '2024-07-16',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    status: 'Active Search',
    description: 'David was having dinner at the Harbor View Restaurant and has not been seen since. He is 5\'9" with graying black hair. He was wearing a light blue button-down shirt and khaki pants. His car was left at the restaurant.',
    contact: { name: 'Detective Miller', role: 'Lead Investigator' },
    reportedBy: 'Harbor Police Department',
    mapUrl: 'https://images.unsplash.com/photo-1525095366544-027f6b49e80c?q=80&w=800&auto=format&fit=crop',
    heatmapUrl: 'https://i.imgur.com/Y3p9oM2.png',
  },
];


export const FOOTER_MAIN_LINKS: { name: string; key: 'home' | 'organizations' | 'about' | 'contact' | 'cases' | 'login' }[] = [
    { name: "Home", key: "home" },
    { name: "Active Cases", key: "cases" },
    { name: "For Organizations", key: "organizations" },
    { name: "About", key: "about" },
    { name: "Tech Support", key: "contact" },
    { name: "Portal Login", key: "login" },
];


export const FOOTER_LEGAL_LINKS = [
    "Community Guidelines",
    "Terms",
    "Privacy Policy",
];


// FIX: Added missing COMMUNITY_MEMBERS constant for components/Community.tsx
export const COMMUNITY_MEMBERS = [
  {
    name: 'Jane Doe',
    field: 'Creative Technologist',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'John Smith',
    field: 'AI Artist',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Emily White',
    field: 'AR/VR Developer',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Michael Brown',
    field: 'Data Scientist',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Sarah Green',
    field: 'Sound Designer',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  },
];

// FIX: Added missing TRACKS_DATA constant for components/Tracks.tsx
export const TRACKS_DATA = [
  {
    title: 'Art & Code',
    description: 'Exploring the intersection of artistic practice and computational technologies.',
  },
  {
    title: 'Data & Narrative',
    description: 'Using data to create compelling stories and visualizations.',
  },
  {
    title: 'Extended Realities',
    description: 'Building immersive experiences with AR, VR, and mixed reality.',
  },
  {
    title: 'Creative AI',
    description: 'Leveraging artificial intelligence for new forms of creative expression.',
  },
  {
    title: 'Sound & Vision',
    description: 'Innovating at the nexus of audio and visual arts.',
  },
  {
    title: 'Radical Collaboration',
    description: 'Fostering interdisciplinary projects that challenge conventions.',
  },
];

// FIX: Added missing NEWS_ARTICLES constant for components/News.tsx
export const NEWS_ARTICLES = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1516245834210-c4c1427873ab?q=80&w=800&auto=format&fit=crop',
    category: 'Technology',
    title: 'FindTogether Platform Showcased at Tech for Good Gala',
    source: 'TechCrunch',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=800&auto=format&fit=crop',
    category: 'Art & Design',
    title: 'The Future of Search: A Look Inside FindTogether\'s Technology',
    source: 'ArtForum',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=800&auto=format&fit=crop',
    category: 'Community',
    title: 'How FindTogether is Empowering Communities in Search Efforts',
    source: 'Forbes',
  },
];

// FIX: Added missing SUPPORTERS_LOGOS constant for components/Support.tsx
export const SUPPORTERS_LOGOS = [
  "DELL",
  "SONY",
  "Knight Foundation",
  "Ford Foundation",
  "Meta",
  "Google",
  "Microsoft",
  "OMNIDIA",
];

// FIX: Added missing ORGS_DATA constant for components/OrgsSection.tsx
export const ORGS_DATA = [
  {
    name: 'National Center for Missing & Exploited Children',
    logoUrl: 'https://i.imgur.com/8Q5YgQ3.png', // Placeholder logo
    bgImageUrl: 'https://images.unsplash.com/photo-1554123118-f563b7190089?q=80&w=800&auto=format&fit=crop',
    members: '1.2k members',
    heightClass: 'h-96'
  },
  {
    name: 'Search & Rescue Foundation',
    logoUrl: 'https://i.imgur.com/dAvJvQh.png', // Placeholder logo
    bgImageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop',
    members: '850 members',
    heightClass: 'h-80'
  },
  {
    name: 'Community United',
    logoUrl: 'https://i.imgur.com/7gK2hM4.png', // Placeholder logo
    bgImageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    members: '2.5k members',
    heightClass: 'h-80'
  }
];

// Content for About Page -> Problem Statement
export const PROBLEM_STATEMENT_CONTENT = {
  headline: "Every hour lost is a hope diminished.",
  imageUrl: 'https://images.unsplash.com/photo-1531306734731-a75f06874f63?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  imageAlt: "A lone person standing on a cliff overlooking the ocean at dusk.",
  title: "Fragmented systems and information silos delay critical action.",
  description: "When a person goes missing, the clock starts ticking. Families are thrown into a state of panic, navigating a maze of different agencies and platforms. Law enforcement and search teams face their own challenges: fragmented data, lack of a common operational picture, and difficulty in coordinating volunteer efforts efficiently. Information is scattered, leads grow cold, and the crucial first 48 hours are often lost to procedural delays and communication gaps. This lack of a unified, real-time system is the biggest obstacle in the race against time."
};

// Content for About Page -> Solution Statement
export const SOLUTION_STATEMENT_CONTENT = {
  headline: "A unified command center for every search.",
  imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  imageAlt: "A person casually walking at a driving range.",
  paragraphs: [
    "FindTogether is the centralized intelligence platform designed to bridge these gaps. We provide a single, secure ecosystem where families, law enforcement, and certified NGOs can collaborate in real-time.",
    "Our platform integrates AI-driven data analysis, real-time mapping, and verified reporting into one intuitive dashboard. By consolidating information and providing actionable intelligence, we empower search teams to make faster, more informed decisions.",
    "From filing a report to receiving verified updates, FindTogether streamlines the entire process, ensuring that every piece of information is captured, analyzed, and shared with the right people at the right time. It’s technology built not just to search, but to find."
  ]
};

// Content for About Page -> Social Mission
export const SOCIAL_MISSION_CONTENT = {
  headline: "Technology with a singular purpose.",
  imageUrl: 'https://images.unsplash.com/photo-1524508762098-fd966ffb6ef9?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  imageAlt: "A group of friends sitting in chairs and talking.",
  title: "More signal, less noise.",
  description: "FindTogether is not social media; it is a strategic tool engineered for a critical mission. Our design philosophy is simple: eliminate distractions and maximize efficiency. We provide verified information, coordinate actionable tasks, and connect official teams with community efforts. The platform is built to be used when it matters most—to find information, to organize, and to act—then to step back, allowing real-world efforts to succeed."
};

// Content for About Page -> Receipts Section
export const RECEIPTS_CONTENT = {
  headline: "Our Core Principles.",
  subheadline: "Built on a Foundation of Trust, Speed, and Collaboration.",
  description: "FindTogether isn't a hypothetical solution; it's a strategic framework developed in consultation with experts in law enforcement and search and rescue. Our model is engineered to deliver measurable improvements in search operations by focusing on three core principles.",
  stats: [
    { title: 'Unified Intelligence', description: 'By centralizing data from multiple sources, we provide a single source of truth, reducing redundant efforts and ensuring all stakeholders operate with the most current information.' },
    { title: 'Accelerated Response', description: 'Our AI-powered tools analyze data to identify credible leads and potential locations faster, empowering first responders to act decisively within the critical early hours of a search.' },
    { title: 'Empowered Collaboration', description: 'We provide a secure and structured platform for communication between official agencies and community volunteers, turning widespread concern into coordinated, effective action.' }
  ]
};