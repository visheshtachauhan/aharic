const { MongoClient, ObjectId } = require('mongodb');

async function seed() {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('qr-menu-system');

    // Create sample restaurant
    const restaurant = {
      _id: new ObjectId(),
      name: 'Sample Restaurant',
      description: 'A great place to dine',
      address: '123 Main St',
      phone: '555-0123',
      email: 'contact@samplerestaurant.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('restaurants').insertOne(restaurant);
    console.log('Created restaurant:', restaurant._id.toString());

    // Create sample tables
    const tables = [
      {
        _id: new ObjectId(),
        restaurantId: restaurant._id,
        number: '1',
        capacity: 4,
        status: 'available',
        location: {
          floor: '1st Floor',
          section: 'Main',
          description: 'Near window'
        },
        qrCode: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        restaurantId: restaurant._id,
        number: '2',
        capacity: 2,
        status: 'occupied',
        location: {
          floor: '1st Floor',
          section: 'Main',
          description: 'Near bar'
        },
        qrCode: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('tables').insertMany(tables);
    console.log('Created tables');

    await client.close();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 