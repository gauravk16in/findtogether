// Vercel serverless function for reports API
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

  console.log('Reports API called:', req.method, req.url);

  try {
    if (req.method === 'GET') {
      // Fetch all reports with related case data
      const { data: reports, error } = await supabase
        .from('reports')
        .select(`
          *,
          cases (
            id,
            status,
            persons (
              id,
              name,
              age,
              last_seen_location,
              last_seen_date,
              photos (
                image_url
              )
            )
          )
        `);

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to fetch reports' });
      }

      res.status(200).json(reports || []);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}