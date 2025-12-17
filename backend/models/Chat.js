const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatId: { type: String, required: true, unique: true },
  mode: { type: String, enum: ['ocr', 'web', 'compare'], required: true },
  preview: { type: String, default: '' },
  title: { type: String, default: 'Untitled Chat' },
  contextText: { type: String, default: '' }, // Store OCR/Web/Compare result for Q&A context
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  timeline: [
    {
      type: { type: String },
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);
