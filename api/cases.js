// Vercel serverless function for cases API
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://fyxtgfgnrqweddwrlzkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eHRnZmducnF3ZWRkd3JsemtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NjI0MzEsImV4cCI6MjA3NDQzODQzMX0.-8FcZtDYAnFVT7AOoiQGLkWfJXobtci7-22SZ2EdHwg';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('Cases API called:', req.method, req.url);

  try {
    if (req.method === 'GET') {
      // Fetch all cases with related data
      const { data: cases, error } = await supabase
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
        `);

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to fetch cases' });
      }

      // Transform the data to match the expected format
      const transformedCases = cases.map(caseItem => ({
        id: caseItem.id,
        name: caseItem.persons?.name || 'Unknown',
        age: caseItem.persons?.age || 0,
        lastSeenLocation: caseItem.persons?.last_seen_location || 'Unknown',
        lastSeenDate: caseItem.persons?.last_seen_date || '',
        imageUrl: caseItem.persons?.photos?.[0]?.image_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
        status: caseItem.status,
        description: caseItem.persons?.description || 'No description available',
        contact: {
          name: caseItem.contact_name,
          role: caseItem.contact_role
        },
        reportedBy: caseItem.reported_by,
        mapUrl: 'https://images.unsplash.com/photo-1584486188544-dc5235539218?q=80&w=800&auto=format&fit=crop',
        heatmapUrl: 'https://i.imgur.com/Y3p9oM2.png'
      }));

      res.status(200).json(transformedCases);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}