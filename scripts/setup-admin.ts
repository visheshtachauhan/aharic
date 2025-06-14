import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdmin() {
  try {
    // First, sign up the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@restaurant.com',
      password: 'Admin@1234',
      options: {
        data: {
          role: 'admin',
          full_name: 'Restaurant Admin'
        }
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    console.log('Admin user created successfully:', signUpData);

    // Sign in to create the profile
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@restaurant.com',
      password: 'Admin@1234'
    });

    if (signInError) {
      throw signInError;
    }

    console.log('Admin user signed in successfully:', signInData);

    // Create a profile for the admin user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: signInData.user.id,
          email: signInData.user.email,
          role: 'admin',
          full_name: 'Restaurant Admin'
        }
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // If profile already exists, that's okay
      if (!profileError.message.includes('duplicate key')) {
        throw profileError;
      }
    }

    console.log('Admin profile created successfully');
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

setupAdmin(); 