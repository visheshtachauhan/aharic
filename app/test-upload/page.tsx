"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestUploadPage() {
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Test Image Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
            />
            
            {imageUrl && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Image URL:</h3>
                <p className="text-sm text-muted-foreground break-all">
                  {imageUrl}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 