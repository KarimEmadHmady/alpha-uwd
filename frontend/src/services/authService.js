// services/authService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user || data));
      document.cookie = `auth_token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;
    }
    
    return data;
  },

  async logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    document.cookie = 'auth_token=; path=/; max-age=0';
  },

  async forgotPassword(email) {
    const response = await fetch(`${API_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset email');
    }

    return await response.json();
  },

async resetPassword(token, newPassword, email) {
  const response = await fetch(`${API_URL}/api/users/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword, email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset password');
  }

  return await response.json();
},

  getToken() {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};