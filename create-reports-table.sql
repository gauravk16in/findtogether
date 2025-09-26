-- Create reports table manually using Supabase SQL editor
-- Run this in your Supabase dashboard > SQL Editor

-- Create reports table
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

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for storage
CREATE POLICY "Anyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Authenticated users can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
