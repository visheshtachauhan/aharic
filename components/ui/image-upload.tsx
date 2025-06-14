"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { uploadImage, deleteImage } from '@/lib/supabase';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onError?: (error: Error) => void;
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        if (!file) {
          console.log("No file selected");
          return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error('File size must be less than 5MB');
        }

        console.log("Starting upload for file:", file.name);
        setIsUploading(true);

        // If there's an existing image, delete it first
        if (value) {
          try {
            await deleteImage(value);
          } catch (error) {
            console.warn("Failed to delete existing image:", error);
            // Continue with upload even if delete fails
          }
        }

        const publicUrl = await uploadImage(file);
        onChange(publicUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error in onDrop:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
        toast.error(errorMessage);
        onError?.(error as Error);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, onError, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const removeImage = async () => {
    try {
      if (!value) return;

      setIsUploading(true);
      await deleteImage(value);
      onChange("");
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to remove image";
      toast.error(errorMessage);
      onError?.(error as Error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : isDragActive ? (
          <p className="text-sm text-muted-foreground">Drop the image here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, WebP (max 5MB)
            </p>
          </div>
        )}
      </div>

      {value && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={value}
            alt="Uploaded image"
            className="h-full w-full object-cover"
          />
          <button
            onClick={removeImage}
            disabled={isUploading}
            className="absolute top-2 right-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 