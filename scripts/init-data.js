const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const restaurants = db.collection('restaurants');

    // Create sample restaurant
    const sampleRestaurant = {
      name: "Spice Garden",
      description: "Authentic Indian cuisine in a modern setting",
      address: "123 Main Street, City",
      phone: "+1 234 567 8900",
      email: "contact@spicegarden.com",
      cuisine: "Indian",
      rating: 4.5,
      reviews: 128,
      image: "/images/restaurant-cover.jpg",
      isOpen: true,
      tables: [
        {
          number: "T1",
          capacity: 4,
          status: "available"
        },
        {
          number: "T2",
          capacity: 2,
          status: "available"
        }
      ],
      menuItems: [
        {
          name: "Butter Chicken",
          description: "Tender chicken in rich, creamy tomato sauce",
          price: 299,
          image: "/images/butter-chicken.jpg",
          category: "Main Course",
          isVegetarian: false,
          isAvailable: true
        },
        {
          name: "Paneer Tikka",
          description: "Grilled cottage cheese marinated in spiced yogurt",
          price: 249,
          image: "/images/paneer-tikka.jpg",
          category: "Starters",
          isVegetarian: true,
          isAvailable: true
        }
      ],
      openingHours: {
        monday: { open: "11:00", close: "22:00" },
        tuesday: { open: "11:00", close: "22:00" },
        wednesday: { open: "11:00", close: "22:00" },
        thursday: { open: "11:00", close: "22:00" },
        friday: { open: "11:00", close: "23:00" },
        saturday: { open: "11:00", close: "23:00" },
        sunday: { open: "12:00", close: "22:00" }
      }
    };

    // Delete existing data
    await restaurants.deleteMany({});

    // Insert sample restaurant
    const result = await restaurants.insertOne(sampleRestaurant);
    console.log(`Created restaurant with ID: ${result.insertedId}`);

  } finally {
    await client.close();
  }
}

main().catch(console.error); 