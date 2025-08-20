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
    image: "/images/placeholders/main-course.png",
    isAvailable: true
  },
  {
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in spiced yogurt",
    price: 280,
    category: "Starters",
    image: "/images/placeholders/starters.png",
    isAvailable: true
  },
  {
    name: "Dal Makhani",
    description: "Creamy black lentils slow-cooked overnight",
    price: 240,
    category: "Main Course",
    image: "/images/placeholders/main-course.png",
    isAvailable: true
  },
  {
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in sugar syrup",
    price: 120,
    category: "Desserts",
    image: "/images/placeholders/desserts.png",
    isAvailable: true
  },
  {
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potatoes",
    price: 180,
    category: "Breakfast",
    image: "/images/placeholders/breakfast.png",
    isAvailable: true
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant rice layered with spiced chicken and aromatics",
    price: 340,
    category: "Main Course",
    image: "/images/placeholders/main-course.png",
    isAvailable: true
  },
  {
    name: "Mango Lassi",
    description: "Refreshing yogurt drink blended with sweet mangoes",
    price: 120,
    category: "Beverages",
    image: "/images/placeholders/beverages.png",
    isAvailable: true
  },
  {
    name: "Garlic Naan",
    description: "Tandoor-baked flatbread topped with garlic and butter",
    price: 60,
    category: "Breads",
    image: "/images/placeholders/breads.png",
    isAvailable: true
  }
];

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'https://aaharic.me';

async function addDummyMenuItems() {
  let successCount = 0;
  let failureCount = 0;

  for (const item of dummyMenuItems) {
    try {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();

      if (data.success) {
        successCount++;
      } else {
        failureCount++;
      }
    } catch (error) {
      failureCount++;
    }
  }
}

addDummyMenuItems();