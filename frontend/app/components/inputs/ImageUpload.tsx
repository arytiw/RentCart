'use client';

import Image from "next/image";
import { useCallback, useState, useRef } from "react";
import { TbPhotoPlus } from 'react-icons/tb'

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    console.log("File selected:", file.name, file.size);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    setUploadError("");
    
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      
      console.log("Image uploaded successfully:", data.url);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
    }
  }, [onChange]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative
          cursor-pointer
          hover:opacity-70
          transition
          border-dashed 
          border-2 
          p-20 
          flex
          flex-col
          justify-center
          items-center
          gap-4
          text-neutral-600
          ${isDragOver ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'}
          ${value ? 'border-green-500' : ''}
        `}
      >
        <TbPhotoPlus
          size={50}
          className={isDragOver ? 'text-rose-500' : ''}
        />
        <div className="font-semibold text-lg text-center">
          {isDragOver ? "Drop your image here" : "Click to upload"}
        </div>
        <div className="text-sm text-neutral-500 text-center">
          Drag and drop or click to select image
        </div>
        <div className="text-xs text-neutral-400 text-center">
          Supports: JPG, PNG, GIF, WebP (Max 10MB)
        </div>
        
        {uploadError && (
          <div className="text-red-500 text-sm text-center">
            {uploadError}
          </div>
        )}
        
        {value && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              fill 
              style={{ objectFit: 'cover' }} 
              src={value} 
              alt="Uploaded image" 
            />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {value && (
        <div className="text-sm text-green-600 text-center">
          ✓ Image uploaded successfully
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
