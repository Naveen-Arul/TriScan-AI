/**
 * Web Scraping API
 * Handles URL scraping and content extraction
 */

import { post } from './apiClient';

/**
 * Scrape a web page and extract clean content
 * @param {string} chatId - Chat session ID
 * @param {string} url - URL to scrape
 * @returns {Promise<Object>} Response with cleaned scraped content
 */
export const scrape = async (chatId, url) => {
  if (!chatId) {
    throw new Error('chatId is required');
  }
  
  if (!url) {
    throw new Error('url is required');
  }

  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format. URL must start with http:// or https://');
  }

  const response = await post('/api/web/scrape', { chatId, url });
  return response;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

/**
 * Extract domain from URL
 * @param {string} url - URL to parse
 * @returns {string|null} Domain name or null if invalid
 */
export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
};

export default {
  scrape,
  isValidUrl,
  extractDomain
};
