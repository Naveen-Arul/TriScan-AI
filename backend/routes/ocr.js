const express = require('express');
const multer = require('multer');
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/authMiddleware');
const { processMultipleFiles } = require('../services/ocrService');
const { cleanupOCR } = require('../services/llmService');

const router = express.Router();

// Multer memory storage (files stored in memory as Buffer)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   POST /api/ocr/upload
 * @desc    Upload files for OCR processing (Pure Node.js - No Python)
 * @access  Private
 * 
 * Example cURL command:
 * curl -X POST http://localhost:5000/api/ocr/upload \
 *   -H "Authorization: Bearer <TOKEN>" \
 *   -F "chatId=<CHAT_ID>" \
 *   -F "files=@/path/to/image1.jpg" \
 *   -F "files=@/path/to/image2.png"
 * 
 * Form-data fields:
 * - chatId: String (required) - The chat session ID
 * - files: File[] (required) - One or more files for OCR (images, PDFs, DOCX, PPTX, TXT)
 */
router.post('/upload', authMiddleware, upload.array('files'), async (req, res) => {
  try {
    const { chatId } = req.body;

    // Validate chatId
    if (!chatId) {
      return res.status(400).json({ success: false, message: "chatId is required" });
    }

    // Find and validate chat
    const chat = await Chat.findOne({ chatId });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (chat.mode !== "ocr") {
      return res.status(400).json({ success: false, message: "This chat is not in OCR mode" });
    }

    // Validate files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // Extract text from all files using Node.js OCR service
    console.log(`Processing ${req.files.length} file(s) for OCR...`);
    const rawText = await processMultipleFiles(req.files);

    // Clean up text using Groq LLM
    console.log('Cleaning OCR text with LLM...');
    const cleanedText = await cleanupOCR(rawText);

    // Update chat preview with first 200 characters
    chat.preview = cleanedText.slice(0, 200);
    chat.updatedAt = new Date();
    await chat.save();

    res.json({
      success: true,
      clean_text: cleanedText,
      raw_text: rawText,
      files_processed: req.files.length
    });

  } catch (err) {
    console.error('OCR upload error:', err);
    res.status(500).json({ 
      success: false, 
      message: "OCR processing failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
