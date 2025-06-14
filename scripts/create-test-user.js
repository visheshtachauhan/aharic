require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const dbName = process.env.MONGODB_DB || 'tastycorner';

async function createTestUser() {
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
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('users');

    // Create a test restaurant
    const restaurantCollection = db.collection('restaurants');
    const restaurant = {
      name: 'The Tasty Corner',
      address: '123 Food Street',
      phone: '+1234567890',
      email: 'contact@tastycorner.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const restaurantResult = await restaurantCollection.insertOne(restaurant);
    console.log('Created test restaurant');

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create the test user
    const testUser = {
      email: 'owner@tastycorner.com',
      password: hashedPassword,
      role: 'restaurant_owner',
      restaurantId: restaurantResult.insertedId.toString(),
      restaurantName: 'The Tasty Corner',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if user already exists
    const existingUser = await collection.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Test user already exists, updating...');
      await collection.updateOne(
        { email: testUser.email },
        { $set: testUser }
      );
    } else {
      console.log('Creating new test user...');
      await collection.insertOne(testUser);
    }

    console.log('\nTest Account Created:');
    console.log('Email:', testUser.email);
    console.log('Password: password123');
    console.log('Role:', testUser.role);
    console.log('Restaurant:', testUser.restaurantName);

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
createTestUser()
  .catch(console.error)
  .finally(() => process.exit()); 