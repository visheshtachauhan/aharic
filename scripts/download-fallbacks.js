const https = require('https');
const fs = require('fs');
const path = require('path');

const categories = [
  'appetizers',
  'soups',
  'salads',
  'main-course',
  'breads',
  'rice-noodles',
  'desserts',
  'beverages',
  'sides',
  'specials',
  'default'
];

const fallbackDir = path.join(process.cwd(), 'public', 'images', 'fallback');

// Create fallback directory if it doesn't exist
if (!fs.existsSync(fallbackDir)) {
  fs.mkdirSync(fallbackDir, { recursive: true });
}

// Download image for each category
categories.forEach(category => {
  const filename = `${category}.jpg`;
  const filepath = path.join(fallbackDir, filename);

  // Skip if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`Skipping ${filename} - already exists`);
    return;
  }

  // Create a write stream
  const file = fs.createWriteStream(filepath);

  // Download the image
  https.get(`https://placehold.co/600x400/e2e8f0/64748b.jpg?text=${category}`, response => {
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', err => {
    fs.unlink(filepath, () => {}); // Delete the file if download failed
    console.error(`Error downloading ${filename}:`, err.message);
  });
}); 