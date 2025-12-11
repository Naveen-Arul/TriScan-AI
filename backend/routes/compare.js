const express = require('express');
const multer = require('multer');
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/authMiddleware');
const { compareMultipleFiles, generateComparisonSummary } = require('../services/compareService');
const { summarizeComparison } = require('../services/llmService');

const router = express.Router();

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   POST /api/compare/files
 * @desc    Compare multiple files and show differences/similarities (Pure Node.js)
 * @access  Private
 * 
 * Example cURL command:
 * curl -X POST http://localhost:5000/api/compare/files \
 *   -H "Authorization: Bearer <TOKEN>" \
 *   -F "chatId=<CHAT_ID>" \
 *   -F "files=@/path/to/file1.pdf" \
 *   -F "files=@/path/to/file2.pdf"
 * 
 * Form-data fields:
 * - chatId: String (required) - The chat session ID
 * - files: File[] (required) - 2 or more files to compare
 */
router.post('/files', authMiddleware, upload.array('files'), async (req, res) => {
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

    if (chat.mode !== "compare") {
      return res.status(400).json({ 
        success: false, 
        message: "This chat is not in comparison mode" 
      });
    }

    // Validate files
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: "At least 2 files are required for comparison" 
      });
    }

    // Compare files
    console.log(`Comparing ${req.files.length} file(s)...`);
    const comparisonResult = await compareMultipleFiles(req.files);

    // Generate basic summary
    const basicSummary = generateComparisonSummary(comparisonResult);

    // Enhance with LLM summary
    console.log('Generating AI summary of comparison...');
    const llmSummary = await summarizeComparison(comparisonResult);

    // Update chat preview with LLM summary (first 200 characters)
    chat.preview = llmSummary.slice(0, 200);
    chat.updatedAt = new Date();
    await chat.save();

    res.json({
      success: true,
      comparison: comparisonResult,
      summary: llmSummary,
      basic_summary: basicSummary,
      files_compared: req.files.length
    });

  } catch (err) {
    console.error('File comparison error:', err);
    res.status(500).json({ 
      success: false, 
      message: "File comparison failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
