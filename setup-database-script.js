const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Create reports table
    const { error: reportsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    
    if (reportsError) {
      console.error('Error creating reports table:', reportsError);
    } else {
      console.log('✅ Reports table created/verified');
    }
    
    // Test creating a storage bucket (this might fail if it already exists)
    const { error: bucketError } = await supabase.storage.createBucket('photos', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Error creating storage bucket:', bucketError);
    } else {
      console.log('✅ Photos storage bucket ready');
    }
    
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();
