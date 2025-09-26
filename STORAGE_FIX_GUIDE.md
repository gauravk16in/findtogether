# Storage RLS Policy Fix Guide

## Current Issue
The missing person report form is failing when trying to upload photos with the error:
```
StorageApiError: new row violates row-level security policy
```

## Solution Steps

### Option 1: Fix via Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Create the Photos Bucket** (if not exists)
   - Go to Storage section
   - Click "New bucket"
   - Name: `photos`
   - Make it public: ✅ Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/*`

3. **Fix RLS Policies via SQL Editor**
   - Go to SQL Editor
   - Create a new query
   - Paste and run this SQL:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to upload to photos" ON storage.objects;

-- Create new permissive policies
CREATE POLICY "Allow public read access to photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Allow anyone to upload to photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos');

-- Optional: Allow updates and deletes if needed
CREATE POLICY "Allow anyone to update photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'photos');

CREATE POLICY "Allow anyone to delete photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos');
```

### Option 2: Fix via Browser Console

1. **Load the App**
   - Run `npm run dev`
   - Open http://localhost:3000 in browser

2. **Open Developer Console**
   - Press F12 or right-click → Inspect
   - Go to Console tab

3. **Run the Fix Script**
   ```javascript
   // Load the fix script
   fetch('/fix-storage-script.js')
     .then(response => response.text())
     .then(script => eval(script))
     .then(() => fixStoragePolicies());
   ```

### Option 3: Manual Testing

Test the upload functionality:

```javascript
// Test upload in browser console (after fixing policies)
const testUpload = async () => {
  const { supabase } = window;
  
  // Create a small test file
  const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(`test-${Date.now()}.txt`, testFile);
    
  if (error) {
    console.error('Upload failed:', error);
  } else {
    console.log('Upload successful:', data);
  }
};

testUpload();
```

## Verification

After implementing the fix:

1. **Test the Form**
   - Go to http://localhost:3000
   - Click "Find Now" button
   - Fill out the missing person report form
   - Upload a photo
   - Submit the form

2. **Check Database**
   - Go to Supabase Dashboard > Table Editor
   - Check the `reports` table for new entries
   - Check Storage > photos bucket for uploaded files

## Alternative: Temporary Workaround

If you want to test the form without photos temporarily, you can comment out the photo upload in `ReportMissingPage.tsx`:

```typescript
// Comment out these lines in handleSubmit:
// const photoUrls = [];
// for (const photo of photos) {
//   const photoUrl = await uploadPhoto(photo);
//   if (photoUrl) photoUrls.push(photoUrl);
// }

// And use empty array:
const photoUrls: string[] = [];
```

## Expected Result

After fixing the RLS policies, the missing person report form should:
1. Accept photo uploads without errors
2. Store all form data in the `reports` table
3. Store photos in the `photos` storage bucket
4. Display success message with case ID
5. Allow users to submit complete missing person reports

## Next Steps

Once storage is working:
1. Test the complete flow end-to-end
2. Verify data integrity in Supabase
3. Add any additional validation or features needed
4. Consider adding photo compression for better performance
