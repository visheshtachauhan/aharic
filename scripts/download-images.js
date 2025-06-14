const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const images = [
  {
    name: 'restaurant-cover.jpg',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    width: 1200,
    height: 800
  },
  {
    name: 'pizza-paradise.jpg',
    url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
    width: 1200,
    height: 800
  },
  {
    name: 'sushi-master.jpg',
    url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    width: 1200,
    height: 800
  },
  {
    name: 'spice-garden.jpg',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    width: 1200,
    height: 800
  },
  {
    name: 'butter-chicken.jpg',
    url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
    width: 800,
    height: 600
  },
  {
    name: 'biryani.jpg',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
    width: 800,
    height: 600
  },
  {
    name: 'paneer-tikka.jpg',
    url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
    width: 800,
    height: 600
  },
  {
    name: 'mango-lassi.jpg',
    url: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c',
    width: 800,
    height: 600
  }
];

async function downloadAndProcessImage(image) {
  try {
    const response = await axios({
      url: image.url,
      responseType: 'arraybuffer'
    });
    
    const outputPath = path.join(__dirname, '..', 'public', 'images', image.name);
    
    await sharp(response.data)
      .resize(image.width, image.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`Successfully processed ${image.name}`);
  } catch (error) {
    console.error(`Error processing ${image.name}:`, error.message);
  }
}

async function main() {
  try {
    // Ensure the images directory exists
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    await fs.mkdir(imagesDir, { recursive: true });
    
    // Download and process all images
    await Promise.all(images.map(downloadAndProcessImage));
    console.log('All images processed successfully');
  } catch (error) {
    console.error('Error processing images:', error.message);
  }
}

main(); 