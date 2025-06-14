-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Create new policies with proper security
-- Allow public read access for menu images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'menu-images' AND
  (storage.foldername(name))[1] = 'public'
);

-- Allow authenticated users to upload images with size and type validation
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'public' AND
  (storage.foldername(name))[2] = 'menu' AND
  (storage.foldername(name))[3] = 'items' AND
  (storage.foldername(name))[4] = auth.uid()::text AND
  (storage.foldername(name))[5] = 'images' AND
  (storage.foldername(name))[6] = 'original' AND
  (storage.foldername(name))[7] = 'jpg' OR
  (storage.foldername(name))[7] = 'jpeg' OR
  (storage.foldername(name))[7] = 'png' OR
  (storage.foldername(name))[7] = 'webp'
);

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'public' AND
  (storage.foldername(name))[2] = 'menu' AND
  (storage.foldername(name))[3] = 'items' AND
  (storage.foldername(name))[4] = auth.uid()::text
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'public' AND
  (storage.foldername(name))[2] = 'menu' AND
  (storage.foldername(name))[3] = 'items' AND
  (storage.foldername(name))[4] = auth.uid()::text
);

-- Update bucket settings
UPDATE storage.buckets
SET public = false,
    file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'menu-images'; 