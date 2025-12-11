const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * Make sure to set MONGO_URI in your .env file
 * Example: MONGO_URI=mongodb://localhost:27017/triscan-ai
 * Or use MongoDB Atlas: MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/triscan-ai
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
