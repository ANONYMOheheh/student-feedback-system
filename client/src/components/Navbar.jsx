// Navigation Bar Component
// Dynamically adjusts navigation links based on user role (student, faculty, admin)
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top">
      <div className="container">
        {/* Brand / Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span className="fs-4">🎓</span>
          <div className="d-flex flex-column">
            <span className="lh-1">Student Feedback Portal</span>
            <span className="navbar-brand-badge mt-1 text-light">DSCE • MMCA314D</span>
          </div>
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Left Nav Links based on Role */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            {isAuthenticated && user?.role === 'student' && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                    to="/student/courses"
                  >
                    <i className="bi bi-journal-check me-1"></i> Select Courses
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                    to="/student/feedback"
                  >
                    <i className="bi bi-star-half me-1"></i> Give Feedback
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                    to="/student/my-feedback"
                  >
                    <i className="bi bi-chat-left-quote me-1"></i> My Feedback
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated && (user?.role === 'faculty' || user?.role === 'admin') && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                  to="/admin/dashboard"
                >
                  <i className="bi bi-speedometer2 me-1"></i> Feedback Dashboard
                </NavLink>
              </li>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                  to="/admin/add-course"
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Course
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Side: User Info & Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Student Credit Badge in Header */}
            <div className="student-credit-badge d-none d-md-inline-flex" title="Lab Project Developer">
              <i className="bi bi-person-fill"></i>
              <span>N VINAY (1DS25MC051)</span>
            </div>

            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <div className="text-end d-none d-sm-block text-white">
                  <div className="fw-semibold small">{user?.name}</div>
                  <span className={`badge ${
                    user?.role === 'admin' ? 'bg-danger' : user?.role === 'faculty' ? 'bg-info text-dark' : 'bg-success'
                  } text-capitalize`}>
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm rounded-pill px-3 ms-2"
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm rounded-pill px-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-warning btn-sm rounded-pill px-3 fw-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
