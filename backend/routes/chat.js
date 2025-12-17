const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/authMiddleware');
const Chat = require('../models/Chat');

const router = express.Router();

/**
 * @route   POST /api/chat/new
 * @desc    Create a new chat session
 * @access  Private
 * 
 * Example cURL command:
 * curl -X POST http://localhost:5000/api/chat/new \
 *   -H "Authorization: Bearer <TOKEN>" \
 *   -H "Content-Type: application/json" \
 *   -d '{"mode":"ocr"}'
 */
router.post('/new', authMiddleware, async (req, res) => {
  try {
    const { mode } = req.body;

    if (!['ocr', 'web', 'compare'].includes(mode)) {
      return res.status(400).json({ success: false, message: 'Invalid mode' });
    }

    const chat = new Chat({
      userId: req.user.userId,
      chatId: uuidv4(),
      mode
    });

    await chat.save();

    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating chat' });
  }
});

/**
 * @route   GET /api/chat/history
 * @desc    Get chat history for authenticated user
 * @access  Private
 * 
 * Example cURL command:
 * curl -X GET http://localhost:5000/api/chat/history \
 *   -H "Authorization: Bearer <TOKEN>"
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, history: chats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
});

/**
 * @route   DELETE /api/chat/:chatId
 * @desc    Delete a chat session
 * @access  Private
 * 
 * Example cURL command:
 * curl -X DELETE http://localhost:5000/api/chat/<CHAT_ID> \
 *   -H "Authorization: Bearer <TOKEN>"
 */
router.delete('/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ chatId, userId: req.user.userId });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    await Chat.deleteOne({ chatId, userId: req.user.userId });

    res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting chat' });
  }
});

module.exports = router;
