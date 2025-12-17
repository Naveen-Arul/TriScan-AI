const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * Make sure to set MONGO_URI in your .env file
 * Example: MONGO_URI=mongodb://localhost:27017/triscan-ai
 * Or use MongoDB Atlas: MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/triscan-ai
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
