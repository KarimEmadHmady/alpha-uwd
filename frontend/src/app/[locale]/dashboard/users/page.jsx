'use client';
import React, { useEffect, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import AddUserModal from '@/components/users/AddUserModal';
import EditUserModal from '@/components/users/EditUserModal';

const UsersPage = () => {
  const { 
    users, 
    isLoading, 
    error, 
    fetchAllUsers, 
    deleteUserById, 
    createNewUser,
    updateUserById,
    updateMyBio,
    updateMyAvatar,
    clearUsersError 
  } = useUsers();
  const { user: currentUser, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    console.log('UsersPage - Token:', token);
    if (token) {
      console.log('Fetching users...');
      fetchAllUsers();
    }
  }, [token, fetchAllUsers]);

  useEffect(() => {
    console.log('UsersPage - Users state:', users);
    console.log('UsersPage - Loading:', isLoading);
    console.log('UsersPage - Error:', error);
  }, [users, isLoading, error]);

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user && 
    user.username && 
    user.email && 
    user.role &&
    (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserById(userId);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const result = await createNewUser(userData);
      console.log('User created successfully:', result);
      setShowAddModal(false);
      // Refresh users list after creation
      fetchAllUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      console.log('Updating user:', userId, updates);
      
      // Update basic info (username, email, role)
      const basicUpdates = {
        username: updates.username,
        email: updates.email,
        role: updates.role
      };
      
      await updateUserById(userId, basicUpdates);
      console.log('Basic info updated');
      
      // Update bio if provided (using separate endpoint)
      if (updates.bio !== undefined) {
        console.log('Updating bio to:', updates.bio);
        await updateMyBio(updates.bio);
        console.log('Bio updated');
      }
      
      // Update avatar if provided (using separate endpoint)
      if (updates.avatarFile) {
        console.log('Updating avatar with file:', updates.avatarFile.name);
        const formData = new FormData();
        formData.append('avatar', updates.avatarFile);
        await updateMyAvatar(formData);
        console.log('Avatar updated');
      }
      
      fetchAllUsers(); // Refresh users list
      return { success: true };
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
        <p className="">Manage all system users and their permissions</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4   border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Add User Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add User
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-red-700">{error}</span>
            <button
              onClick={clearUsersError}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className=" rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-400">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider lg:px-6">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider lg:px-6">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider lg:px-6">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider lg:px-6 hidden sm:table-cell">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider lg:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-400">
                  <td className="px-4 py-4 whitespace-nowrap lg:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10">
                        <Image
                          className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover"
                          src={user.avatar || "/images-user.png"}
                          alt={user.username}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-2 lg:ml-4">
                        <div className="text-sm font-medium text-xs lg:text-sm">{user.username}</div>
                        <div className="text-xs lg:text-sm text-gray-500 hidden sm:block">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap lg:px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap lg:px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.confirmed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.confirmed ? 'Confirmed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 lg:px-6 hidden sm:table-cell">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium lg:px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit user"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding a new user'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40  backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white  rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
                Delete User
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete {selectedUser.username}? This action cannot be undone.
                </p>
              </div>
              <div className="mt-4 px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
                <button
                  type="button"
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* Add User Modal */}
      <AddUserModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onCreateUser={handleCreateUser}
      />

      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={showEditModal} 
        onClose={closeEditModal}
        user={selectedUser}
        onUpdateUser={handleUpdateUser}
        isCurrentUser={selectedUser?.id === currentUser?.id}
      />
    </div>


   
  );
};

export default UsersPage;
