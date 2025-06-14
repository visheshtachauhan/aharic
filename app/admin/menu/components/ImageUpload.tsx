import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { ImagePlus, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { CATEGORY_FALLBACKS, DEFAULT_FALLBACK, Category } from '../constants';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  category: Category;
  onImageChange: (url: string) => void;
  existingImage?: string;
}

export function ImageUpload({ category, onImageChange, existingImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(existingImage || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      if (data.success && data.url) {
        setPreview(data.url);
        onImageChange(data.url);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      // Keep existing image if available
      if (existingImage) {
        setPreview(existingImage);
        onImageChange(existingImage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    await handleUpload(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    noClick: true // Disable click to prevent double triggers
  });

  const displayImage = preview || existingImage || CATEGORY_FALLBACKS[category] || DEFAULT_FALLBACK;

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-6 
        transition-colors duration-200
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
      `}
    >
      <input {...getInputProps()} />
      
      {isUploading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Uploading image...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayImage && (
            <div className="relative w-full h-[200px] rounded-md overflow-hidden">
              <Image
                src={displayImage}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => {
                  const fallbackUrl = CATEGORY_FALLBACKS[category] || DEFAULT_FALLBACK;
                  setPreview(fallbackUrl);
                  onImageChange(fallbackUrl);
                }}
              />
            </div>
          )}
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={open}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              {isDragActive ? (
                <span className="font-medium text-primary">Drop your image here</span>
              ) : (
                <>
                  Drag & drop your image here, or click choose file
                  <br />
                  <span className="text-xs">
                    Supported: JPG, PNG, WEBP (max 5MB)
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 