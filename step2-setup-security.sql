-- Step 2: Set up security policies
-- Run this AFTER Step 1 completes successfully

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
