// Feedback Routes (Student Feedback Submission & View Mine)
const express = require('express');
const pool = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Apply student authorization
router.use(authenticateToken, authorizeRoles('student'));

// POST /api/feedback -> Submit rating + comments for a course [Student]
router.post('/', async (req, res) => {
  try {
    const studentId = req.user.id;
    const { course_id, rating, comments } = req.body;

    // Validate inputs
    if (!course_id) {
      return res.status(400).json({ message: 'Course selection is required' });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5 stars' });
    }

    // Check if student is enrolled in this course
    const [enrolled] = await pool.query(
      'SELECT id FROM student_courses WHERE student_id = ? AND course_id = ?',
      [studentId, course_id]
    );

    if (enrolled.length === 0) {
      return res.status(400).json({
        message: 'You can only submit feedback for courses you have selected/enrolled in'
      });
    }

    // Check if duplicate feedback exists for this student and course
    const [existingFeedback] = await pool.query(
      'SELECT id FROM feedback WHERE student_id = ? AND course_id = ?',
      [studentId, course_id]
    );

    if (existingFeedback.length > 0) {
      return res.status(400).json({
        message: 'You have already submitted feedback for this course. Only one submission is allowed per course.'
      });
    }

    // Insert new feedback
    const [result] = await pool.query(
      'INSERT INTO feedback (student_id, course_id, rating, comments) VALUES (?, ?, ?, ?)',
      [studentId, course_id, numericRating, comments ? comments.trim() : '']
    );

    return res.status(201).json({
      message: 'Feedback submitted successfully! Thank you for your valuable response.',
      feedbackId: result.insertId
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'You have already submitted feedback for this course. Only one submission is allowed.'
      });
    }
    return res.status(500).json({ message: 'Error submitting feedback. Please try again.' });
  }
});

// GET /api/feedback/mine -> My submitted feedback [Student]
router.get('/mine', async (req, res) => {
  try {
    const studentId = req.user.id;

    const sql = `
      SELECT 
        f.id,
        f.course_id,
        c.code AS course_code,
        c.title AS course_title,
        c.semester,
        COALESCE(u.name, 'Not Assigned') AS faculty_name,
        f.rating,
        f.comments,
        f.created_at
      FROM feedback f
      JOIN courses c ON f.course_id = c.id
      LEFT JOIN users u ON c.faculty_id = u.id
      WHERE f.student_id = ?
      ORDER BY f.created_at DESC
    `;

    const [myFeedbacks] = await pool.query(sql, [studentId]);
    return res.json(myFeedbacks);
  } catch (error) {
    console.error('Fetch my feedback error:', error);
    return res.status(500).json({ message: 'Error retrieving your feedback history' });
  }
});

module.exports = router;
