const express = require('express');
const multer = require('multer');
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/authMiddleware');
const { compareMultipleFiles, generateComparisonSummary } = require('../services/compareService');
const { summarizeComparison, generateChatTitle } = require('../services/llmService');
const { addTimelineEvent } = require('../services/timelineService');

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

    // Add timeline event for upload
    await addTimelineEvent(chat, 'compare_upload', `${req.files.length} file(s) compared`);

    // Generate basic summary
    const basicSummary = generateComparisonSummary(comparisonResult);

    // Enhance with LLM summary
    console.log('Generating AI summary of comparison...');
    const llmSummary = await summarizeComparison(comparisonResult);

    // Add timeline event for AI generation
    await addTimelineEvent(chat, 'ai_generated', 'AI comparison summary generated');

    // Generate chat title if this is the first result
    if (chat.title === 'Untitled Chat') {
      const title = await generateChatTitle(llmSummary);
      chat.title = title;
    }

    // Store comparison summary as context for future Q&A
    chat.contextText = JSON.stringify({
      summary: llmSummary,
      analysis: comparisonResult
    });
    
    // Add messages: user upload + assistant comparison result
    chat.messages = [
      {
        role: 'user',
        content: `Uploaded ${req.files.length} files for comparison`,
        timestamp: new Date()
      },
      {
        role: 'assistant',
        content: llmSummary,
        timestamp: new Date()
      }
    ];

    // Update chat preview with LLM summary (first 200 characters)
    chat.preview = llmSummary.slice(0, 200);
    chat.updatedAt = new Date();
    await chat.save();

    res.json({
      success: true,
      comparison: comparisonResult,
      summary: llmSummary,
      basic_summary: basicSummary,
      files_compared: req.files.length,
      messages: chat.messages
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

/**
 * @route   POST /api/compare/ask
 * @desc    Ask questions about file comparison results
 * @access  Private
 */
router.post('/ask', authMiddleware, async (req, res) => {
  try {
    const { chatId, question } = req.body;

    if (!chatId || !question) {
      return res.status(400).json({ success: false, message: "chatId and question are required" });
    }

    const chat = await Chat.findOne({ chatId });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (chat.mode !== "compare") {
      return res.status(400).json({ success: false, message: "This chat is not in comparison mode" });
    }

    if (!chat.contextText) {
      return res.status(400).json({ success: false, message: "No comparison data available. Please compare files first." });
    }

    // Add user question to messages
    chat.messages.push({
      role: 'user',
      content: question,
      timestamp: new Date()
    });

    // Parse stored context
    const context = JSON.parse(chat.contextText);

    // Generate AI response using Groq
    const groq = require('groq-sdk').default;
    const client = new groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant. Answer questions about the following file comparison results. Be concise and accurate.\n\nComparison Summary:\n${context.summary}\n\nSimilarity: ${context.analysis.similarity}%`
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
    console.error('Compare ask error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to process question",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route   GET /api/compare/messages/:chatId
 * @desc    Get all messages for a comparison chat
 * @access  Private
 */
router.get('/messages/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ chatId });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // If chat has contextText but no messages (old chat), migrate it
    if (chat.contextText && (!chat.messages || chat.messages.length === 0)) {
      console.log('Migrating old comparison chat to message format...');
      
      const context = JSON.parse(chat.contextText);
      
      chat.messages = [
        {
          role: 'user',
          content: 'Files compared',
          timestamp: chat.createdAt
        },
        {
          role: 'assistant',
          content: context.summary,
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
