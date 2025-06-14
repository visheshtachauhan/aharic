require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const dbName = process.env.MONGODB_DB || 'tastycorner';

// Initialize Supabase client with service role key
const supabaseUrl = 'https://svqjenzgpypmcxdfbhxo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cWplbnpncHlwbWN4ZGZiaHhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ5NTM0OCwiZXhwIjoyMDY0MDcxMzQ4fQ.GoxhofQ0YMVHOVvb1W1VfttMMBTFKlHAsX4yrZBwRHg';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Sample menu items with reliable public image URLs
const menuItems = [
  {
    name: 'Classic Margherita Pizza',
    description: 'Fresh mozzarella, tomatoes, and basil on our signature thin crust',
    price: 12.99,
    category: 'Pizza & Pasta',
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
    isVeg: true,
    popular: true,
    spicyLevel: 1,
    rating: 4.5,
    reviews: 120,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Grilled Salmon Steak',
    description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
    price: 24.99,
    category: 'Main Course',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    isVeg: false,
    popular: true,
    spicyLevel: 1,
    rating: 4.8,
    reviews: 85,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 8.99,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    isVeg: true,
    popular: true,
    spicyLevel: 0,
    rating: 4.7,
    reviews: 95,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Fresh Fruit Smoothie',
    description: 'Blend of seasonal fruits with yogurt and honey',
    price: 6.99,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg',
    isVeg: true,
    popular: false,
    spicyLevel: 0,
    rating: 4.3,
    reviews: 65,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Garlic Parmesan Fries',
    description: 'Crispy fries tossed with garlic, parmesan, and herbs',
    price: 7.99,
    category: 'Sides',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
    isVeg: true,
    popular: true,
    spicyLevel: 1,
    rating: 4.6,
    reviews: 110,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function downloadAndUploadImage(imageUrl, itemName) {
  try {
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to download image');
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get file extension from URL
    const fileExt = imageUrl.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Generate a unique file name
    const timestamp = Date.now();
    const fileName = `${itemName.toLowerCase().replace(/\s+/g, '-')}.${fileExt}`;
    const filePath = `public/menu/items/admin/images/original/${timestamp}-${fileName}`;

    // Upload to Supabase
    const { error: uploadError, data } = await supabase.storage
      .from('menu-images')
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: `image/${fileExt}`
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    console.log(`Successfully uploaded image for ${itemName}`);
    return publicUrl;
  } catch (error) {
    console.error(`Error processing image for ${itemName}:`, error);
    return null;
  }
}

async function addMenuItems() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('menu');

    // First, let's clear existing items
    await collection.deleteMany({});
    console.log('Cleared existing menu items');

    // Process each menu item
    for (const item of menuItems) {
      // Download and upload the image
      const imageUrl = await downloadAndUploadImage(item.image, item.name);
      if (imageUrl) {
        item.image = imageUrl;
      }

      // Insert the menu item
      const result = await collection.insertOne(item);
      console.log(`Added menu item: ${item.name} with ID: ${result.insertedId}`);
    }

    console.log('Successfully added all menu items');
  } catch (error) {
    console.error('Error adding menu items:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addMenuItems().catch(console.error); 