-- Step 1: Create all tables
-- Run this FIRST in Supabase SQL Editor

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
