-- Drop existing policies with proper error handling
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
    DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN
        NULL; -- Ignore if policy doesn't exist
END $$;

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
  (
    (storage.foldername(name))[7] = 'jpg' OR
    (storage.foldername(name))[7] = 'jpeg' OR
    (storage.foldername(name))[7] = 'png' OR
    (storage.foldername(name))[7] = 'webp'
  )
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

-- Update bucket settings for better performance and security
UPDATE storage.buckets
SET 
  public = false,
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'],
  avif_autodetection = true,
  file_extension_validation = true
WHERE id = 'menu-images';

-- Create or replace the image validation function
CREATE OR REPLACE FUNCTION storage.validate_image_upload()
RETURNS TRIGGER AS $$
BEGIN
  -- Check file size
  IF NEW.metadata->>'size'::text::bigint > 5242880 THEN
    RAISE EXCEPTION 'File size exceeds 5MB limit';
  END IF;

  -- Check file type
  IF NEW.metadata->>'mimetype' NOT IN ('image/jpeg', 'image/png', 'image/webp') THEN
    RAISE EXCEPTION 'Invalid file type. Only JPEG, PNG, and WebP images are allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS validate_image_upload ON storage.objects;
CREATE TRIGGER validate_image_upload
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'menu-images')
  EXECUTE FUNCTION storage.validate_image_upload(); 