// app/dashboard/category/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { useAuth } from '@/hooks/useAuth';
import AddCategoryModal from '@/components/category/AddCategoryModal';
import EditCategoryModal from '@/components/category/EditCategoryModal';
import DeleteConfirmModal from '@/components/category/DeleteConfirmModal';

const CategoryPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const { user, token } = useAuth();
  const { 
    categories, 
    filteredCategories = [], 
    isLoading, 
    error, 
    successMessage,
    searchQuery,
    getCategoriesWithTranslations,
    removeCategory,
    clearCategoryError,
    clearCategorySuccessMessage,
    setCategorySearchQuery
  } = useCategory();

  useEffect(() => {
    if (token) {
      console.log('Token available, fetching categories...');
      getCategoriesWithTranslations(token).catch(err => {
        console.error('Error fetching categories:', err);
      });
    } else {
      console.log('No token available');
    }
  }, [token]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        clearCategorySuccessMessage();
      }, 3000);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        clearCategoryError();
      }, 5000);
    }
  }, [error]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setCategorySearchQuery(query);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await removeCategory(categoryToDelete.id, token);
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleCloseEditModal = () => {
    setEditingCategory(null);
  };

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-white/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00437a] to-blue-700 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Categories Management</h1>
                <p className="text-white/80 mt-1">Manage your investment categories</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 sm:mt-0 bg-white text-[#00437a] px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Category
              </button>
            </div>
          </div>

          {/* Search and Messages */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div>
                </div>
              ) : filteredCategories && filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? 'Try adjusting your search' : 'Get started by adding a new category'}
                  </p>
                  {!searchQuery && (
                    <div className="mt-6">
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00437a] hover:bg-[#003560] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00437a]"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add Category
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        English Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arabic Name
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="dark:bg-white/0 divide-y divide-gray-200">
                    {filteredCategories && filteredCategories.map((category) => (
                      <tr key={category.id || category._id} className="hover:bg-gray-500">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium ">{category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm ">{category.name_ar}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-[#00437a] hover:text-[#003560] mr-3"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        token={token}
      />

      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={handleCloseEditModal}
        category={editingCategory}
        token={token}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CategoryPage;
