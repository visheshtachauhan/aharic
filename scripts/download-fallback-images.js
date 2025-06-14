const https = require('https');
const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  'appetizers',
  'soups',
  'salads',
  'main-course',
  'breads',
  'rice-and-noodles',
  'desserts',
  'beverages',
  'sides',
  'specials'
];

// Unsplash collection IDs for food images
const UNSPLASH_COLLECTION_IDS = {
  appetizers: '8562462',
  soups: '3687996',
  salads: '4393007',
  'main-course': '4393007',
  breads: '8562462',
  'rice-and-noodles': '4393007',
  desserts: '8562462',
  beverages: '3687996',
  sides: '4393007',
  specials: '4393007'
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
};

async function downloadFallbackImages() {
  const fallbackDir = path.join(process.cwd(), 'public', 'images', 'fallback');

  // Create fallback directory if it doesn't exist
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }

  // Download default fallback image
  await downloadImage(
    'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800',
    path.join(fallbackDir, 'default.jpg')
  );

  // Download category-specific fallback images
  for (const category of CATEGORIES) {
    const collectionId = UNSPLASH_COLLECTION_IDS[category];
    const imageUrl = `https://source.unsplash.com/collection/${collectionId}/800x600`;
    const filepath = path.join(fallbackDir, `${category}.jpg`);
    
    console.log(`Downloading fallback image for ${category}...`);
    try {
      await downloadImage(imageUrl, filepath);
      console.log(`✓ Downloaded ${category} fallback image`);
    } catch (error) {
      console.error(`✗ Failed to download ${category} fallback image:`, error);
    }
  }
}

downloadFallbackImages().catch(console.error); 