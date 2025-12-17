/**
 * Timeline Service
 * Manages chat timeline events for activity tracking
 */

/**
 * Add a timeline event to a chat
 * @param {Object} chat - Chat document
 * @param {string} type - Event type (ocr_upload, web_scrape, compare_upload, ai_generated)
 * @param {string} message - Event message
 */
async function addTimelineEvent(chat, type, message) {
  chat.timeline.push({
    type,
    message,
    timestamp: new Date()
  });

  await chat.save();
}

module.exports = { addTimelineEvent };
