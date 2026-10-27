// Courses Routes
// Handles listing courses and adding new courses (Admin only)
const express = require('express');
const pool = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses/faculty-list -> List of faculty users for dropdown [Logged in: Admin/Faculty]
router.get('/faculty-list', authenticateToken, async (req, res) => {
  try {
    const [faculty] = await pool.query(
      'SELECT id, name, email FROM users WHERE role = "faculty" ORDER BY name ASC'
    );
    return res.json(faculty);
  } catch (error) {
    console.error('Fetch faculty error:', error);
    return res.status(500).json({ message: 'Error retrieving faculty list' });
  }
});

// GET /api/courses -> List all courses [Logged in]
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.id, 
        c.code, 
        c.title, 
        c.semester, 
        c.faculty_id,
        COALESCE(u.name, 'Not Assigned') AS faculty_name,
        u.email AS faculty_email
      FROM courses c
      LEFT JOIN users u ON c.faculty_id = u.id
      ORDER BY c.code ASC
    `;
    const [courses] = await pool.query(sql);
    return res.json(courses);
  } catch (error) {
    console.error('Fetch courses error:', error);
    return res.status(500).json({ message: 'Error retrieving courses' });
  }
});

// POST /api/courses -> Add a course [Admin]
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { code, title, semester, faculty_id } = req.body;

    if (!code || !title || !semester) {
      return res.status(400).json({ message: 'Course code, title, and semester are required' });
    }

    // Check if course code already exists
    const [existing] = await pool.query('SELECT id FROM courses WHERE code = ?', [code.trim().toUpperCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: `Course with code "${code}" already exists` });
    }

    // Insert course
    const [result] = await pool.query(
      'INSERT INTO courses (code, title, semester, faculty_id) VALUES (?, ?, ?, ?)',
      [code.trim().toUpperCase(), title.trim(), semester.trim(), faculty_id || null]
    );

    return res.status(201).json({
      message: 'Course created successfully',
      courseId: result.insertId,
      code: code.trim().toUpperCase(),
      title,
      semester,
      faculty_id: faculty_id || null
    });
  } catch (error) {
    console.error('Add course error:', error);
    return res.status(500).json({ message: 'Error adding new course' });
  }
});

module.exports = router;
