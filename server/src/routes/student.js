// Student Specific Routes
// Handles course enrolment and fetching selected courses for the student
const express = require('express');
const pool = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Apply student authorization to all routes in this file
router.use(authenticateToken, authorizeRoles('student'));

// POST /api/student/courses -> Select (enrol in) a course [Student]
router.post('/courses', async (req, res) => {
  try {
    const studentId = req.user.id;
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({ message: 'course_id is required' });
    }

    // Verify course exists
    const [courseCheck] = await pool.query('SELECT id, code, title FROM courses WHERE id = ?', [course_id]);
    if (courseCheck.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student already enrolled
    const [alreadyEnrolled] = await pool.query(
      'SELECT id FROM student_courses WHERE student_id = ? AND course_id = ?',
      [studentId, course_id]
    );

    if (alreadyEnrolled.length > 0) {
      return res.status(400).json({ message: 'You have already selected/enrolled in this course' });
    }

    // Insert selection
    await pool.query(
      'INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)',
      [studentId, course_id]
    );

    return res.status(201).json({
      message: `Enrolled successfully in ${courseCheck[0].code} - ${courseCheck[0].title}`,
      course_id
    });
  } catch (error) {
    console.error('Enrol course error:', error);
    // Handle MySQL duplicate key error if any race condition occurs
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'You have already selected this course' });
    }
    return res.status(500).json({ message: 'Error enrolling in course' });
  }
});

// GET /api/student/courses -> My selected courses [Student]
router.get('/courses', async (req, res) => {
  try {
    const studentId = req.user.id;

    const sql = `
      SELECT 
        sc.id AS enrollment_id,
        c.id, 
        c.code, 
        c.title, 
        c.semester, 
        COALESCE(u.name, 'Not Assigned') AS faculty_name,
        CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS feedback_submitted
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      LEFT JOIN users u ON c.faculty_id = u.id
      LEFT JOIN feedback f ON f.course_id = c.id AND f.student_id = ?
      WHERE sc.student_id = ?
      ORDER BY c.code ASC
    `;

    const [courses] = await pool.query(sql, [studentId, studentId]);
    return res.json(courses);
  } catch (error) {
    console.error('Fetch student courses error:', error);
    return res.status(500).json({ message: 'Error retrieving your selected courses' });
  }
});

module.exports = router;
