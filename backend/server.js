const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const chatRoutes = require('./routes/chat');
const ocrRoutes = require('./routes/ocr');
const webRoutes = require('./routes/web');
const compareRoutes = require('./routes/compare');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cors()); // Enable CORS for frontend communication

// Connect to MongoDB
connectDB();
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/web', webRoutes);
app.use('/api/compare', compareRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'TriScan AI Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
