// Load environment variables FIRST (before any other imports)
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const chatRoutes = require('./routes/chat');
const ocrRoutes = require('./routes/ocr');
const webRoutes = require('./routes/web');
const compareRoutes = require('./routes/compare');
const userRoutes = require('./routes/user');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Enable CORS for frontend communication

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/web', webRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/user', userRoutes);

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

// Start server and connect to database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start Express server after DB connection
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV}`);
      console.log(`✅ API Base URL: http://localhost:${PORT}`);
      console.log(`\n🔧 All Routes available now`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
