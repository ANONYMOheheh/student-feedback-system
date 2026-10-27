// Login Page Component
// Includes form validation and quick 1-click demo logins for viva examination
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      // Navigate based on user role
      if (user.role === 'student') {
        navigate('/student/courses');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for presentation/evaluation
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card feedback-card border-0 shadow-sm">
            <div className="card-body p-4 p-sm-5">
              <div className="text-center mb-4">
                <div className="display-5 text-primary mb-2">🎓</div>
                <h3 className="fw-bold text-dark">Welcome Back</h3>
                <p className="text-muted small">
                  Sign in to the DSCE Online Student Feedback Portal
                </p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <span className="small">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="e.g. student1@dsce.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary-dsce w-100 py-2 d-flex justify-content-center align-items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Logins for Viva / Evaluation */}
              <div className="mt-4 pt-3 border-top">
                <div className="small text-muted fw-semibold mb-2 text-center">
                  ⚡ Quick Demo Accounts (Click to Fill):
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('student1@dsce.edu', 'Student@123')}
                    className="btn btn-sm btn-outline-success rounded-pill px-2"
                  >
                    👤 Student (Vinay)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('faculty@dsce.edu', 'Faculty@123')}
                    className="btn btn-sm btn-outline-info rounded-pill px-2"
                  >
                    👨‍🏫 Faculty
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('admin@dsce.edu', 'Admin@123')}
                    className="btn btn-sm btn-outline-danger rounded-pill px-2"
                  >
                    🛡️ Admin
                  </button>
                </div>
              </div>

              <div className="text-center mt-4">
                <span className="text-muted small">New student? </span>
                <Link to="/register" className="small fw-semibold text-primary text-decoration-none">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
