import { User } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const error = await response.json();
      // Handle different error formats
      if (error.detail) {
        errorMessage = error.detail;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (typeof error === 'object') {
        // Handle validation errors
        const firstKey = Object.keys(error)[0];
        if (firstKey && Array.isArray(error[firstKey])) {
          errorMessage = `${firstKey}: ${error[firstKey][0]}`;
        } else if (firstKey) {
          errorMessage = `${firstKey}: ${error[firstKey]}`;
        } else {
          errorMessage = JSON.stringify(error);
        }
      }
    } catch (e) {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// Auth API
export const authAPI = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(response);
    
    // Store tokens and user data
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    return data;
  },

  async register(userData: { name: string; email: string; password: string; role: string }) {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password2: userData.password, // Backend expects password2 for confirmation
        role: userData.role
      })
    });
    return handleResponse(response);
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
};

// Resources API
export const resourcesAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/resources/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getById(id: number) {
    const response = await fetch(`${API_BASE_URL}/resources/${id}/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async create(resourceData: any) {
    const response = await fetch(`${API_BASE_URL}/resources/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(resourceData)
    });
    return handleResponse(response);
  },

  async update(id: number, resourceData: any) {
    const response = await fetch(`${API_BASE_URL}/resources/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(resourceData)
    });
    return handleResponse(response);
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/resources/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      let errorMessage = 'Failed to delete resource';
      try {
        const error = await response.json();
        if (error.detail) {
          errorMessage = error.detail;
        } else if (error.error) {
          errorMessage = error.error;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      } catch (e) {
        // If JSON parsing fails, use default message
      }
      throw new Error(errorMessage);
    }
  },

  async updateAvailability(id: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/resources/${id}/update-availability/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  async checkAvailability(id: number, date: string, timeSlot: string) {
    const response = await fetch(
      `${API_BASE_URL}/resources/${id}/availability/?date=${date}&time_slot=${timeSlot}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  }
};

// Bookings API
export const bookingsAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getMyBookings() {
    const response = await fetch(`${API_BASE_URL}/bookings/my/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getById(id: number) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async create(bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return handleResponse(response);
  },

  async approve(id: number) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/approve/`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async reject(id: number, remarks: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/reject/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ remarks })
    });
    return handleResponse(response);
  },

  async cancel(id: number) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel/`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async update(id: number, bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return handleResponse(response);
  }
};

// Users API
export const usersAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async getById(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async create(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async update(id: number, userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      let errorMessage = 'Failed to delete user';
      try {
        const error = await response.json();
        if (error.detail) {
          errorMessage = error.detail;
        } else if (error.error) {
          errorMessage = error.error;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
      } catch (e) {
        // If JSON parsing fails, use default message
      }
      throw new Error(errorMessage);
    }
  },

  async updateStatus(id: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/update-status/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  }
};
