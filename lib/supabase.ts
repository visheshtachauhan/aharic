import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: {
      getItem: (key) => {
        try {
          const itemStr = localStorage.getItem(key);
          if (!itemStr) return null;
          const item = JSON.parse(itemStr);
          const now = new Date();
          if (item.expires_at && item.expires_at * 1000 < now.getTime()) {
            localStorage.removeItem(key);
            return null;
          }
          return item;
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      },
    },
  },
});

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
  
  if (event === 'SIGNED_IN') {
    // Force a page reload to ensure session is properly set
    if (window.location.pathname !== '/admin/dashboard') {
      window.location.href = '/admin/dashboard';
    }
  } else if (event === 'SIGNED_OUT') {
    if (window.location.pathname !== '/auth/login') {
      window.location.href = '/auth/login';
    }
  }
});

// Storage policies for menu item images
const STORAGE_POLICIES = {
  // Allow authenticated users to upload images
  upload: `
    CREATE POLICY "Allow authenticated users to upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'menu' AND
      auth.uid() = (storage.foldername(name))[1]::uuid AND
      (storage.foldername(name))[2] = 'images' AND
      (storage.foldername(name))[3] = 'original'
    );
  `,
  // Allow public read access to images
  read: `
    CREATE POLICY "Allow public read access to images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'menu');
  `,
  // Allow users to update their own images
  update: `
    CREATE POLICY "Allow users to update their own images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'menu' AND
      auth.uid() = (storage.foldername(name))[1]::uuid
    );
  `,
  // Allow users to delete their own images
  delete: `
    CREATE POLICY "Allow users to delete their own images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'menu' AND
      auth.uid() = (storage.foldername(name))[1]::uuid
    );
  `,
};

export async function setupStoragePolicies() {
  try {
    // Create the menu bucket if it doesn't exist
    const { error: bucketError } = await supabase
      .storage
      .createBucket('menu', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      });

    if (bucketError && bucketError.message !== 'Bucket already exists') {
      throw bucketError;
    }

    // Apply storage policies
    for (const [name, policy] of Object.entries(STORAGE_POLICIES)) {
      const { error } = await supabase.rpc('create_policy', {
        policy_name: `menu_${name}`,
        policy_definition: policy,
      });

      if (error && !error.message.includes('already exists')) {
        console.error(`Error creating policy ${name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error setting up storage policies:', error);
    throw error;
  }
}

export async function uploadImage(file: File): Promise<string> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('You must be logged in to upload images.');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG, or WebP image.');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}${file.name.substring(file.name.lastIndexOf('.'))}`;

    // Create file path following the required structure
    const filePath = `public/menu/items/${user.id}/images/original/${fileName}`;

    console.log('Uploading to path:', filePath);

    // Upload file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('menu')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('menu')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

export async function deleteImage(path: string): Promise<void> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('You must be logged in to delete images');
    }

    // Extract the file path from the URL
    const urlParts = path.split('/');
    const bucketIndex = urlParts.indexOf('menu');
    if (bucketIndex === -1) {
      throw new Error('Invalid image URL format');
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    // Verify the file belongs to the current user
    if (!filePath.includes(`/items/${user.id}/`)) {
      throw new Error('You can only delete your own images');
    }

    console.log('Deleting image at path:', filePath);

    const { error } = await supabase.storage
      .from('menu')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Error deleting image: ${error.message}`);
    }

    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw error;
  }
}

export async function getSupabaseSession() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  return { session, supabase };
} 