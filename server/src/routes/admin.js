// Admin and Faculty Dashboard Routes
// Provides course summaries and feedback reports
const express = require('express');
const pool = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Both 'faculty' and 'admin' are authorized for summary and feedback reports
router.use(authenticateToken, authorizeRoles('faculty', 'admin'));

// GET /api/admin/feedback?courseId= -> All feedback with optional course filter [Faculty/Admin]
router.get('/feedback', async (req, res) => {
  try {
    const { courseId } = req.query;

    let sql = `
      SELECT 
        f.id,
        f.course_id,
        c.code AS course_code,
        c.title AS course_title,
        c.semester,
        COALESCE(u_fac.name, 'Not Assigned') AS faculty_name,
        f.student_id,
        u_stud.name AS student_name,
        u_stud.email AS student_email,
        f.rating,
        f.comments,
        f.created_at
      FROM feedback f
      JOIN courses c ON f.course_id = c.id
      LEFT JOIN users u_fac ON c.faculty_id = u_fac.id
      JOIN users u_stud ON f.student_id = u_stud.id
    `;

    const params = [];

    // Filter by courseId if supplied
    if (courseId && courseId !== 'all') {
      sql += ' WHERE f.course_id = ?';
      params.push(courseId);
    }

    sql += ' ORDER BY f.created_at DESC';

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error('Fetch all feedback error:', error);
    return res.status(500).json({ message: 'Error retrieving feedback records' });
  }
});

// GET /api/admin/summary -> Average rating and response count per course [Faculty/Admin]
router.get('/summary', async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.id AS course_id,
        c.code AS course_code,
        c.title AS course_title,
        c.semester,
        COALESCE(u.name, 'Not Assigned') AS faculty_name,
        COUNT(f.id) AS total_feedback,
        COALESCE(ROUND(AVG(f.rating), 2), 0.00) AS average_rating
      FROM courses c
      LEFT JOIN users u ON c.faculty_id = u.id
      LEFT JOIN feedback f ON c.id = f.course_id
      GROUP BY c.id, c.code, c.title, c.semester, u.name
      ORDER BY c.code ASC
    `;

    const [summary] = await pool.query(sql);
    return res.json(summary);
  } catch (error) {
    console.error('Fetch summary error:', error);
    return res.status(500).json({ message: 'Error generating course feedback summary' });
  }
});

module.exports = router;
