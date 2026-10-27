// Add Course Page (Admin Only)
// Allows administrator to register new courses into the academic curriculum
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function AddCourse() {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('3rd Semester');
  const [facultyId, setFacultyId] = useState('');
  const [facultyList, setFacultyList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch faculty members for dropdown
    const fetchFaculty = async () => {
      try {
        const res = await api.get('/courses/faculty-list');
        setFacultyList(res.data);
        if (res.data.length > 0) {
          setFacultyId(String(res.data[0].id));
        }
      } catch (err) {
        console.error('Failed to load faculty list:', err);
      }
    };
    fetchFaculty();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!code.trim() || !title.trim() || !semester.trim()) {
      setError('Please fill in Course Code, Title, and Semester.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/courses', {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        semester: semester.trim(),
        faculty_id: facultyId ? Number(facultyId) : null
      });

      setSuccess(`Course "${res.data.code} - ${res.data.title}" added successfully!`);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h2 className="fw-bold text-dark mb-1">
                <i className="bi bi-plus-square-fill text-primary me-2"></i>
                Add New Course
              </h2>
              <p className="text-muted small mb-0">
                Register a new subject for students to enrol and review.
              </p>
            </div>
            <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </Link>
          </div>

          {success && (
            <div className="alert alert-success d-flex align-items-center shadow-sm" role="alert">
              <i className="bi bi-check-circle-fill me-2 fs-5"></i>
              <div>{success}</div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          <div className="card feedback-card border-0 shadow-sm">
            <div className="card-body p-4 p-sm-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">Course Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. MCA306"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                  <div className="form-text">Course code must be unique (e.g. MCA301, MCA302).</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">Course Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mobile Application Development"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">Semester</label>
                  <select
                    className="form-select"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-dark small">Assign Faculty In-Charge</label>
                  <select
                    className="form-select"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                  >
                    <option value="">-- Select Faculty (Optional) --</option>
                    {facultyList.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary-dsce px-4 py-2 d-flex align-items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Adding Course...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle"></i>
                        <span>Save Course</span>
                      </>
                    )}
                  </button>
                  <Link to="/admin/dashboard" className="btn btn-outline-secondary px-3 py-2">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
