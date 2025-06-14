import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeStorage() {
  try {
    // Create the menu-images bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      throw bucketsError;
    }

    const menuImagesBucket = buckets.find(b => b.name === 'menu-images');

    if (!menuImagesBucket) {
      const { error: createError } = await supabase
        .storage
        .createBucket('menu-images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        });

      if (createError) {
        throw createError;
      }
    }

    // Set up RLS policies using SQL
    const { error: policyError } = await supabase.rpc('create_storage_policy', {
      bucket_name: 'menu-images',
      policy_name: 'Public Access',
      policy_definition: {
        role: 'anon',
        operation: 'SELECT'
      }
    });

    if (policyError) {
      throw policyError;
    }

    console.log('Successfully initialized Supabase storage');
  } catch (error) {
    console.error('Error initializing Supabase storage:', error);
    process.exit(1);
  }
}

initializeStorage(); 