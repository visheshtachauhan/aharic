const fetch = require('node-fetch');
require('dotenv').config();

/**
 * @typedef {Object} MenuItem
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} category
 * @property {string} image
 * @property {boolean} isAvailable
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} [message]
 * @property {string} [itemId]
 */

/** @type {MenuItem[]} */
const dummyMenuItems = [
  {
    name: "Butter Chicken",
    description: "Tender chicken pieces in rich, creamy tomato gravy",
    price: 320,
    category: "Main Course",
    image: "https://res.cloudinary.com/demo/image/upload/butter-chicken.jpg",
    isAvailable: true
  },
  {
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in spiced yogurt",
    price: 280,
    category: "Starters",
    image: "https://res.cloudinary.com/demo/image/upload/paneer-tikka.jpg",
    isAvailable: true
  },
  {
    name: "Dal Makhani",
    description: "Creamy black lentils slow-cooked overnight",
    price: 240,
    category: "Main Course",
    image: "https://res.cloudinary.com/demo/image/upload/dal-makhani.jpg",
    isAvailable: true
  },
  {
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in sugar syrup",
    price: 120,
    category: "Desserts",
    image: "https://res.cloudinary.com/demo/image/upload/gulab-jamun.jpg",
    isAvailable: true
  },
  {
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potatoes",
    price: 180,
    category: "Breakfast",
    image: "https://res.cloudinary.com/demo/image/upload/masala-dosa.jpg",
    isAvailable: true
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant rice layered with spiced chicken and aromatics",
    price: 340,
    category: "Main Course",
    image: "https://res.cloudinary.com/demo/image/upload/biryani.jpg",
    isAvailable: true
  },
  {
    name: "Mango Lassi",
    description: "Refreshing yogurt drink blended with sweet mangoes",
    price: 120,
    category: "Beverages",
    image: "https://res.cloudinary.com/demo/image/upload/mango-lassi.jpg",
    isAvailable: true
  },
  {
    name: "Garlic Naan",
    description: "Tandoor-baked flatbread topped with garlic and butter",
    price: 60,
    category: "Breads",
    image: "https://res.cloudinary.com/demo/image/upload/naan.jpg",
    isAvailable: true
  }
];

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function addDummyMenuItems() {
  console.log('Starting to add dummy menu items...');
  let successCount = 0;
  let failureCount = 0;

  for (const item of dummyMenuItems) {
    try {
      const response = await fetch(`${baseUrl}/api/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();

      if (data.success) {
        console.log(`Successfully added menu item: ${item.name}`);
        successCount++;
      } else {
        console.error(`Failed to add menu item ${item.name}: ${data.message}`);
        failureCount++;
      }
    } catch (error) {
      console.error(`Error adding menu item ${item.name}:`, error);
      failureCount++;
    }
  }

  console.log(`\nSummary:`);
  console.log(`Successfully added: ${successCount} items`);
  console.log(`Failed to add: ${failureCount} items`);
}

addDummyMenuItems().catch(console.error); 