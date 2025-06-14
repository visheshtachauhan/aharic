require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const dbName = process.env.MONGODB_DB || 'tastycorner';

const dummyMenuItems = [
  {
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in rich buttery tomato gravy',
    price: 450,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese pieces with spices',
    price: 350,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Chicken Biryani',
    description: 'Fragrant rice cooked with chicken and aromatic spices',
    price: 400,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function addDummyMenuItems() {
  const client = new MongoClient(uri, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50,
    minPoolSize: 0,
    ssl: true,
    authSource: 'admin',
    retryWrites: true,
    w: 'majority'
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('menu_items');

    // Test database read before proceeding
    console.log('Testing database read...');
    await collection.findOne({});
    console.log('Database read test successful');

    // Clear existing menu items
    console.log('Clearing existing menu items...');
    await collection.deleteMany({});
    console.log('Existing menu items cleared');

    let successCount = 0;
    let failureCount = 0;

    // Add new menu items
    console.log('Adding new menu items...');
    for (const item of dummyMenuItems) {
      try {
        await collection.insertOne(item);
        successCount++;
        console.log(`Successfully added: ${item.name}`);
      } catch (err) {
        failureCount++;
        console.error(`Failed to add ${item.name}:`, err.message);
      }
    }

    console.log('\nSummary:');
    console.log(`Successfully added: ${successCount} items`);
    console.log(`Failed to add: ${failureCount} items`);

  } catch (err) {
    console.error('Error occurred:', err);
    throw err;
  } finally {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
addDummyMenuItems()
  .catch(console.error)
  .finally(() => process.exit()); 