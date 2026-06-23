// services/usersService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://revamp.alpha-odin.com/alpha';

export const usersService = {
  async getAllUsers(token) {
    console.log('usersService.getAllUsers - API_URL:', API_URL);
    console.log('usersService.getAllUsers - Token:', token);
    
    const response = await fetch(`${API_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('usersService.getAllUsers - Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.log('usersService.getAllUsers - Error response:', error);
      throw new Error(error.message || 'Failed to fetch users');
    }

    const data = await response.json();
    console.log('usersService.getAllUsers - Success response:', data);
    return data;
  },

  async getUserById(id, token) {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }

    return await response.json();
  },

  async updateUser(id, updates, token) {
    const { username, email, password, role, bio, avatar } = updates;
    const data = {};

    if (username) data.username = username;
    if (email) data.email = email;
    if (role) data.role = role;
    if (password) data.password = password;
    if (bio !== undefined) data.bio = bio;
    if (avatar !== undefined) data.avatar = avatar;

    console.log('usersService.updateUser - Sending data:', data);

    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('usersService.updateUser - Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('usersService.updateUser - Error:', error);
      throw new Error(error.message || 'Failed to update user');
    }

    const result = await response.json();
    console.log('usersService.updateUser - Success:', result);
    return result;
  },

  async deleteUser(id, token) {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }

    return await response.json();
  },

  async createUser(userData, token) {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return await response.json();
  },

  async updateAvatar(formData, token) {
    const response = await fetch(`${API_URL}/api/users/me/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update avatar');
    }

    return await response.json();
  },

  async updateBio(bio, token) {
    const response = await fetch(`${API_URL}/api/users/bio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bio }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update bio');
    }

    return await response.json();
  },

  async updateUserRole(id, role, token) {
    const response = await fetch(`${API_URL}/api/users/role/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user role');
    }

    return await response.json();
  },

  async changePassword(oldPassword, newPassword, token) {
    const response = await fetch(`${API_URL}/api/users/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    return await response.json();
  }
};
