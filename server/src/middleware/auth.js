// Authentication & Authorization Middleware
// Verifies JWT token and checks user roles
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dsce_mca_feedback_secret_key_2026';

// Middleware to verify JWT token from Authorization header
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Token format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    // Attach user payload (id, name, email, role) to request
    req.user = decodedUser;
    next();
  });
}

// Middleware to authorize specific roles (e.g. 'admin', 'faculty', 'student')
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};
