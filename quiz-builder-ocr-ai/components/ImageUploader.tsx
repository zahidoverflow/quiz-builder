
import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUrl: string) => void;
  imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(file, e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {imageUrl ? (
        <div className="mt-4 group relative">
            <img src={imageUrl} alt="Uploaded quiz" className="w-full h-auto rounded-lg shadow-inner" />
            <div 
                onClick={handleAreaClick}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
            >
                <span className="text-white font-semibold">Change Image</span>
            </div>
        </div>
      ) : (
        <div
          onClick={handleAreaClick}
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <span className="relative rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                Click to upload
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
};
