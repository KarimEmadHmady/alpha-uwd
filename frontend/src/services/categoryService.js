// services/categoryService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoryService = {
  async getAllCategories(lang = 'en') {
    const response = await fetch(`${API_URL}/api/categories?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch categories');
    }

    return await response.json();
  },

  // Get all categories for frontend (public access without token)
  async getAllCategoriesPublic(lang = 'en') {
    const response = await fetch(`${API_URL}/api/categories?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch categories');
    }

    return await response.json();
  },

  async getAllCategoriesWithTranslations(token) {
    const response = await fetch(`${API_URL}/api/categories/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch categories with translations');
    }

    return await response.json();
  },

  async getCategoryById(id, lang = 'en') {
    const response = await fetch(`${API_URL}/api/categories/${id}?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch category');
    }

    return await response.json();
  },

  async createCategory(categoryData, token) {
    const response = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }

    return await response.json();
  },

  async updateCategory(id, categoryData, token) {
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update category');
    }

    return await response.json();
  },

  async deleteCategory(id, token) {
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete category');
    }

    return await response.json();
  }
};
