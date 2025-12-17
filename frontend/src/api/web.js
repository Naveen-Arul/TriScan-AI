/**
 * Web Scraping API
 * Handles URL scraping and content extraction
 */

import { post, get } from './apiClient';

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

/**
 * Ask a question about scraped web content
 * @param {string} chatId - Chat session ID
 * @param {string} question - Question to ask about the scraped content
 * @returns {Promise<Object>} Response with AI answer and updated messages
 */
export const askQuestion = async (chatId, question) => {
  if (!chatId) {
    throw new Error('chatId is required');
  }
  
  if (!question) {
    throw new Error('question is required');
  }

  const response = await post('/api/web/ask', { chatId, question });
  return response;
};

/**
 * Get all messages for a web scraping chat
 * @param {string} chatId - Chat session ID
 * @returns {Promise<Object>} Response with messages array and contextText
 */
export const getMessages = async (chatId) => {
  if (!chatId) {
    throw new Error('chatId is required');
  }

  const response = await get('/api/web/messages/' + chatId);
  return response;
};

export default {
  scrape,
  isValidUrl,
  extractDomain,
  askQuestion,
  getMessages
};
