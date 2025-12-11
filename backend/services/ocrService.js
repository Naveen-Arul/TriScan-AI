const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const officeParser = require('officeparser');

/**
 * Extract text from image using Tesseract.js
 * @param {Buffer} imageBuffer - Image file buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromImage(imageBuffer) {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: info => console.log(info.status)
    });
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Extract text from PDF using pdf-parse
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from DOCX using mammoth
 * @param {Buffer} docxBuffer - DOCX file buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromDOCX(docxBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: docxBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

/**
 * Extract text from PPTX using officeparser
 * @param {Buffer} pptxBuffer - PPTX file buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromPPTX(pptxBuffer) {
  try {
    const text = await officeParser.parseOfficeAsync(pptxBuffer);
    return text;
  } catch (error) {
    console.error('Error extracting text from PPTX:', error);
    throw new Error('Failed to extract text from PPTX');
  }
}

/**
 * Extract text from TXT file
 * @param {Buffer} txtBuffer - TXT file buffer
 * @returns {string} Extracted text
 */
function extractTextFromTXT(txtBuffer) {
  try {
    return txtBuffer.toString('utf-8');
  } catch (error) {
    console.error('Error extracting text from TXT:', error);
    throw new Error('Failed to extract text from TXT');
  }
}

/**
 * Auto-detect file type and extract text accordingly
 * @param {Object} file - File object with buffer and originalname
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromFile(file) {
  const filename = file.originalname.toLowerCase();
  
  try {
    if (filename.endsWith('.png') || filename.endsWith('.jpg') || 
        filename.endsWith('.jpeg') || filename.endsWith('.gif') || 
        filename.endsWith('.bmp') || filename.endsWith('.tiff')) {
      return await extractTextFromImage(file.buffer);
    } 
    else if (filename.endsWith('.pdf')) {
      return await extractTextFromPDF(file.buffer);
    } 
    else if (filename.endsWith('.docx')) {
      return await extractTextFromDOCX(file.buffer);
    } 
    else if (filename.endsWith('.pptx')) {
      return await extractTextFromPPTX(file.buffer);
    } 
    else if (filename.endsWith('.txt')) {
      return extractTextFromTXT(file.buffer);
    } 
    else {
      throw new Error(`Unsupported file type: ${filename}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filename}:`, error);
    return `[Error processing ${filename}: ${error.message}]`;
  }
}

/**
 * Process multiple files and extract text from all
 * @param {Array} files - Array of file objects
 * @returns {Promise<string>} Combined extracted text
 */
async function processMultipleFiles(files) {
  const results = await Promise.all(
    files.map(file => extractTextFromFile(file))
  );
  
  return results.join('\n\n--- Next File ---\n\n');
}

module.exports = {
  extractTextFromImage,
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromPPTX,
  extractTextFromTXT,
  extractTextFromFile,
  processMultipleFiles
};
