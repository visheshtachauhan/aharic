# Menu Management System

## Image Setup Instructions

1. Create a default food image:
   - Save a simple food image as `public/images/default-food.jpg`
   - This will be used as the fallback for all menu items

2. Create category images:
   - Save category-specific images in `public/images/categories/`
   - Required images:
     - appetizers.jpg
     - soups.jpg
     - salads.jpg
     - main-course.jpg
     - breads.jpg
     - rice-noodles.jpg
     - desserts.jpg
     - beverages.jpg
     - sides.jpg
     - specials.jpg

3. Image Guidelines:
   - Use JPG format for better compatibility
   - Recommended size: 600x400 pixels
   - Maximum file size: 5MB per image

4. Uploaded images:
   - All uploaded images will be stored in `public/uploads/`
   - They will be automatically renamed with unique IDs

## Usage

1. When adding a new menu item:
   - You can upload a custom image
   - If upload fails, the system will use the category image
   - If category image is missing, it will use the default food image

2. The system will automatically handle:
   - Image uploads
   - Fallback images
   - Image optimization
   - Error recovery 