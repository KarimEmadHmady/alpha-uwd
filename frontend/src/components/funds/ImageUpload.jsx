'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';

const ImageUpload = ({ 
  label, 
  name, 
  currentImage, 
  onImageChange, 
  className = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none"
}) => {
  const { showSuccess } = useToast();
  const [preview, setPreview] = useState(currentImage || null);
  const [fileName, setFileName] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return; // You could add error toast here
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        return; // You could add error toast here
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFileName(file.name);
        showSuccess(`${label} uploaded successfully`);
      };
      reader.readAsDataURL(file);
      
      // Pass file to parent
      onImageChange(name, file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium  mb-2">
        {label}
      </label>
      
      <div className="flex items-start space-x-4">
        {/* Image Display - Shows current or new */}
        {preview && (
          <div className="flex-shrink-0">
            <img 
              src={preview} 
              alt={`${label} preview`}
              className="h-20 w-20 object-cover rounded-lg border border-blue-300"
            />
            <p className="text-xs text-blue-500 mt-1 text-center">
              {fileName ? 'New' : 'Current'}
            </p>
          </div>
        )}
        
        {/* Upload Input */}
        <div className="flex-1">
          <input
            type="file"
            name={name}
            accept="image/*"
            onChange={handleImageUpload}
            className={className}
          />
          
          {/* File Name Display */}
          {fileName && (
            <p className="mt-2 text-sm text-gray-600">Selected: {fileName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
