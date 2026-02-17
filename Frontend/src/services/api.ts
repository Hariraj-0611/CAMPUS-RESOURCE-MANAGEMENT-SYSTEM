const API_BASE_URL = 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('access_token');

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Authentication
export const authAPI = {
  login: async (username: string, password: string) => {
    const data = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    // Store tokens
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// Users
export const usersAPI = {
  getAll: () => apiRequest('/users/'),
  
  create: (userData: any) => apiRequest('/users/', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  update: (id: number, userData: any) => apiRequest(`/users/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  deactivate: (id: number) => apiRequest(`/users/${id}/deactivate/`, {
    method: 'PATCH',
  }),
};

// Resources
export const resourcesAPI = {
  getAll: () => apiRequest('/resources/'),
  
  getById: (id: number) => apiRequest(`/resources/${id}/`),
  
  create: (resourceData: any) => apiRequest('/resources/', {
    method: 'POST',
    body: JSON.stringify(resourceData),
  }),
  
  update: (id: number, resourceData: any) => apiRequest(`/resources/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(resourceData),
  }),
};

// Bookings
export const bookingsAPI = {
  getAll: () => apiRequest('/bookings/'),
  
  getMy: () => apiRequest('/bookings/my_bookings/'),
  
  create: (bookingData: any) => apiRequest('/bookings/', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  
  approve: (id: number) => apiRequest(`/bookings/${id}/approve/`, {
    method: 'PATCH',
  }),
  
  reject: (id: number) => apiRequest(`/bookings/${id}/reject/`, {
    method: 'PATCH',
  }),
  
  cancel: (id: number) => apiRequest(`/bookings/${id}/cancel/`, {
    method: 'PATCH',
  }),
};
