import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { CATEGORY_IMAGES, DEFAULT_IMAGE } from '@/app/admin/menu/constants';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function ensureUploadDirectory() {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    return false;
  }
}

async function processAndSaveImage(buffer: Buffer): Promise<string | null> {
  try {
    // Process image with sharp
    const processedBuffer = await sharp(buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${random}.jpg`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Save the file
    await writeFile(filePath, processedBuffer);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Failed to process or save image:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // Ensure upload directory exists
    const dirReady = await ensureUploadDirectory();
    if (!dirReady) {
      return NextResponse.json({ 
        success: true, 
        url: DEFAULT_IMAGE 
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;

    // Validate file
    if (!file) {
      return NextResponse.json({ 
        success: true,
        url: category ? CATEGORY_IMAGES[category] || DEFAULT_IMAGE : DEFAULT_IMAGE
      });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        success: true,
        url: category ? CATEGORY_IMAGES[category] || DEFAULT_IMAGE : DEFAULT_IMAGE
      });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process and save image
    const fileUrl = await processAndSaveImage(buffer);
    if (!fileUrl) {
      return NextResponse.json({ 
        success: true,
        url: category ? CATEGORY_IMAGES[category] || DEFAULT_IMAGE : DEFAULT_IMAGE
      });
    }

    return NextResponse.json({ 
      success: true,
      url: fileUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: true,
      url: DEFAULT_IMAGE
    });
  }
} 