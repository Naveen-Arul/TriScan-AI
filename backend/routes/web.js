const express = require('express');
const Chat = require('../models/Chat');
const authMiddleware = require('../middleware/authMiddleware');
const { scrapeWebPage, isValidUrl } = require('../services/webScraper');
const { cleanupScrape } = require('../services/llmService');

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

    // Clean up scraped text using Groq LLM
    console.log('Cleaning scraped content with LLM...');
    const cleanedText = await cleanupScrape(rawText);

    // Update chat preview with first 200 characters
    chat.preview = cleanedText.slice(0, 200);
    chat.updatedAt = new Date();
    await chat.save();

    res.json({
      success: true,
      clean_text: cleanedText,
      raw_text: rawText,
      url,
      scraped_at: new Date().toISOString()
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

module.exports = router;
