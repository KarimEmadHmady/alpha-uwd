'use client';

import React from 'react';
import ImageUpload from './ImageUpload';

const FundImages = ({ fundData, handleImageChange }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Fund Images</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fund Image */}
        <ImageUpload
          label="Fund Image"
          name="image"
          currentImage={fundData.image}
          onImageChange={handleImageChange}
        />
        
        {/* Manager Image */}
        <ImageUpload
          label="Fund Manager Image"
          name="fund_manager_image"
          currentImage={fundData.fund_manager_image}
          onImageChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default FundImages;
