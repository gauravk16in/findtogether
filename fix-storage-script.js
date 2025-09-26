// Script to create storage bucket and fix RLS policies
// Run this in the browser developer console when the app is loaded

async function fixStoragePolicies() {
  console.log('Attempting to fix storage policies...');
  
  try {
    // Import supabase from the global context (when app is loaded)
    const { supabase } = window;
    
    if (!supabase) {
      console.error('Supabase client not found. Make sure the app is loaded.');
      return;
    }
    
    // Try to create the bucket
    console.log('Creating photos bucket...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const photoBucket = buckets?.find(bucket => bucket.id === 'photos');
    
    if (!photoBucket) {
      const { error: bucketError } = await supabase.storage.createBucket('photos', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (bucketError) {
        console.error('Error creating bucket:', bucketError);
      } else {
        console.log('✅ Photos bucket created successfully');
      }
    } else {
      console.log('✅ Photos bucket already exists');
    }
    
    console.log('Please run the SQL script in your Supabase dashboard to fix RLS policies:');
    console.log(`
    -- Run this in Supabase Dashboard > SQL Editor
    
    -- Create new permissive policies for the photos bucket
    DROP POLICY IF EXISTS "Allow public read access to photos" ON storage.objects;
    DROP POLICY IF EXISTS "Allow anyone to upload to photos" ON storage.objects;
    
    CREATE POLICY "Allow public read access to photos" ON storage.objects
      FOR SELECT USING (bucket_id = 'photos');
    
    CREATE POLICY "Allow anyone to upload to photos" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'photos');
    `);
    
  } catch (error) {
    console.error('Error fixing storage policies:', error);
  }
}

// Export for manual use
window.fixStoragePolicies = fixStoragePolicies;

console.log('Storage fix script loaded. Run fixStoragePolicies() in console to attempt fix.');
