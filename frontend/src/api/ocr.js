/**
 * OCR API
 * Handles file upload and OCR text extraction
 */

import { postForm } from './apiClient';

/**
 * Upload files for OCR processing
 * @param {string} chatId - Chat session ID
 * @param {FileList|Array<File>} files - Files to process (images, PDFs, DOCX, PPTX, TXT)
 * @returns {Promise<Object>} Response with cleaned OCR text
 */
export const uploadOCR = async (chatId, files) => {
  if (!chatId) {
    throw new Error('chatId is required');
  }
  
  if (!files || files.length === 0) {
    throw new Error('At least one file is required');
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('chatId', chatId);
  
  // Append all files
  const fileArray = Array.from(files);
  fileArray.forEach(file => {
    formData.append('files', file);
  });

  const response = await postForm('/api/ocr/upload', formData);
  return response;
};

/**
 * Validate file type for OCR
 * @param {File} file - File to validate
 * @returns {boolean} True if file type is supported
 */
export const isValidOCRFile = (file) => {
  const validExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff',
    '.pdf', '.docx', '.pptx', '.txt'
  ];
  
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
};

/**
 * Get supported file types for OCR
 * @returns {string} Comma-separated list of supported extensions
 */
export const getSupportedFileTypes = () => {
  return '.png,.jpg,.jpeg,.gif,.bmp,.tiff,.pdf,.docx,.pptx,.txt';
};

export default {
  uploadOCR,
  isValidOCRFile,
  getSupportedFileTypes
};
