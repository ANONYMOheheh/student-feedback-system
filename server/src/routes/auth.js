// Authentication Routes (Register and Login)
// Uses bcrypt for hashing and jsonwebtoken for session token
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dsce_mca_feedback_secret_key_2026';

// POST /api/auth/register -> Student registration [Public]
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if email already exists
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password securely
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Register user with 'student' role
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'student']
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      role: 'student'
    };

    // Generate JWT token
    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '1d' });

    return res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// POST /api/auth/login -> Login, returns JWT + role [Public]
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // User payload for token
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Sign JWT token
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      message: 'Login successful',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
});

// GET /api/auth/me -> Returns current logged-in user profile [Logged in]
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user: users[0] });
  } catch (error) {
    console.error('Fetch me error:', error);
    return res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

module.exports = router;
