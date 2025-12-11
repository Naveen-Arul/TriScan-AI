/**
 * Authentication API
 * Handles user signup, login, and profile operations
 */

import { post } from './apiClient';

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.dob - Date of birth (YYYY-MM-DD)
 * @param {string} userData.gender - Gender (Male/Female/Other)
 * @param {string} userData.country - Country
 * @returns {Promise<Object>} Response with user data and token
 */
export const signup = async (userData) => {
  const response = await post('/api/auth/signup', userData);
  
  // Store token in localStorage
  if (response.success && response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response;
};

/**
 * Log in existing user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response with user data and token
 */
export const login = async (credentials) => {
  const response = await post('/api/auth/login', credentials);
  
  // Store token in localStorage
  if (response.success && response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response;
};

/**
 * Log out current user
 */
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

/**
 * Get current user profile (optional - for future use)
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async () => {
  // This endpoint would need to be implemented in the backend
  // For now, return null or implement when needed
  return null;
};

export default {
  signup,
  login,
  logout,
  getProfile
};
