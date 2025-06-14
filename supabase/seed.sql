-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  isVeg BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  spicyLevel INTEGER DEFAULT 1,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  position INTEGER DEFAULT 0
);

-- Insert sample menu items
INSERT INTO menu_items (id, name, description, price, category, image, isVeg, popular, spicyLevel, rating, reviews, available, created_at, position) VALUES
('1', 'Butter Chicken', 'Tender chicken in a rich, creamy tomato-based curry sauce', 18.99, 'Main Course', 'https://svqjenzgpypmcxdfbhxo.supabase.co/storage/v1/object/public/menu-images/butter-chicken.jpg', false, true, 2, 4.5, 120, true, NOW(), 0),
('2', 'Paneer Tikka', 'Grilled cottage cheese with Indian spices', 14.99, 'Appetizers', 'https://svqjenzgpypmcxdfbhxo.supabase.co/storage/v1/object/public/menu-images/paneer-tikka.jpg', true, true, 1, 4.7, 85, true, NOW(), 1),
('3', 'Garlic Naan', 'Soft bread baked with garlic and butter', 4.99, 'Indian Breads', 'https://svqjenzgpypmcxdfbhxo.supabase.co/storage/v1/object/public/menu-images/garlic-naan.jpg', true, false, 0, 4.3, 200, true, NOW(), 2); 