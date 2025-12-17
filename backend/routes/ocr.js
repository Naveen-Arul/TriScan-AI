const express = require('express');
const multer = require('multer');
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/authMiddleware');
const { processMultipleFiles } = require('../services/ocrService');
const { cleanupOCR, generateChatTitle } = require('../services/llmService');
const { addTimelineEvent } = require('../services/timelineService');

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

    // Find and validate chat - ensure it belongs to the authenticated user
    const chat = await Chat.findOne({ chatId, userId: req.user.userId });

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

    // Add timeline event for upload
    await addTimelineEvent(chat, 'ocr_upload', `${req.files.length} file(s) uploaded`);

    // Clean up text using Groq LLM
    console.log('Cleaning OCR text with LLM...');
    const cleanedText = await cleanupOCR(rawText);

    // Add timeline event for AI generation
    await addTimelineEvent(chat, 'ai_generated', 'Cleaned OCR text generated');

    // Generate chat title if this is the first result
    if (chat.title === 'Untitled Chat') {
      const title = await generateChatTitle(cleanedText);
      chat.title = title;
    }

    // Store extracted text as context for future Q&A
    chat.contextText = cleanedText;
    
    // Add messages: user upload notification + assistant extracted text
    chat.messages = [
      {
        role: 'user',
        content: `Uploaded ${req.files.length} file(s)`,
        timestamp: new Date()
      },
      {
        role: 'assistant',
        content: cleanedText,
        timestamp: new Date()
      }
    ];

    // Update chat preview with first 200 characters
    chat.preview = cleanedText.slice(0, 200);
    chat.updatedAt = new Date();
    await chat.save();

    res.json({
      success: true,
      clean_text: cleanedText,
      raw_text: rawText,
      files_processed: req.files.length,
      messages: chat.messages
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

/**
 * @route   POST /api/ocr/ask
 * @desc    Ask questions about extracted OCR text
 * @access  Private
 */
router.post('/ask', authMiddleware, async (req, res) => {
  try {
    const { chatId, question } = req.body;

    if (!chatId || !question) {
      return res.status(400).json({ success: false, message: "chatId and question are required" });
    }

    const chat = await Chat.findOne({ chatId, userId: req.user.userId });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (chat.mode !== "ocr") {
      return res.status(400).json({ success: false, message: "This chat is not in OCR mode" });
    }

    if (!chat.contextText) {
      return res.status(400).json({ success: false, message: "No OCR text available. Please upload a file first." });
    }

    // Add user question to messages
    chat.messages.push({
      role: 'user',
      content: question,
      timestamp: new Date()
    });

    // Generate AI response using Groq
    const groq = require('groq-sdk').default;
    const client = new groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant. Answer questions about the following extracted text. Be concise and accurate.\n\nExtracted Text:\n${chat.contextText}`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const answer = completion.choices[0]?.message?.content || "I couldn't generate a response.";

    // Add AI response to messages
    chat.messages.push({
      role: 'assistant',
      content: answer,
      timestamp: new Date()
    });

    await addTimelineEvent(chat, 'ai_response', 'AI answered question');
    chat.updatedAt = new Date();
    await chat.save();

    res.json({
      success: true,
      answer,
      messages: chat.messages
    });

  } catch (err) {
    console.error('OCR ask error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to process question",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route   GET /api/ocr/messages/:chatId
 * @desc    Get all messages for a chat
 * @access  Private
 */
router.get('/messages/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ chatId, userId: req.user.userId });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // If chat has contextText but no messages (old chat), migrate it
    if (chat.contextText && (!chat.messages || chat.messages.length === 0)) {
      console.log('Migrating old chat to message format...');
      
      chat.messages = [
        {
          role: 'user',
          content: 'File uploaded',
          timestamp: chat.createdAt
        },
        {
          role: 'assistant',
          content: chat.contextText,
          timestamp: chat.createdAt
        }
      ];
      
      await chat.save();
    }

    res.json({
      success: true,
      messages: chat.messages || [],
      contextText: chat.contextText || ''
    });

  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch messages"
    });
  }
});

module.exports = router;
