'use client';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usersService } from '@/services/usersService';
import EditUserModal from '@/components/users/EditUserModal';
import Image from 'next/image';


const UserProfilePage = () => {
  const { user, token, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdateUser = async (userId, updates) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('Updating user with ID:', userId);
      console.log('User object:', user);
      console.log('Updates:', updates);

      // Handle avatar upload if present
      if (updates.avatarFile) {
        const formData = new FormData();
        formData.append('avatar', updates.avatarFile);
        const avatarResponse = await usersService.updateAvatar(formData, token);
        console.log('Avatar upload response:', avatarResponse);
        
        delete updates.avatarFile; // Remove from updates object
      }

      // Handle bio update if present
      if (updates.bio !== undefined) {
        await usersService.updateBio(updates.bio, token);
        // Don't delete updates.bio, keep it for Redux update
      }

      // Handle other user data updates
      if (Object.keys(updates).length > 0) {
        // Use user.userId if userId is undefined (the ID is in userId field, not id)
        const actualUserId = userId || user.userId;
        console.log('Actual user ID for update:', actualUserId);
        
        if (!actualUserId) {
          throw new Error('User ID is not available');
        }
        
        await usersService.updateUser(actualUserId, updates, token);
      }

      setSuccessMessage('Profile updated successfully!');
      
      // Update user data in Redux state
      const updatedUserData = {};
      if (updates.username) updatedUserData.username = updates.username;
      if (updates.email) updatedUserData.email = updates.email;
      if (updates.role) updatedUserData.role = updates.role;
      if (updates.bio !== undefined) updatedUserData.bio = updates.bio;
      
      console.log('Updating Redux with data:', updatedUserData);
      
      if (Object.keys(updatedUserData).length > 0) {
        updateProfile(updatedUserData);
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }
console.log('user', user)
  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="w-full ">
        <div className=" rounded-2xl shadow-xl overflow-hidden dark:bg-white/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00437a] to-blue-700 p-8">
            <div className="flex items-center justify-center space-x-6">
              <div className="relative">
              <Image
                src={user.avatar || "/images-user.png"}
                alt={user.username}
                width={96}   
                height={96}  
                className="rounded-full border-4 border-white object-cover shadow-lg"
              />
                <div className="absolute bottom-0 right-0 bg-green-400 h-6 w-6 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                <p className="text-blue-100 mb-3">{user.email}</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2 shadow-lg cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-green-700">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <h2 className="text-xl font-semibold ">Basic Information</h2>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <p className="text-gray-900 font-medium">{user.username}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Role</label>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h2 className="text-xl font-semibold">Additional Information</h2>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Bio</label>
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-gray-900 flex-1">
                      {user.bio || 'No bio provided. Click "Edit Profile" to add your bio.'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Member Since</label>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-900 font-medium">
                      {user.created_at ? new Date(user.created_at).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Date of joining</label>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-900 font-medium">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        isCurrentUser={true}
      />
    </div>
  );
};

export default UserProfilePage;
