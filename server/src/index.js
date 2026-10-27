// Main Server Entry Point
// Dayananda Sagar College of Engineering (MMCA314D)
// Student: N VINAY (1DS25MC051)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const initDatabase = require('./utils/initDb');

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger for viva demonstration
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root & Healthcheck Endpoints
app.get('/', (req, res) => {
  res.json({
    project: 'Online Student Feedback System',
    college: 'Dayananda Sagar College of Engineering',
    student: 'N VINAY (USN: 1DS25MC051)',
    status: 'Server is running',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Mount Application Routes
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const studentRoutes = require('./routes/student');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    message: 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server after verifying/initializing database
async function startServer() {
  try {
    console.log('----------------------------------------------------');
    console.log('Initializing Online Student Feedback System Server...');
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`✓ Server running successfully on http://localhost:${PORT}`);
      console.log(`✓ API Base: http://localhost:${PORT}/api`);
      console.log('----------------------------------------------------');
    });
  } catch (error) {
    console.error('FATAL: Could not initialize database or start server:', error.message);
    process.exit(1);
  }
}

startServer();
