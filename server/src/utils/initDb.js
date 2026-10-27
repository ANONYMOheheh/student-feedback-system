// Database initialization and seeding script
// Automatically creates DB, tables, and seeds initial data if empty
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Root@1234';
const DB_NAME = process.env.DB_NAME || 'student_feedback_db';

async function initDatabase() {
  let connection;
  try {
    console.log('[DB] Connecting to MySQL server to check/create database...');
    // 1. Connect without selecting database
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD
    });

    // 2. Create database if it does not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`[DB] Database "${DB_NAME}" verified/created successfully.`);
    await connection.end();

    // 3. Connect to the specific database
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true
    });

    // 4. Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../../schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('[DB] Schema and tables verified/created successfully.');
    } else {
      console.warn('[DB] schema.sql not found at', schemaPath);
    }

    // 5. Check if users table has records
    const [userRows] = await connection.query('SELECT COUNT(*) AS count FROM users');
    const userCount = userRows[0].count;

    if (userCount === 0) {
      console.log('[DB] Empty tables detected. Seeding demo data...');

      // Pre-hash passwords
      const adminHash = await bcrypt.hash('Admin@123', 10);
      const facultyHash = await bcrypt.hash('Faculty@123', 10);
      const studentHash = await bcrypt.hash('Student@123', 10);

      // Seed Users (1 admin, 1 faculty, 3 students)
      const [adminResult] = await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin DSCE', 'admin@dsce.edu', adminHash, 'admin']
      );
      const adminId = adminResult.insertId;

      const [facultyResult] = await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Dr. K. S. Sharma', 'faculty@dsce.edu', facultyHash, 'faculty']
      );
      const facultyId = facultyResult.insertId;

      const [s1Result] = await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['N Vinay', 'student1@dsce.edu', studentHash, 'student']
      );
      const s1Id = s1Result.insertId;

      const [s2Result] = await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Rahul Verma', 'student2@dsce.edu', studentHash, 'student']
      );
      const s2Id = s2Result.insertId;

      const [s3Result] = await connection.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Pooja Hegde', 'student3@dsce.edu', studentHash, 'student']
      );
      const s3Id = s3Result.insertId;

      console.log('[DB] Seeded 5 users (1 admin, 1 faculty, 3 students).');

      // Seed 5 Courses
      const coursesData = [
        ['MCA301', 'Advanced Java Programming', '3rd Semester', facultyId],
        ['MCA302', 'Full Stack Web Development', '3rd Semester', facultyId],
        ['MCA303', 'Cloud Computing & DevOps', '3rd Semester', facultyId],
        ['MCA304', 'Machine Learning & AI', '3rd Semester', facultyId],
        ['MCA305', 'Software Testing & QA', '3rd Semester', facultyId]
      ];

      const courseIds = [];
      for (const c of coursesData) {
        const [cRes] = await connection.query(
          'INSERT INTO courses (code, title, semester, faculty_id) VALUES (?, ?, ?, ?)',
          c
        );
        courseIds.push(cRes.insertId);
      }
      console.log('[DB] Seeded 5 courses.');

      // Seed Student Course Selections
      // Student 1 (N Vinay) enroled in courses 0, 1, 2, 3
      // Student 2 (Rahul) enroled in courses 0, 1, 3, 4
      // Student 3 (Pooja) enroled in courses 1, 2, 3, 4
      const enrolments = [
        [s1Id, courseIds[0]],
        [s1Id, courseIds[1]],
        [s1Id, courseIds[2]],
        [s1Id, courseIds[3]],

        [s2Id, courseIds[0]],
        [s2Id, courseIds[1]],
        [s2Id, courseIds[3]],
        [s2Id, courseIds[4]],

        [s3Id, courseIds[1]],
        [s3Id, courseIds[2]],
        [s3Id, courseIds[3]],
        [s3Id, courseIds[4]]
      ];

      for (const [stId, crId] of enrolments) {
        await connection.query(
          'INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)',
          [stId, crId]
        );
      }
      console.log('[DB] Seeded student course enrolments.');

      // Seed 8 Feedback rows
      const feedbackRows = [
        [s1Id, courseIds[0], 5, 'Excellent coverage of Multithreading, Streams, and JVM architecture.'],
        [s1Id, courseIds[1], 5, 'Loved the hands-on MERN and MySQL full stack projects. Very practical!'],
        [s1Id, courseIds[2], 4, 'Great exposure to Docker containers and AWS deployment pipelines.'],
        [s2Id, courseIds[0], 4, 'Very good clarity on Spring Framework and enterprise design patterns.'],
        [s2Id, courseIds[1], 5, 'Super clear explanations of REST APIs, JWT tokens, and React components.'],
        [s2Id, courseIds[3], 4, 'Well explained supervised learning and regression models with scikit-learn.'],
        [s3Id, courseIds[1], 5, 'Outstanding course delivery and interactive practical coding sessions.'],
        [s3Id, courseIds[4], 4, 'Good practical sessions on writing unit tests and automated test suites.']
      ];

      for (const [stId, crId, rating, comments] of feedbackRows) {
        await connection.query(
          'INSERT INTO feedback (student_id, course_id, rating, comments) VALUES (?, ?, ?, ?)',
          [stId, crId, rating, comments]
        );
      }
      console.log('[DB] Seeded 8 sample feedback submissions.');
      console.log('[DB] Database seeding completed successfully.');
    } else {
      console.log(`[DB] Database already contains ${userCount} users. Skipping seeding.`);
    }
  } catch (error) {
    console.error('[DB] Database initialization failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = initDatabase;
