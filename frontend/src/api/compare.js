/**
 * File Comparison API
 * Handles multi-file comparison and difference analysis
 */

import { postForm } from './apiClient';

/**
 * Compare multiple files and get differences/similarities
 * @param {string} chatId - Chat session ID
 * @param {FileList|Array<File>} files - Files to compare (minimum 2 files)
 * @returns {Promise<Object>} Response with comparison results
 */
export const compareFiles = async (chatId, files) => {
  if (!chatId) {
    throw new Error('chatId is required');
  }
  
  if (!files || files.length < 2) {
    throw new Error('At least 2 files are required for comparison');
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('chatId', chatId);
  
  // Append all files
  const fileArray = Array.from(files);
  fileArray.forEach(file => {
    formData.append('files', file);
  });

  const response = await postForm('/api/compare/files', formData);
  return response;
};

/**
 * Validate file type for comparison
 * @param {File} file - File to validate
 * @returns {boolean} True if file type is supported
 */
export const isValidCompareFile = (file) => {
  const validExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff',
    '.pdf', '.docx', '.pptx', '.txt'
  ];
  
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
};

/**
 * Get supported file types for comparison
 * @returns {string} Comma-separated list of supported extensions
 */
export const getSupportedFileTypes = () => {
  return '.png,.jpg,.jpeg,.gif,.bmp,.tiff,.pdf,.docx,.pptx,.txt';
};

/**
 * Format comparison results for display
 * @param {Object} comparisonResult - Raw comparison result from API
 * @returns {Object} Formatted result
 */
export const formatComparisonResult = (comparisonResult) => {
  if (!comparisonResult || !comparisonResult.success) {
    return null;
  }

  return {
    summary: comparisonResult.summary || comparisonResult.llmSummary,
    differences: comparisonResult.differences,
    similarities: comparisonResult.similarities,
    unique: comparisonResult.unique,
    fileCount: comparisonResult.fileCount || 2,
    similarityPercentage: comparisonResult.summary?.similarityPercentage || 0
  };
};

export default {
  compareFiles,
  isValidCompareFile,
  getSupportedFileTypes,
  formatComparisonResult
};
