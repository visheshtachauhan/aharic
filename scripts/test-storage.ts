import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      throw bucketsError;
    }

    console.log('Available buckets:', buckets);

    // Check if menu-images bucket exists
    const menuImagesBucket = buckets.find(b => b.name === 'menu-images');
    
    if (!menuImagesBucket) {
      console.log('Creating menu-images bucket...');
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
      console.log('Created menu-images bucket');
    } else {
      console.log('menu-images bucket exists:', menuImagesBucket);
    }

    // List files in the bucket
    const { data: files, error: filesError } = await supabase
      .storage
      .from('menu-images')
      .list();

    if (filesError) {
      throw filesError;
    }

    console.log('Files in bucket:', files);

  } catch (error) {
    console.error('Error testing storage:', error);
  }
}

testStorage(); 