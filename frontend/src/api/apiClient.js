/**
 * API Client for TriScan AI
 * Handles all HTTP requests with automatic token injection and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Redirect to login page
 */
const redirectToLogin = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

/**
 * Handle API errors
 * @param {Response} response - Fetch response object
 * @returns {Promise<never>}
 */
const handleError = async (response) => {
  let errorMessage = 'Something went wrong';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch (e) {
    errorMessage = response.statusText || errorMessage;
  }

  // Redirect to login on 401 Unauthorized
  if (response.status === 401) {
    redirectToLogin();
  }

  throw new Error(errorMessage);
};

/**
 * GET request
 * @param {string} endpoint - API endpoint (e.g., '/api/chat/history')
 * @returns {Promise<any>} Response data
 */
export const get = async (endpoint) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    await handleError(response);
  }

  return response.json();
};

/**
 * POST request with JSON body
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @returns {Promise<any>} Response data
 */
export const post = async (endpoint, body = {}) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    await handleError(response);
  }

  return response.json();
};

/**
 * POST request with FormData (for file uploads)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - FormData object with files
 * @returns {Promise<any>} Response data
 */
export const postForm = async (endpoint, formData) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      // Don't set Content-Type for FormData - browser will set it with boundary
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: formData
  });

  if (!response.ok) {
    await handleError(response);
  }

  return response.json();
};

/**
 * PUT request with JSON body
 * @param {string} endpoint - API endpoint
 * @param {Object} body - Request body
 * @returns {Promise<any>} Response data
 */
export const put = async (endpoint, body = {}) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    await handleError(response);
  }

  return response.json();
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} Response data
 */
export const del = async (endpoint) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    await handleError(response);
  }

  return response.json();
};

export default {
  get,
  post,
  postForm,
  put,
  del,
  isAuthenticated
};
