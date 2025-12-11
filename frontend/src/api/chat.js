/**
 * Chat API
 * Handles chat session creation and history retrieval
 */

import { post, get } from './apiClient';

/**
 * Create a new chat session with a specific mode
 * @param {string} mode - Chat mode: 'ocr', 'web', or 'compare'
 * @returns {Promise<Object>} Response with chat data
 */
export const createChat = async (mode) => {
  if (!['ocr', 'web', 'compare'].includes(mode)) {
    throw new Error('Invalid mode. Must be "ocr", "web", or "compare"');
  }
  
  const response = await post('/api/chat/new', { mode });
  return response;
};

/**
 * Get chat history for the current user
 * @returns {Promise<Object>} Response with chat history array
 */
export const getHistory = async () => {
  const response = await get('/api/chat/history');
  return response;
};

/**
 * Get a specific chat by chatId (optional - for future use)
 * @param {string} chatId - Chat ID
 * @returns {Promise<Object>} Chat data
 */
export const getChatById = async (chatId) => {
  // This endpoint would need to be implemented in the backend
  // For now, use getHistory and filter
  const historyResponse = await getHistory();
  if (historyResponse.success && historyResponse.history) {
    const chat = historyResponse.history.find(c => c.chatId === chatId);
    return chat || null;
  }
  return null;
};

export default {
  createChat,
  getHistory,
  getChatById
};
