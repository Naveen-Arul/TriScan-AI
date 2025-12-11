const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 * 
 * Example cURL command:
 * curl -X POST http://localhost:5000/api/auth/signup \
 *   -H "Content-Type: application/json" \
 *   -d '{"name":"Naveen","email":"n@mail.com","password":"Pass123!","dob":"2005-08-24","gender":"Male","country":"India"}'
 * 
 * Example using fetch:
 * fetch('http://localhost:5000/api/auth/signup', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'Naveen',
 *     email: 'n@mail.com',
 *     password: 'Pass123!',
 *     dob: '2005-08-24',
 *     gender: 'Male',
 *     country: 'India'
 *   })
 * });
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, dob, gender, country } = req.body;

    // Validate required fields
    if (!name || !email || !password || !dob || !gender || !country) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, password, dob, gender, country'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password with bcryptjs (saltRounds: 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      passwordHash,
      dob: new Date(dob),
      gender,
      country
    });

    // Save user to database
    await newUser.save();

    // Create JWT token (Make sure to set JWT_SECRET in .env)
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response (do not return password)
    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        dob: newUser.dob,
        gender: newUser.gender,
        country: newUser.country
      },
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * 
 * Example cURL command:
 * curl -X POST http://localhost:5000/api/auth/login \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"n@mail.com","password":"Pass123!"}'
 * 
 * Example using fetch:
 * fetch('http://localhost:5000/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'n@mail.com',
 *     password: 'Pass123!'
 *   })
 * });
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token (same as signup)
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response (do not return password)
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        country: user.country
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
