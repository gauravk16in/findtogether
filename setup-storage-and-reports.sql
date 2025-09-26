-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Allow public access to photos bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Authenticated users can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Add additional fields to cases table for better contact info
ALTER TABLE cases ADD COLUMN IF NOT EXISTS reporter_whatsapp TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS reporter_address TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS reporter_contact TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS reporter_email TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS additional_info JSONB;

-- Create a table for reports to store additional information
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
    reporter_name TEXT NOT NULL,
    reporter_relation TEXT NOT NULL,
    reporter_whatsapp TEXT,
    reporter_address TEXT,
    reporter_contact TEXT,
    reporter_email TEXT,
    missing_person_identification TEXT,
    missing_person_social_media TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
