// services/fundService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fundService = {
  async createFund(formData, token) {
    const response = await fetch(`${API_URL}/api/funds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create fund');
    }

    return await response.json();
  },

  async getAllFunds(token) {
    const response = await fetch(`${API_URL}/api/funds/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch funds');
    }

    return await response.json();
  },

  // Get all funds for frontend (public access without token)
  async getAllFundsPublic(locale = 'en') {
    const response = await fetch(`${API_URL}/api/funds/all?lang=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch funds');
    }

    return await response.json();
  },

  // Get funds by category for frontend (public access without token)
  async getFundsByCategory(categoryId, locale = 'en') {
    const response = await fetch(`${API_URL}/api/funds/category/${categoryId}?lang=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch funds by category');
    }

    return await response.json();
  },

  async getFundById(id, token, lang = 'en') {
    const response = await fetch(`${API_URL}/api/funds/${id}?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch fund');
    }

    return await response.json();
  },

  async updateFund(id, formData, token) {
    const response = await fetch(`${API_URL}/api/funds/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update fund');
    }

    return await response.json();
  },

  async deleteFund(id, token) {
    const response = await fetch(`${API_URL}/api/funds/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete fund');
    }

    // Handle both JSON and text responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return { success: true, message: await response.text() };
    }
  },

  async reorderFunds(orderedIds, token) {
    const response = await fetch(`${API_URL}/api/funds/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ orderedIds }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reorder funds');
    }

    return await response.json();
  },

  async updateFundPrice(id, priceData, token) {
    const response = await fetch(`${API_URL}/api/funds/${id}/price`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(priceData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update fund price');
    }

    return await response.json();
  },

  async getFundPriceHistory(id, token) {
    const response = await fetch(`${API_URL}/api/funds/${id}/history/last-two-dates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch price history');
    }

    return await response.json();
  },

  // Get single fund for frontend (public access without token)
  async getFundByIdPublic(id, lang = 'en') {
    const response = await fetch(`${API_URL}/api/funds/${id}?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch fund');
    }

    return await response.json();
  },

  async getWaitingFunds(token, lang = 'en') {
    const response = await fetch(`${API_URL}/api/funds/status?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch waiting funds');
    }

    return await response.json();
  },

  async updateFundStatus(id, status, token) {
    const response = await fetch(`${API_URL}/api/funds/status/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update fund status');
    }

    // Handle non-JSON responses like "Success Edit"
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch {
      // If it's not valid JSON, return a success object
      return { success: true, message: responseText };
    }
  },

  async declineFund(id, message, token) {
    const response = await fetch(`${API_URL}/api/funds/status/decline/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to decline fund');
    }

    return await response.json();
  },
};
