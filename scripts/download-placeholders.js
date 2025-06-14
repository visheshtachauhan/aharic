const https = require('https');
const fs = require('fs');
const path = require('path');

// Categories from our app (should match app/admin/menu/constants.ts)
const categories = [
  'Appetizers',
  'Soups',
  'Salads',
  'Main Course',
  'Breads',
  'Rice & Noodles',
  'Desserts',
  'Beverages',
  'Sides',
  'Specials',
  'Default'
];

// Common menu items
const menuItems = [
  'Spring Rolls',
  'Tandoori Chicken',
  'Chocolate Brownie',
  'Lime Soda',
  'Butter Chicken',
  'Paneer Tikka'
];

// Target directory
const placeholderDir = path.join(process.cwd(), 'public', 'images', 'placeholders');

// Create directory if it doesn't exist
if (!fs.existsSync(placeholderDir)) {
  fs.mkdirSync(placeholderDir, { recursive: true });
}

// Generate a placeholder image URL (using placeholder.com service)
function getPlaceholderUrl(text) {
  // Format the text for the URL
  const formattedText = text.replace(/\s+/g, '-').toLowerCase();
  return `https://placehold.co/600x400/e2e8f0/3f3f46.png?text=${formattedText}`;
}

// Download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filepath)) {
      console.log(`Skipping ${path.basename(filepath)} - already exists`);
      return resolve();
    }

    const file = fs.createWriteStream(filepath);
    
    https.get(url, response => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${path.basename(filepath)}`);
        resolve();
      });
      
      file.on('error', err => {
        fs.unlink(filepath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', err => {
      fs.unlink(filepath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Main function to download all placeholders
async function downloadPlaceholders() {
  try {
    // Download category placeholders
    for (const category of categories) {
      const filename = `${category.replace(/\s+/g, '-').toLowerCase()}.png`;
      const filepath = path.join(placeholderDir, filename);
      const url = getPlaceholderUrl(category);
      
      await downloadImage(url, filepath);
    }
    
    // Download menu item placeholders
    for (const item of menuItems) {
      const filename = `${item.replace(/\s+/g, '-').toLowerCase()}.png`;
      const filepath = path.join(placeholderDir, filename);
      const url = getPlaceholderUrl(item);
      
      await downloadImage(url, filepath);
    }
    
    console.log('All placeholder images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading placeholders:', error);
  }
}

// Run the download
downloadPlaceholders(); 