"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/supabase";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onError?: (error: Error) => void;
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [retryFile, setRetryFile] = useState<File | null>(null);

  const handleUpload = async (file: File) => {
      try {
        setIsUploading(true);
      setUploadError(null);
      toast.info("Uploading image...");

        const publicUrl = await uploadImage(file);
        onChange(publicUrl);
        toast.success("Image uploaded successfully");
      setRetryFile(null);
      } catch (error) {
      console.error("Error in handleUpload:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
        toast.error(errorMessage);
      setUploadError(error as Error);
      setRetryFile(file);
        onError?.(error as Error);
      } finally {
        setIsUploading(false);
      }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        toast.error("No file selected");
        return;
      }

      await handleUpload(file);
    },
    [onChange, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const removeImage = () => {
    onChange("");
    setUploadError(null);
    setRetryFile(null);
  };

  const retryUpload = async () => {
    if (retryFile) {
      await handleUpload(retryFile);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${value ? "cursor-default" : "cursor-pointer hover:border-primary/50"}
          transition-colors
        `}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading image...</p>
          </div>
        ) : uploadError ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-center">
              <p className="text-sm font-medium text-destructive">Upload failed</p>
              <p className="text-xs text-muted-foreground mt-1">{uploadError.message}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                retryUpload();
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Upload
            </Button>
          </div>
        ) : value ? (
          <div className="relative aspect-video">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragActive ? "Drop the image here" : "Drag & drop an image"}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to select a file
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported: JPG, PNG, WebP (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 