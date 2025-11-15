import React, { useRef, useState, useEffect } from 'react';
import { UploadIcon, ImageIcon, DocumentTextIcon, CloseIcon, SpinnerIcon } from './Icons';

interface ImageUploaderProps {
  onFilesUpload: (files: File[]) => void;
  files: File[];
  onRemoveFile: (fileName: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesUpload, files, onRemoveFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  useEffect(() => {
    // When the parent component has updated the files list and passed it back down,
    // we can turn off the processing indicator. This handles the slight delay
    // of React state updates and re-renders.
    if (isProcessingFiles) {
      setIsProcessingFiles(false);
    }
  }, [files, isProcessingFiles]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setIsProcessingFiles(true);
      onFilesUpload(selectedFiles);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFilesSelected(Array.from(event.target.files));
      // Reset input value to allow re-uploading the same file
      event.target.value = '';
    }
  };

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    handleDrag(e);
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    handleDrag(e);
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDrag(e);
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  return (
    <div 
      className="relative"
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,application/pdf"
        multiple
      />
      
      {isDragging && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-800 bg-opacity-90 border-2 border-dashed border-blue-500 rounded-lg">
              <UploadIcon className="w-12 h-12 text-blue-500 animate-bounce" />
              <p className="mt-2 text-lg font-semibold text-blue-600 dark:text-blue-400">Drop files to upload</p>
          </div>
      )}
      
      {files.length > 0 ? (
        <div className="space-y-3">
          {files.map(file => (
            <div key={file.name} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 overflow-hidden">
                {file.type.startsWith('image/') ? <ImageIcon className="w-6 h-6 text-blue-500 flex-shrink-0" /> : <DocumentTextIcon className="w-6 h-6 text-red-500 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(file.name)}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Remove ${file.name}`}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {isProcessingFiles ? (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <SpinnerIcon className="w-5 h-5 mr-2 text-blue-500" />
              <span>Adding files...</span>
            </div>
          ) : (
             <button
                onClick={handleSelectFilesClick}
                className="w-full mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
              Add or change files
             </button>
          )}

        </div>
      ) : (
        <div className="text-center">
            <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Drag & drop files here</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Images or PDFs</p>
                </div>
            </div>

            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <button
                type="button"
                onClick={handleSelectFilesClick}
                disabled={isProcessingFiles}
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-wait"
            >
              {isProcessingFiles ? (
                <>
                  <SpinnerIcon className="w-5 h-5 mr-3" />
                  Processing...
                </>
              ) : (
                'Select files from your computer'
              )}
            </button>
        </div>
      )}
    </div>
  );
};