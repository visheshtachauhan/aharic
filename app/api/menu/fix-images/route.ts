import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MongoClient, ObjectId } from 'mongodb'; // Import MongoClient and ObjectId
import { createClient } from '@supabase/supabase-js'; // Import Supabase client
import fetch from 'node-fetch'; // Import node-fetch

// Initialize Supabase client for server-side operations
// Use a service role key if needed for higher permissions, but be cautious!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// Helper function to fetch image data from a URL
async function fetchImageData(url: string): Promise<{ data: Buffer, contentType: string } | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image from ${url}: ${response.statusText}`);
      return null;
    }
    // Basic content type detection from headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
        console.error(`Fetched data is not an image from ${url}. Content-Type: ${contentType}`);
        return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return { data: Buffer.from(arrayBuffer), contentType };
  } catch (error) {
    console.error(`Error fetching image from ${url}:`, error);
    return null;
  }
}

// Helper function to upload image data to Supabase
async function uploadImageToSupabase(imageData: Buffer, fileName: string, contentType: string): Promise<string | null> {
  try {
    const filePath = fileName; // Use original file name or generate a new one
    // Attempt to upload with detected content type
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(filePath, imageData, {
        cacheControl: '3600',
        upsert: true, // Use upsert: true to potentially overwrite if filename generation isn't perfect
        contentType: contentType,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      // Handle specific Supabase errors like duplicate files if upsert is false
      // For now, log and return null on any upload error.
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(data.path);

    if (!publicUrlData || !publicUrlData.publicUrl) {
         console.error('Supabase did not return a public URL after upload.');
         return null;
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    return null;
  }
}

export async function POST(request: Request) {
  let client: MongoClient; // Use MongoClient type
  let db;

  try {
    // Connect to the database using the shared connection logic
    const mongoConnection = await connectToDatabase(); 
    // connectToDatabase is expected to return the MongoClient instance or equivalent
    // If it returns the DB directly, adjust this part.
    // Assuming connectToDatabase now returns the MongoClient based on our previous read.
    if (!mongoConnection || !(mongoConnection instanceof MongoClient)) {
        throw new Error("Failed to connect to MongoDB using connectToDatabase.");
    }
    client = mongoConnection;
    db = client.db(); // Get the database instance

    const menuItems = await db.collection('menu_items').find({}).toArray();
    const fixedItems: any[] = [];
    const failedItems: any[] = [];

    for (const item of menuItems) {
      const oldImageUrl = item.image;

      // Check if the image URL looks like an old/external HTTP URL
      // Also ensure it doesn't already look like a Supabase URL
      if (oldImageUrl && typeof oldImageUrl === 'string' && oldImageUrl.startsWith('http') && !oldImageUrl.includes(supabaseUrl.split('//')[1])) {
        console.log(`Attempting to fix image for item: ${item.name || item._id} with URL: ${oldImageUrl}`);
        
        const fetchedData = await fetchImageData(oldImageUrl);

        if (fetchedData) {
          // Generate a file name: use original filename from URL if available, otherwise create a generic one
          const urlParts = oldImageUrl.split('/');
          let originalFileName = urlParts[urlParts.length - 1];
          // Remove query parameters or fragments from filename
          originalFileName = originalFileName.split('?')[0].split('#')[0];

          // Generate a unique filename with a prefix
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8); // Shorter random string
          const fileName = originalFileName ? `fixed-${timestamp}-${randomString}-${originalFileName}` : `fixed-${timestamp}-${randomString}.jpg`; // Fallback filename

          const newImageUrl = await uploadImageToSupabase(fetchedData.data, fileName, fetchedData.contentType);

          if (newImageUrl) {
            console.log(`New Supabase URL for item ${item._id}: ${newImageUrl}`);
            // Update the item in the database with the new Supabase URL
            const result = await db.collection('menu_items').updateOne(
              { _id: item._id },
              { $set: { image: newImageUrl, updatedAt: new Date().toISOString() } }
            );

            if (result.modifiedCount > 0) {
              console.log(`Successfully updated database for item: ${item.name || item._id}`);
              fixedItems.push(item._id);
            } else {
              console.warn(`Did not modify database entry for item ${item._id} after image fix attempt.`);
              // Item might have been updated by another process or no change was needed?
              failedItems.push(item._id); // Consider this a failure if DB wasn't updated
            }
          } else {
            console.error(`Failed to upload image to Supabase for item: ${item.name || item._id}. No new URL generated.`);
            failedItems.push(item._id);
          }
        } else {
          console.error(`Failed to fetch image data from URL: ${oldImageUrl} for item: ${item.name || item._id}.`);
          failedItems.push(item._id);
        }
      } else {
          // Image URL is already a Supabase URL, is missing, or not an external http URL, skip.
          // console.log(`Skipping item ${item.name || item._id}: Image URL looks okay, is missing, or not external.`);
      }
    }

    console.log(`Image fix process finished. Fixed: ${fixedItems.length}, Failed: ${failedItems.length}`);

    return NextResponse.json({
      success: true,
      message: 'Attempted to fix images',
      fixedCount: fixedItems.length,
      failedCount: failedItems.length,
      failedItems: failedItems
    });

  } catch (error) {
    console.error('Error in fix-images API route:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to fix images' 
    }, { status: 500 });
  } finally {
     // Connection closing logic might be needed here depending on connectToDatabase implementation
     // If connectToDatabase returns a new client or promise each time, close it.
     // If it manages a global cached client, do NOT close it here.
     // Assuming connectToDatabase handles lifecycle for now.
  }
}

// Add a GET method as well for basic access/testing if needed (optional)
export async function GET() {
    return NextResponse.json({ message: "POST to this endpoint to fix images." });
} 