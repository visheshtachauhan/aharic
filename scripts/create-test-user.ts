import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Restaurant } from '@/models/Restaurant';

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await Restaurant.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('test123456', 10);

    // Create test user
    const testUser = await Restaurant.create({
      _id: 'test123',
      name: 'Test Restaurant',
      email: 'test@example.com',
      password: hashedPassword,
      phone: '+1234567890',
      address: '123 Test St, Test City',
      cuisine: 'Test Cuisine',
    });

    console.log('Test user created successfully:', testUser);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUser(); 