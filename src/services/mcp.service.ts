import { supabase } from './supabase.service';

// Mock external services
const TwitterService = {
  post: async (message: string) => console.log(`[Twitter] Posted: ${message}`)
};

const FacebookService = {
  post: async (message: string) => console.log(`[Facebook] Posted: ${message}`)
};

const WhatsAppService = {
  sendGroupMessage: async (groupId: string, message: string) => console.log(`[WhatsApp Group ${groupId}] Sent: ${message}`),
  sendDirectMessage: async (phone: string, message: string) => console.log(`[WhatsApp DM ${phone}] Sent: ${message}`)
};

const GoogleMapsService = {
  generateStaticMap: (lat: number, lng: number) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x300&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`
};

export const MCPService = {
  /**
   * 1. report_missing_person
   * Collects victim details and creates case ID.
   */
  async reportMissingPerson(data: {
    name: string;
    age: number;
    description: string;
    lastSeenLocation: string;
    lastSeenDate: string;
    reporterName: string;
    reporterContact: string;
    imageUrl?: string;
  }) {
    console.log('MCP: Reporting missing person...');
    
    // 1. Create Person
    const { data: person, error: personError } = await supabase
      .from('persons')
      .insert({
        name: data.name,
        age: data.age,
        description: data.description,
        last_seen_location: data.lastSeenLocation,
        last_seen_date: data.lastSeenDate
      } as any)
      .select()
      .single();

    if (personError) throw new Error(`Failed to create person: ${personError.message}`);

    const personId = (person as any).id;

    // 2. Create Photo if URL provided
    if (data.imageUrl) {
      await supabase.from('photos').insert({
        person_id: personId,
        image_url: data.imageUrl
      } as any);
    }

    // 3. Create Case
    const { data: newCase, error: caseError } = await supabase
      .from('cases')
      .insert({
        person_id: personId,
        status: 'New',
        reported_by: data.reporterName,
        contact_name: data.reporterName,
        contact_role: 'Reporter' // Default
      } as any)
      .select()
      .single();

    if (caseError) throw new Error(`Failed to create case: ${caseError.message}`);

    const caseId = (newCase as any).id;

    return {
      success: true,
      caseId: caseId,
      personId: personId,
      message: `Case created successfully. Case ID: ${caseId}`
    };
  },

  /**
   * 2. post_alerts
   * Posts formatted alerts to Twitter/X, Facebook, WhatsApp group
   */
  async postAlerts(caseId: number) {
    console.log(`MCP: Posting alerts for Case ${caseId}...`);

    // Fetch case details
    const { data: caseData } = await supabase
      .from('cases')
      .select('*, persons(*, photos(*))')
      .eq('id', caseId)
      .single();

    if (!caseData) throw new Error('Case not found');

    const safeCaseData = caseData as any;
    const person = safeCaseData.persons;
    const photoUrl = person.photos?.[0]?.image_url || '';
    
    const alertMessage = `MISSING PERSON ALERT: ${person.name}, Age ${person.age}. Last seen at ${person.last_seen_location} on ${person.last_seen_date}. Description: ${person.description}. If seen, please contact police or ${safeCaseData.contact_name}. #MissingPerson #Find${person.name.replace(/\s/g, '')}`;

    // Execute posts in parallel
    await Promise.all([
      TwitterService.post(alertMessage),
      FacebookService.post(alertMessage),
      WhatsAppService.sendGroupMessage('Community_Alerts_Group', alertMessage)
    ]);

    return { success: true, message: 'Alerts posted to Twitter, Facebook, and WhatsApp.' };
  },

  /**
   * 3. create_search_map
   * Generates Google Maps pins for last seen locations and search zones.
   */
  async createSearchMap(location: string) {
    console.log(`MCP: Creating search map for ${location}...`);
    
    // Mock Geocoding (In real app, use Google Maps Geocoding API)
    // For "Connaught Place, Delhi", approx lat/lng
    const mockCoords = { lat: 28.6304, lng: 77.2177 }; 
    
    if (location.toLowerCase().includes('delhi')) {
        mockCoords.lat = 28.6139;
        mockCoords.lng = 77.2090;
    }

    const mapUrl = GoogleMapsService.generateStaticMap(mockCoords.lat, mockCoords.lng);
    
    return {
      success: true,
      location,
      coordinates: mockCoords,
      searchZones: [
        { radius: '1km', priority: 'High', description: 'Immediate vicinity' },
        { radius: '5km', priority: 'Medium', description: 'Surrounding transport hubs' }
      ],
      mapUrl
    };
  },

  /**
   * 4. coordinate_volunteers
   * Matches volunteers to search areas based on location/skills and sends WhatsApp message
   */
  async coordinateVolunteers(caseId: number, location: string) {
    console.log(`MCP: Coordinating volunteers for Case ${caseId} near ${location}...`);

    // 1. Get Case Details for the message
    const { data: caseData } = await supabase
      .from('cases')
      .select('*, persons(*)')
      .eq('id', caseId)
      .single();
      
    if (!caseData) throw new Error('Case not found');

    const safeCaseData = caseData as any;

    // 2. Find Volunteers (Mocking geospatial search)
    // In a real app, use PostGIS: ST_DWithin(location, volunteer_location, radius)
    const { data: volunteers, error } = await supabase
      .from('volunteers')
      .select('*');
      // .ilike('location_address', `%${location}%`); // Simple text match for now

    if (error) throw error;

    const safeVolunteers = (volunteers || []) as any[];

    // Filter manually for "Delhi" or "Connaught Place" if the query was generic
    const matchedVolunteers = safeVolunteers.filter(v => 
        v.location_address?.toLowerCase().includes('delhi') || 
        v.location_address?.toLowerCase().includes('connaught') ||
        location.toLowerCase().includes('delhi') // If search is Delhi, match all (simplified)
    ) || [];

    console.log(`Found ${matchedVolunteers.length} volunteers near ${location}`);

    // 3. Send WhatsApp Messages
    const message = `URGENT VOLUNTEER ALERT: Missing Person ${safeCaseData.persons.name} reported near your location (${location}). Please check your dashboard for search coordination instructions.`;

    const notifications = [];
    for (const vol of matchedVolunteers) {
      if (vol.phone) {
        await WhatsAppService.sendDirectMessage(vol.phone, message);
      }
      
      // Also create in-app notification
      notifications.push({
        user_id: vol.user_id,
        case_id: caseId,
        title: 'Urgent Search Request',
        message: message,
        is_read: false
      });
    }

    if (notifications.length > 0) {
      await supabase.from('notifications').insert(notifications as any);
    }

    return {
      success: true,
      volunteersContacted: matchedVolunteers.length,
      volunteerNames: matchedVolunteers.map(v => v.name)
    };
  }
};
