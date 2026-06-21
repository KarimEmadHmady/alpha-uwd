// components/category/AddCategoryModal.jsx
import React, { useState, useEffect } from 'react';
import { useCategory } from '@/hooks/useCategory';

const AddCategoryModal = ({ isOpen, onClose, token }) => {
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
  });

  const { addCategory, isLoading, error, clearCategoryError, successMessage, clearCategorySuccessMessage } = useCategory();

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        clearCategorySuccessMessage();
        handleClose();
      }, 2000);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        clearCategoryError();
      }, 5000);
    }
  }, [error]);

  const handleClose = () => {
    setFormData({ name: '', name_ar: '' });
    clearCategoryError();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.name_ar.trim()) {
      return;
    }

    try {
      // Send data in the format expected by API
      const categoryData = {
        name: formData.name,
        translations: {
          en: {
            name: formData.name
          },
          ar: {
            name: formData.name_ar
          }
        }
      };
      await addCategory(categoryData, token);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                English Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition disabled:bg-gray-100 placeholder-gray-500 text-black"
                placeholder="Enter category name in English"
              />
            </div>

            <div>
              <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700 mb-2">
                Arabic Name
              </label>
              <input
                type="text"
                id="name_ar"
                name="name_ar"
                value={formData.name_ar}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition disabled:bg-gray-100 placeholder-gray-500 text-black"
                placeholder="Enter category name in Arabic"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim() || !formData.name_ar.trim()}
                className="flex-1 px-4 py-2 bg-[#00437a] text-white rounded-lg hover:bg-[#003560] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  'Add Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
