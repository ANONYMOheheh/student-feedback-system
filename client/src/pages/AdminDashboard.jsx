// Admin & Faculty Feedback Dashboard
// Displays course performance summaries and granular feedback with course filtering
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [summaryData, setSummaryData] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load summary and course list on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [sumRes, coursesRes] = await Promise.all([
          api.get('/admin/summary'),
          api.get('/courses')
        ]);
        setSummaryData(sumRes.data);
        setCoursesList(coursesRes.data);

        // Fetch all feedback initially
        const fbRes = await api.get('/admin/feedback');
        setFeedbackList(fbRes.data);
      } catch (err) {
        console.error(err);
        setError('Error loading dashboard reports. Please re-login.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter feedback whenever selectedCourseFilter changes
  const handleFilterChange = async (courseId) => {
    setSelectedCourseFilter(courseId);
    try {
      setFeedbackLoading(true);
      const url = courseId === 'all' ? '/admin/feedback' : `/admin/feedback?courseId=${courseId}`;
      const res = await api.get(url);
      setFeedbackList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Aggregate stats calculations
  const totalResponses = summaryData.reduce((acc, curr) => acc + Number(curr.total_feedback || 0), 0);
  const totalRatedCourses = summaryData.filter((c) => Number(c.total_feedback) > 0);
  const overallAvg =
    totalRatedCourses.length > 0
      ? (
          totalRatedCourses.reduce((acc, curr) => acc + Number(curr.average_rating || 0), 0) /
          totalRatedCourses.length
        ).toFixed(2)
      : '0.00';

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="fw-bold text-dark mb-0">
              <i className="bi bi-speedometer2 text-primary me-2"></i>
              Feedback Analytics Dashboard
            </h2>
            <span className="badge bg-dark text-capitalize">{user?.role} View</span>
          </div>
          <p className="text-muted small mt-1 mb-0">
            Comprehensive student evaluation metrics, ratings, and feedback responses.
          </p>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-2 mt-sm-0">
            <Link to="/admin/add-course" className="btn btn-primary-dsce btn-sm">
              <i className="bi bi-plus-circle me-1"></i> Add New Course
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted small mt-2">Loading performance metrics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics Stat Boxes */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-box stat-box-primary shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50 small text-uppercase fw-bold">Total Courses</div>
                    <div className="fs-2 fw-bold">{summaryData.length}</div>
                  </div>
                  <i className="bi bi-journal-text fs-1 opacity-75"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-box stat-box-success shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50 small text-uppercase fw-bold">Total Responses</div>
                    <div className="fs-2 fw-bold">{totalResponses}</div>
                  </div>
                  <i className="bi bi-chat-heart fs-1 opacity-75"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-box stat-box-warning shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50 small text-uppercase fw-bold">Overall Average</div>
                    <div className="fs-2 fw-bold">{overallAvg} ★</div>
                  </div>
                  <i className="bi bi-star-fill fs-1 opacity-75"></i>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-box stat-box-info shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50 small text-uppercase fw-bold">Feedback Rate</div>
                    <div className="fs-2 fw-bold">
                      {summaryData.length > 0
                        ? Math.round((totalRatedCourses.length / summaryData.length) * 100)
                        : 0}
                      %
                    </div>
                  </div>
                  <i className="bi bi-pie-chart-fill fs-1 opacity-75"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Summary Table */}
          <div className="card feedback-card border-0 shadow-sm mb-5">
            <div className="card-header bg-white py-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">
                  <i className="bi bi-table me-2 text-primary"></i>
                  Course Feedback Summary
                </h5>
                <span className="badge bg-secondary-subtle text-secondary">
                  {summaryData.length} Courses Tracked
                </span>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Course Code</th>
                      <th>Course Title</th>
                      <th>Semester</th>
                      <th>Faculty In-Charge</th>
                      <th className="text-center">Responses</th>
                      <th>Average Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map((item) => (
                      <tr key={item.course_id}>
                        <td className="ps-4">
                          <span className="badge bg-primary-subtle text-primary fw-bold">
                            {item.course_code}
                          </span>
                        </td>
                        <td className="fw-semibold text-dark">{item.course_title}</td>
                        <td className="text-secondary small">{item.semester}</td>
                        <td className="text-dark small">
                          <i className="bi bi-person me-1 text-muted"></i>
                          {item.faculty_name}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary rounded-pill px-3 py-1">
                            {item.total_feedback}
                          </span>
                        </td>
                        <td>
                          {Number(item.total_feedback) > 0 ? (
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-warning text-dark fw-bold fs-6">
                                {Number(item.average_rating).toFixed(2)} ★
                              </span>
                              <StarRating rating={item.average_rating} readOnly={true} size="sm" />
                            </div>
                          ) : (
                            <span className="text-muted small fst-italic">No feedback yet</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 2: Feedback Details with Course Filter */}
          <div className="card feedback-card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-bottom">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <h5 className="mb-0 fw-bold text-dark">
                  <i className="bi bi-chat-left-text-fill me-2 text-primary"></i>
                  Detailed Student Feedback & Comments
                </h5>

                {/* Course Filter Dropdown */}
                <div className="d-flex align-items-center gap-2">
                  <label className="small fw-bold text-secondary mb-0 text-nowrap">
                    <i className="bi bi-funnel me-1"></i> Filter by Course:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    style={{ minWidth: '220px' }}
                    value={selectedCourseFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                  >
                    <option value="all">All Courses ({coursesList.length})</option>
                    {coursesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              {feedbackLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <span className="ms-2 small text-muted">Filtering feedback...</span>
                </div>
              ) : feedbackList.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-chat-square-dots text-muted display-6"></i>
                  <p className="text-muted mt-2 small">No feedback found for the selected course filter.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Student</th>
                        <th>Course</th>
                        <th>Rating</th>
                        <th style={{ width: '40%' }}>Student Comments</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbackList.map((fb) => (
                        <tr key={fb.id}>
                          <td className="ps-4">
                            <div className="fw-semibold text-dark">{fb.student_name}</div>
                            <div className="small text-muted">{fb.student_email}</div>
                          </td>
                          <td>
                            <span className="badge bg-light text-primary border border-primary me-1">
                              {fb.course_code}
                            </span>
                            <div className="small text-muted mt-1">{fb.course_title}</div>
                          </td>
                          <td>
                            <StarRating rating={fb.rating} readOnly={true} size="sm" />
                          </td>
                          <td>
                            <div className="text-dark py-1" style={{ fontSize: '0.92rem' }}>
                              "{fb.comments || 'No comments'}"
                            </div>
                          </td>
                          <td className="text-muted small text-nowrap">
                            {new Date(fb.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
