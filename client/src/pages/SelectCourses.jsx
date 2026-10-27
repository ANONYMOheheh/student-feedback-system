// Select Courses Page (Student Enrolment)
// Lists available courses and allows students to select/enrol in them
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function SelectCourses() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Load both all available courses and student's enrolled courses
  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRes, myRes] = await Promise.all([
        api.get('/courses'),
        api.get('/student/courses')
      ]);
      setCourses(allRes.data);
      setMyCourses(myRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load courses. Please check your network or login session.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Enrol in course handler
  const handleSelectCourse = async (courseId, courseTitle) => {
    try {
      setActionLoading(courseId);
      setMessage(null);
      setError(null);

      const res = await api.post('/student/courses', { course_id: courseId });
      setMessage(res.data.message || `Enrolled in ${courseTitle} successfully!`);
      // Refresh my enrolled courses
      const myRes = await api.get('/student/courses');
      setMyCourses(myRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Could not enrol in this course.');
    } finally {
      setActionLoading(null);
    }
  };

  // Set of enrolled course IDs
  const enrolledCourseIds = new Set(myCourses.map((c) => c.id));

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-journal-bookmark-fill text-primary me-2"></i>
            Select Courses
          </h2>
          <p className="text-muted small mb-0">
            Enrol in your semester subjects to evaluate and provide feedback for faculty members.
          </p>
        </div>
        <div className="mt-2 mt-sm-0">
          <span className="badge bg-primary px-3 py-2 fs-6">
            <i className="bi bi-check2-circle me-1"></i>
            Selected: {myCourses.length} of {courses.length} Courses
          </span>
        </div>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill fs-5 me-2"></i>
          <div>{message}</div>
          <button type="button" className="btn-close" onClick={() => setMessage(null)} aria-label="Close"></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading courses...</span>
          </div>
          <p className="text-muted mt-2 small">Loading semester courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <h5 className="mt-2 text-secondary">No courses available</h5>
          <p className="text-muted small">Please contact the department administrator to add courses.</p>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => {
            const isSelected = enrolledCourseIds.has(course.id);
            const myEnrolment = myCourses.find((c) => c.id === course.id);
            const hasSubmittedFeedback = myEnrolment?.feedback_submitted === 1;

            return (
              <div key={course.id} className="col-md-6 col-lg-4">
                <div className={`card h-100 feedback-card ${isSelected ? 'border-primary' : 'border-0'}`}>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-light text-primary border border-primary px-2 py-1 fw-bold">
                        {course.code}
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary small">
                        {course.semester}
                      </span>
                    </div>

                    <h5 className="card-title fw-bold text-dark mt-2 mb-3">
                      {course.title}
                    </h5>

                    <div className="text-muted small mb-4 flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <i className="bi bi-person-video3 me-2 text-primary"></i>
                        <span>Faculty: <strong className="text-dark">{course.faculty_name}</strong></span>
                      </div>
                      {course.faculty_email && (
                        <div className="d-flex align-items-center">
                          <i className="bi bi-envelope me-2 text-muted"></i>
                          <span>{course.faculty_email}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-top mt-auto">
                      {isSelected ? (
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-success-subtle text-success px-2 py-1 border border-success">
                              <i className="bi bi-check-circle-fill me-1"></i> Enrolled
                            </span>
                            {hasSubmittedFeedback && (
                              <span className="badge bg-info-subtle text-info px-2 py-1 border border-info">
                                <i className="bi bi-star-fill text-warning me-1"></i> Feedback Given
                              </span>
                            )}
                          </div>
                          {!hasSubmittedFeedback ? (
                            <Link
                              to={`/student/feedback?courseId=${course.id}`}
                              className="btn btn-outline-primary btn-sm w-100 mt-1"
                            >
                              <i className="bi bi-pencil-square me-1"></i> Give Feedback
                            </Link>
                          ) : (
                            <Link
                              to="/student/my-feedback"
                              className="btn btn-light btn-sm text-secondary w-100 mt-1 border"
                            >
                              <i className="bi bi-eye me-1"></i> View Submitted Feedback
                            </Link>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectCourse(course.id, course.title)}
                          disabled={actionLoading === course.id}
                          className="btn btn-primary-dsce btn-sm w-100 d-flex justify-content-center align-items-center gap-2"
                        >
                          {actionLoading === course.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                              <span>Enrolling...</span>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus-circle"></i>
                              <span>Select / Enrol in Course</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
