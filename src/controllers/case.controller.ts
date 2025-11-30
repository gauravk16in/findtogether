import { Request, Response } from 'express';
import { supabase } from '../services/supabase.service';

// Type definitions for better type safety
interface CaseWithRelations {
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
  } | null;
  photos: Array<{
    image_url: string;
  }> | null;
}

// Fetches all cases and joins them with person and photo details
export const getAllCases = async (req: Request, res: Response) => {
  try {
    console.log('getAllCases: Starting to fetch cases...');
    
    // First, let's check what cases exist in the database
    const { data: allCases, error: allCasesError } = await supabase
      .from('cases')
      .select('*');
    console.log('getAllCases: All cases in database:', allCases);

    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        persons (
          id,
          name,
          age,
          description,
          last_seen_location,
          last_seen_date,
          photos (
            image_url
          )
        )
      `)
      // Comment out the status filter for now to see all cases
      // .eq('status', 'Active Search')
    
    console.log('getAllCases: Raw Supabase response:', { data, error });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch cases' });
    }

    console.log('getAllCases: Number of cases found:', data?.length || 0);

    // Transform the data for the frontend
    const transformedCases = (data || []).map((caseItem: any) => ({
      id: caseItem.id,
      name: caseItem.persons?.name || 'Unknown',
      age: caseItem.persons?.age || 0,
      lastSeenLocation: caseItem.persons?.last_seen_location || 'Unknown',
      lastSeenDate: caseItem.persons?.last_seen_date || 'Unknown',
      imageUrl: caseItem.persons?.photos?.[0]?.image_url || '/default-avatar.jpg',
      status: caseItem.status,
      description: caseItem.persons?.description || 'No description available',
      contact: { 
        name: caseItem.contact_name, 
        role: caseItem.contact_role 
      },
      reportedBy: caseItem.reported_by,
      mapUrl: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(caseItem.persons?.last_seen_location || '')}&zoom=14&size=400x300&key=YOUR_API_KEY`,
      heatmapUrl: `/heatmap/${caseItem.id}.jpg`
    }));

    console.log('getAllCases: Transformed cases:', transformedCases);
    res.json(transformedCases);
  } catch (error) {
    console.error('Error in getAllCases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Creates a new case
export const createCase = async (req: Request, res: Response) => {
  try {
    const {
      name,
      age,
      description,
      lastSeenLocation,
      lastSeenDate,
      imageData, // Expecting a base64 string
      imageUrl, // Or a direct URL
      status,
      reportedBy,
      contactName,
      contactRole,
    } = req.body;
    
    // --- 1. Create Person record ---
    const { data: personData, error: personError } = await supabase
      .from('persons')
      .insert({ name, age, description, last_seen_location: lastSeenLocation, last_seen_date: lastSeenDate } as any)
      .select()
      .single();

    if (personError) throw personError;
    const personId = (personData as any)?.id;

    // --- 2. Process Image and Create Photo record ---
    let finalImageUrl = imageUrl;

    if (imageData) {
      // In a real app, you would upload the base64 image to storage (e.g., Supabase Storage)
      // and get a public URL. For this demo, we'll just use a placeholder.
      finalImageUrl = 'https://via.placeholder.com/400';
    }

    if (!finalImageUrl) {
        return res.status(400).json({ error: "Either imageData or imageUrl is required." });
    }

    const { error: photoError } = await supabase
      .from('photos')
      .insert({
        person_id: personId,
        image_url: finalImageUrl,
      } as any);
    
    if (photoError) throw photoError;

    // --- 3. Create Case record ---
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        person_id: personId,
        status: status || 'New',
        reported_by: reportedBy,
        contact_name: contactName,
        contact_role: contactRole,
      } as any)
      .select()
      .single();

    if (caseError) throw caseError;

    res.status(201).json({ message: 'Case created successfully', case: caseData });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const notifyNewCase = async (req: Request, res: Response) => {
  const { caseId, lat, lng, locationDescription } = req.body;

  try {
    // 1. Find volunteers near the location
    // For this demo, we'll notify ALL volunteers because we don't have real geocoding yet.
    const { data: volunteers, error: volError } = await supabase
        .from('volunteers')
        .select('id, user_id, name');
    
    if (volError) throw volError;

    if (!volunteers || volunteers.length === 0) {
        return res.json({ message: 'No volunteers to notify' });
    }

    // 2. Create notifications
    const notifications = (volunteers as any[]).map(vol => ({
        user_id: vol.user_id,
        case_id: caseId,
        title: 'New Missing Person Report',
        message: `A new case has been reported near ${locationDescription || 'your area'}. Please check the dashboard.`,
        is_read: false
    }));

    const { error: notifError } = await supabase
        .from('notifications')
        .insert(notifications as any);

    if (notifError) throw notifError;

    res.json({ success: true, count: volunteers.length });

  } catch (error: any) {
    console.error('Error notifying volunteers:', error);
    res.status(500).json({ error: error.message });
  }
};