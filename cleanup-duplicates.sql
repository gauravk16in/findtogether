-- Clean up duplicate data and ensure unique entries
-- Run this in your Supabase SQL Editor

-- Step 1: Delete all existing data (in correct order due to foreign key dependencies)
DELETE FROM cases;
DELETE FROM photos;  
DELETE FROM persons;

-- Step 2: Reset the ID sequences to start fresh
ALTER SEQUENCE persons_id_seq RESTART WITH 1;
ALTER SEQUENCE cases_id_seq RESTART WITH 1;
ALTER SEQUENCE photos_id_seq RESTART WITH 1;

-- Step 3: Insert unique persons (no duplicates)
INSERT INTO persons (name, age, description, last_seen_location, last_seen_date) VALUES
('Eleanor Vance', 28, 'Eleanor was last seen wearing a blue raincoat and black jeans. She is 5''7" with brown hair and green eyes. She may be disoriented and unfamiliar with the area. She has a small tattoo of a bird on her left wrist.', 'Northwood Park, Central City', '2024-07-15'),
('Marcus Holloway', 35, 'Marcus is 6''1" with short black hair and brown eyes. He was last seen carrying a black backpack and wearing a grey hoodie. He is known to frequent local coffee shops and libraries.', 'Downtown Metro Station', '2024-07-12'),
('Lily Chen', 22, 'Lily is 5''4" with long black hair often worn in a ponytail. She was wearing a red university sweatshirt and dark jeans. She has a distinctive scar on her right hand from a childhood accident.', 'University Campus, Main Library', '2024-07-18');

-- Step 4: Insert unique photos (one per person)
INSERT INTO photos (person_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop'),
(2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'),
(3, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop');

-- Step 5: Insert unique cases (one per person)
INSERT INTO cases (person_id, status, reported_by, contact_name, contact_role) VALUES
(1, 'High Priority', 'Central City Police Dept.', 'Robert Jackson', 'Lead Investigator'),
(2, 'Active Search', 'Family & Friends Network', 'Maria Rodriguez', 'Family Spokesperson'),
(3, 'New', 'University Security', 'David Park', 'Campus Security Chief');

-- Verify the cleanup worked
SELECT 'Persons Count:' as info, COUNT(*) as count FROM persons
UNION ALL
SELECT 'Cases Count:' as info, COUNT(*) as count FROM cases
UNION ALL  
SELECT 'Photos Count:' as info, COUNT(*) as count FROM photos;
