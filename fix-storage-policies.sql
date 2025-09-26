-- Fix Supabase Storage RLS policies for photo uploads
-- Run this in your Supabase Dashboard > SQL Editor

-- First, ensure the photos bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Create new permissive policies for the photos bucket
CREATE POLICY "Allow public read access to photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Allow anyone to upload to photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow anyone to update photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'photos');

CREATE POLICY "Allow anyone to delete photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos');

-- Alternative: Disable RLS entirely for the photos bucket (less secure but works)
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
