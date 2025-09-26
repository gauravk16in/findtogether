-- FindTogether Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create persons table
CREATE TABLE IF NOT EXISTS public.persons (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    description TEXT NOT NULL,
    last_seen_location TEXT NOT NULL,
    last_seen_date TEXT NOT NULL
);

-- Create cases table
CREATE TABLE IF NOT EXISTS public.cases (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    person_id BIGINT NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('High Priority', 'Active Search', 'New', 'Closed')),
    reported_by TEXT,
    contact_name TEXT,
    contact_role TEXT
);

-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    person_id BIGINT NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

-- Create sightings table
CREATE TABLE IF NOT EXISTS public.sightings (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    location TEXT,
    image_url TEXT NOT NULL,
    notes TEXT
);

-- Create potential_matches table
CREATE TABLE IF NOT EXISTS public.potential_matches (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    sighting_id BIGINT NOT NULL REFERENCES public.sightings(id) ON DELETE CASCADE,
    photo_id BIGINT NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
    confidence_score NUMERIC NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'confirmed', 'rejected'))
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('officer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.potential_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for development
-- Note: In production, you should create more restrictive policies

-- Allow public read access to persons, cases, and photos
CREATE POLICY "Allow public read access on persons" ON public.persons FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cases" ON public.cases FOR SELECT USING (true);
CREATE POLICY "Allow public read access on photos" ON public.photos FOR SELECT USING (true);

-- Allow public insert for cases, persons, and photos (for reporting missing persons)
CREATE POLICY "Allow public insert on persons" ON public.persons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on cases" ON public.cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on photos" ON public.photos FOR INSERT WITH CHECK (true);

-- Allow public access to sightings (for community reporting)
CREATE POLICY "Allow public access on sightings" ON public.sightings FOR ALL USING (true);
CREATE POLICY "Allow public access on potential_matches" ON public.potential_matches FOR ALL USING (true);

-- Restrict users table to authenticated users only
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);

-- Insert some sample data for testing
INSERT INTO public.persons (name, age, description, last_seen_location, last_seen_date) VALUES
('Sarah Johnson', 28, 'Brown hair, blue eyes, approximately 5''6" tall. Was wearing a red jacket and blue jeans when last seen.', 'Downtown Mall, Main Street', '2024-03-15'),
('Michael Chen', 34, 'Black hair, brown eyes, approximately 5''10" tall. Has a small scar on left cheek. Last seen wearing business attire.', 'Central Park, near the fountain', '2024-03-12'),
('Emma Rodriguez', 22, 'Long blonde hair, green eyes, approximately 5''4" tall. Has a butterfly tattoo on right wrist.', 'University Campus, Library area', '2024-03-18')
ON CONFLICT DO NOTHING;

-- Get the person IDs for creating cases and photos
WITH person_data AS (
    SELECT id, name FROM public.persons WHERE name IN ('Sarah Johnson', 'Michael Chen', 'Emma Rodriguez')
)
INSERT INTO public.cases (person_id, status, reported_by, contact_name, contact_role)
SELECT 
    p.id,
    CASE 
        WHEN p.name = 'Sarah Johnson' THEN 'High Priority'
        WHEN p.name = 'Michael Chen' THEN 'Active Search'
        ELSE 'New'
    END as status,
    CASE 
        WHEN p.name = 'Sarah Johnson' THEN 'Detective Mary Wilson'
        WHEN p.name = 'Michael Chen' THEN 'Officer John Smith'
        ELSE 'Maria Rodriguez'
    END as reported_by,
    CASE 
        WHEN p.name = 'Sarah Johnson' THEN 'Detective Mary Wilson'
        WHEN p.name = 'Michael Chen' THEN 'Officer John Smith'
        ELSE 'Maria Rodriguez'
    END as contact_name,
    CASE 
        WHEN p.name = 'Sarah Johnson' THEN 'Lead Detective'
        WHEN p.name = 'Michael Chen' THEN 'Police Officer'
        ELSE 'Family Member'
    END as contact_role
FROM person_data p
ON CONFLICT DO NOTHING;

-- Add sample photos
WITH person_data AS (
    SELECT id, name FROM public.persons WHERE name IN ('Sarah Johnson', 'Michael Chen', 'Emma Rodriguez')
)
INSERT INTO public.photos (person_id, image_url)
SELECT 
    p.id,
    CASE 
        WHEN p.name = 'Sarah Johnson' THEN 'https://images.unsplash.com/photo-1494790108755-2616b612b630?w=400&h=400&fit=crop&crop=face'
        WHEN p.name = 'Michael Chen' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
        ELSE 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    END as image_url
FROM person_data p
ON CONFLICT DO NOTHING;
