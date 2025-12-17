const express = require('express');
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/authMiddleware');
const { scrapeWebPage, isValidUrl } = require('../services/webScraper');
const { cleanupScrape, generateChatTitle } = require('../services/llmService');
const { addTimelineEvent } = require('../services/timelineService');

const router = express.Router();

/**
 * @route   POST /api/web/scrape
 * @desc    Scrape web page content (Pure Node.js)
 * @access  Private
 * 
 * Example cURL command:
 * curl -X POST http://localhost:5000/api/web/scrape \
 *   -H "Authorization: Bearer <TOKEN>" \
 *   -H "Content-Type: application/json" \
 *   -d '{"chatId":"<CHAT_ID>","url":"https://example.com"}'
 * 
 * Request body:
 * - chatId: String (required) - The chat session ID
 * - url: String (required) - URL to scrape
 */
router.post('/scrape', authMiddleware, async (req, res) => {
  try {
    const { chatId, url } = req.body;

    // Validate inputs
    if (!chatId) {
      return res.status(400).json({ success: false, message: "chatId is required" });
    }

    if (!url) {
      return res.status(400).json({ success: false, message: "url is required" });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ success: false, message: "Invalid URL format" });
    }

    // Find and validate chat
    const chat = await Chat.findOne({ chatId });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (chat.mode !== "web") {
      return res.status(400).json({ 
        success: false, 
        message: "This chat is not in web scraping mode" 
      });
    }

    // Scrape the web page
    console.log(`Scraping URL: ${url}`);
    const rawText = await scrapeWebPage(url);

    // Add timeline event for scraping
    await addTimelineEvent(chat, 'web_scrape', `Scraped ${url}`);

    // Clean up scraped text using Groq LLM
    console.log('Cleaning scraped content with LLM...');
    const cleanedText = await cleanupScrape(rawText);

    // Add timeline event for AI generation
    await addTimelineEvent(chat, 'ai_generated', 'Cleaned web scrape result generated');

    // Generate chat title if this is the first result
    if (chat.title === 'Untitled Chat') {
      const title = await generateChatTitle(cleanedText);
      chat.title = title;
    }

    // Store scraped text as context for future Q&A
    chat.contextText = cleanedText;
    
    // Add messages: user scrape request + assistant scraped content
    chat.messages = [
      {
        role: 'user',
        content: `Scraped: ${url}`,
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
      url,
      scraped_at: new Date().toISOString(),
      messages: chat.messages
    });

  } catch (err) {
    console.error('Web scraping error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Web scraping failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route   POST /api/web/ask
 * @desc    Ask questions about scraped web content
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

    if (chat.mode !== "web") {
      return res.status(400).json({ success: false, message: "This chat is not in web scraping mode" });
    }

    if (!chat.contextText) {
      return res.status(400).json({ success: false, message: "No web content available. Please scrape a URL first." });
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
          content: `You are a helpful AI assistant. Answer questions about the following scraped web content. Be concise and accurate.\n\nScraped Content:\n${chat.contextText}`
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
    console.error('Web ask error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to process question",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route   GET /api/web/messages/:chatId
 * @desc    Get all messages for a web scraping chat
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
      console.log('Migrating old web chat to message format...');
      
      chat.messages = [
        {
          role: 'user',
          content: 'Web content scraped',
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
