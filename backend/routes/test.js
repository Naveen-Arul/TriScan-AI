const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/test/health
 * @desc    Health check endpoint for deployment monitoring
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @route   GET /api/test/protected
 * @desc    Test protected route - requires valid JWT token
 * @access  Private
 * 
 * Example cURL command:
 * curl -X GET http://localhost:5000/api/test/protected \
 *   -H "Authorization: Bearer <TOKEN_HERE>"
 * 
 * Replace <TOKEN_HERE> with the token you received from /signup or /login
 * 
 * Example using fetch:
 * fetch('http://localhost:5000/api/test/protected', {
 *   headers: {
 *     'Authorization': 'Bearer ' + yourToken
 *   }
 * });
 */
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted',
    user: req.user
  });
});

module.exports = router;
