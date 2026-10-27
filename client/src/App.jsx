// Main Application Router & Layout
// Dayananda Sagar College of Engineering (MMCA314D) - N VINAY (1DS25MC051)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import SelectCourses from './pages/SelectCourses';
import GiveFeedback from './pages/GiveFeedback';
import MyFeedback from './pages/MyFeedback';
import AdminDashboard from './pages/AdminDashboard';
import AddCourse from './pages/AddCourse';

// Root redirector based on authentication and role
function HomeRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'student') {
    return <Navigate to="/student/courses" replace />;
  } else {
    return <Navigate to="/admin/dashboard" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="main-content flex-grow-1">
            <Routes>
              {/* Home & Public Routes */}
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Protected Routes */}
              <Route
                path="/student/courses"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <SelectCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/feedback"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <GiveFeedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/my-feedback"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MyFeedback />
                  </ProtectedRoute>
                }
              />

              {/* Faculty & Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only Protected Routes */}
              <Route
                path="/admin/add-course"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddCourse />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
