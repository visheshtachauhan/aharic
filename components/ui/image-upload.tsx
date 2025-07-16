"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/supabase/storage";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const url = await uploadImage(file);
        onChange(url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Image upload failed.");
      } finally {
        setIsLoading(false);
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        await handleUpload(file);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
    noClick: true,
    noKeyboard: true,
  });

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove?.();
    onChange("");
  };

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      } ${className}`}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        </div>
      ) : value ? (
        <div className="relative h-40 rounded-lg overflow-hidden">
          <Image
            src={value}
            alt="Uploaded image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 z-10">
             <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={open}
                className="h-7 w-7"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40" onClick={open}>
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
}