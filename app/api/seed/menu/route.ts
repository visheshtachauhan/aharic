import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

const initialMenuItems = [
  // Appetizers
  {
    name: "Crispy Spring Rolls",
    description: "Hand-rolled crispy spring rolls filled with vegetables and glass noodles, served with sweet chili sauce",
    price: 199,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1544591892-0b6c4f79e331",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Spicy Chicken Wings",
    description: "Crispy chicken wings tossed in our signature hot sauce, served with blue cheese dip",
    price: 299,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d",
    isVegetarian: false,
    isSpicy: true,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Paneer Tikka",
    description: "Marinated cottage cheese cubes grilled to perfection with bell peppers and onions",
    price: 249,
    category: "Appetizers",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
    isVegetarian: true,
    isSpicy: true,
    isBestSeller: false,
    isAvailable: true
  },

  // Main Course
  {
    name: "Butter Chicken",
    description: "Tender chicken pieces in rich tomato-based creamy curry, a classic favorite",
    price: 399,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
    isVegetarian: false,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Palak Paneer",
    description: "Fresh cottage cheese cubes in a creamy spinach gravy",
    price: 299,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: false,
    isAvailable: true
  },
  {
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon fillet grilled with herbs, served with sautéed vegetables",
    price: 599,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369",
    isVegetarian: false,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },

  // Pizza
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    price: 299,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Pepperoni Supreme",
    description: "Loaded with pepperoni, bell peppers, olives, and extra cheese",
    price: 399,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    isVegetarian: false,
    isSpicy: true,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Grilled chicken, red onions, and bell peppers with BBQ sauce",
    price: 449,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    isVegetarian: false,
    isSpicy: false,
    isBestSeller: false,
    isAvailable: true
  },

  // Pasta
  {
    name: "Alfredo Pasta",
    description: "Creamy fettuccine pasta with parmesan cheese sauce",
    price: 299,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023402c",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Arrabbiata Penne",
    description: "Spicy tomato sauce with garlic and red chilies",
    price: 279,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
    isVegetarian: true,
    isSpicy: true,
    isBestSeller: false,
    isAvailable: true
  },
  {
    name: "Seafood Pasta",
    description: "Mixed seafood in white wine sauce with linguine",
    price: 499,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
    isVegetarian: false,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },

  // Burgers
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with cheddar cheese, lettuce, and special sauce",
    price: 249,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    isVegetarian: false,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Spicy Chicken Burger",
    description: "Crispy chicken fillet with spicy mayo and pickled jalapeños",
    price: 229,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9",
    isVegetarian: false,
    isSpicy: true,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Veggie Supreme Burger",
    description: "Plant-based patty with avocado, lettuce, and vegan cheese",
    price: 199,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: false,
    isAvailable: true
  },

  // Desserts
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 199,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "New York Cheesecake",
    description: "Classic baked cheesecake with berry compote",
    price: 179,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Tiramisu",
    description: "Italian coffee-flavored dessert with mascarpone cheese",
    price: 219,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: false,
    isAvailable: true
  },

  // Beverages
  {
    name: "Fresh Lime Soda",
    description: "Refreshing lime soda with mint leaves",
    price: 99,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Mango Lassi",
    description: "Sweet yogurt drink with fresh mango pulp",
    price: 129,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Cold Coffee",
    description: "Blended coffee with ice cream and chocolate sauce",
    price: 149,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: false,
    isAvailable: true
  },

  // Salads
  {
    name: "Greek Salad",
    description: "Fresh vegetables with feta cheese and olives in vinaigrette",
    price: 199,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce with parmesan, croutons, and caesar dressing",
    price: 219,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
    isVegetarian: false,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Quinoa Buddha Bowl",
    description: "Healthy bowl with quinoa, roasted vegetables, and tahini dressing",
    price: 249,
    category: "Salads",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: false,
    isAvailable: true
  },

  // Sides
  {
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    price: 129,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "French Fries",
    description: "Crispy golden fries with special seasoning",
    price: 149,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: true,
    isAvailable: true
  },
  {
    name: "Onion Rings",
    description: "Crispy battered onion rings with dipping sauce",
    price: 169,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1639024471283-03bce29b31a3",
    isVegetarian: true,
    isSpicy: false,
    isBestSeller: false,
    isAvailable: true
  },
  {
    name: "Masala Papad",
    description: "Crispy lentil wafers topped with spiced onions and tomatoes",
    price: 79,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979",
    isVegetarian: true,
    isSpicy: true,
    isBestSeller: false,
    isAvailable: true
  }
];

export async function GET() {
  try {
    const db = await connectToDatabase();
    
    // Clear existing menu items
    await db.collection('menu').deleteMany({});
    
    // Add timestamps to each item
    const itemsWithTimestamps = initialMenuItems.map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert new menu items
    const result = await db.collection('menu').insertMany(itemsWithTimestamps);
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} menu items`,
      count: result.insertedCount
    });
  } catch (error) {
    console.error('Error seeding menu items:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to seed menu items'
    }, { status: 500 });
  }
} 