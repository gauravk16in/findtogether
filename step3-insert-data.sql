-- Step 3: Insert sample data
-- Run this AFTER Steps 1 and 2 complete successfully

-- Insert Person 1: Eleanor Vance
INSERT INTO persons (name, age, description, last_seen_location, last_seen_date)
VALUES ('Eleanor Vance', 28, 'Eleanor was last seen wearing a blue raincoat and black jeans. She is 5''7" with brown hair and green eyes. She may be disoriented and unfamiliar with the area. She has a small tattoo of a bird on her left wrist.', 'Northwood Park, Central City', '2024-07-15');

-- Insert Photo for Eleanor
INSERT INTO photos (person_id, image_url)
VALUES (
  (SELECT id FROM persons WHERE name = 'Eleanor Vance' LIMIT 1),
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop'
);

-- Insert Case for Eleanor
INSERT INTO cases (person_id, status, reported_by, contact_name, contact_role)
VALUES (
  (SELECT id FROM persons WHERE name = 'Eleanor Vance' LIMIT 1),
  'High Priority', 'Central City Police Dept.', 'Robert Jackson', 'Lead Investigator'
);

-- Insert Person 2: Marcus Holloway
INSERT INTO persons (name, age, description, last_seen_location, last_seen_date)
VALUES ('Marcus Holloway', 35, 'Marcus is 6''1" with short black hair and brown eyes. He was last seen carrying a black backpack and wearing a grey hoodie. He is known to frequent local coffee shops and libraries.', 'Downtown Metro Station', '2024-07-12');

-- Insert Photo for Marcus
INSERT INTO photos (person_id, image_url)
VALUES (
  (SELECT id FROM persons WHERE name = 'Marcus Holloway' LIMIT 1),
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
);

-- Insert Case for Marcus
INSERT INTO cases (person_id, status, reported_by, contact_name, contact_role)
VALUES (
  (SELECT id FROM persons WHERE name = 'Marcus Holloway' LIMIT 1),
  'Active Search', 'Family & Friends Network', 'Maria Rodriguez', 'Family Spokesperson'
);

-- Insert Person 3: Lily Chen
INSERT INTO persons (name, age, description, last_seen_location, last_seen_date)
VALUES ('Lily Chen', 22, 'Lily is 5''4" with long black hair often worn in a ponytail. She was wearing a red university sweatshirt and dark jeans. She has a distinctive scar on her right hand from a childhood accident.', 'University Campus, Main Library', '2024-07-18');

-- Insert Photo for Lily
INSERT INTO photos (person_id, image_url)
VALUES (
  (SELECT id FROM persons WHERE name = 'Lily Chen' LIMIT 1),
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop'
);

-- Insert Case for Lily
INSERT INTO cases (person_id, status, reported_by, contact_name, contact_role)
VALUES (
  (SELECT id FROM persons WHERE name = 'Lily Chen' LIMIT 1),
  'New', 'University Security', 'David Park', 'Campus Security Chief'
);
