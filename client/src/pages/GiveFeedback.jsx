// Give Feedback Page (Student Feedback Form)
// Allows rating (1-5 stars) and comments on enrolled courses with duplicate prevention
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import StarRating from '../components/StarRating';

export default function GiveFeedback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseId, setCourseId] = useState(searchParams.get('courseId') || '');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load student's enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/courses');
        setSelectedCourses(res.data);

        // If courseId query param was provided and matches, keep it; otherwise default to first pending course
        const urlParamId = searchParams.get('courseId');
        if (urlParamId && res.data.some((c) => String(c.id) === String(urlParamId))) {
          setCourseId(urlParamId);
        } else if (res.data.length > 0) {
          // Default to the first course that doesn't have feedback yet, if possible
          const pending = res.data.find((c) => c.feedback_submitted === 0);
          setCourseId(pending ? String(pending.id) : String(res.data[0].id));
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load your enrolled courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [searchParams]);

  // Selected course object
  const currentCourse = selectedCourses.find((c) => String(c.id) === String(courseId));
  const isAlreadySubmitted = currentCourse?.feedback_submitted === 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!courseId) {
      setErrorMsg('Please select a course to evaluate.');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setErrorMsg('Please select a star rating from 1 to 5.');
      return;
    }

    if (!comments.trim()) {
      setErrorMsg('Please provide a constructive comment or suggestion.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/feedback', {
        course_id: Number(courseId),
        rating: Number(rating),
        comments: comments.trim()
      });

      setSuccessMsg(res.data.message || 'Feedback submitted successfully! Thank you.');

      // Update local state to mark this course as submitted
      setSelectedCourses((prev) =>
        prev.map((c) => (String(c.id) === String(courseId) ? { ...c, feedback_submitted: 1 } : c))
      );

      // Optional: reset comments
      setComments('');

      // Auto redirect to My Feedback after 2.5 seconds
      setTimeout(() => {
        navigate('/student/my-feedback');
      }, 2500);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
          'Failed to submit feedback. You may have already submitted feedback for this course.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h2 className="fw-bold text-dark mb-1">
                <i className="bi bi-star-half text-warning me-2"></i>
                Course & Faculty Feedback
              </h2>
              <p className="text-muted small mb-0">
                Submit your honest rating and constructive review for your selected subjects.
              </p>
            </div>
            <Link to="/student/my-feedback" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-clock-history me-1"></i> My Submissions
            </Link>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="alert alert-success d-flex align-items-center shadow-sm p-3 mb-4 rounded-3" role="alert">
              <i className="bi bi-check-circle-fill text-success fs-3 me-3"></i>
              <div>
                <h6 className="alert-heading fw-bold mb-1">Feedback Submitted Successfully!</h6>
                <p className="mb-0 small">{successMsg}</p>
                <div className="mt-2 small text-muted">
                  Redirecting to your submissions page in a moment, or{' '}
                  <Link to="/student/my-feedback" className="fw-bold text-success text-decoration-none">
                    click here now
                  </Link>.
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="alert alert-danger d-flex align-items-center shadow-sm p-3 mb-4 rounded-3" role="alert">
              <i className="bi bi-exclamation-octagon-fill text-danger fs-3 me-3"></i>
              <div>
                <h6 className="alert-heading fw-bold mb-1">Notice</h6>
                <p className="mb-0 small">{errorMsg}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted small mt-2">Loading your enrolled courses...</p>
            </div>
          ) : selectedCourses.length === 0 ? (
            /* No enrolled courses warning */
            <div className="card feedback-card border-0 shadow-sm text-center p-5">
              <div className="mb-3">
                <i className="bi bi-journal-x text-warning display-4"></i>
              </div>
              <h4 className="fw-bold text-dark">No Selected Courses Found</h4>
              <p className="text-muted mx-auto" style={{ maxWidth: '480px' }}>
                You have not selected or enrolled in any courses yet. You must first select your semester courses
                before you can provide feedback for faculty members.
              </p>
              <div>
                <Link to="/student/courses" className="btn btn-primary-dsce px-4">
                  <i className="bi bi-plus-circle me-2"></i> Go to Select Courses
                </Link>
              </div>
            </div>
          ) : (
            /* Feedback Form Card */
            <div className="card feedback-card border-0 shadow-sm">
              <div className="card-body p-4 p-sm-5">
                <form onSubmit={handleSubmit}>
                  {/* Course Dropdown */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">
                      1. Select Course to Review <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value={courseId}
                      onChange={(e) => {
                        setCourseId(e.target.value);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      required
                    >
                      {selectedCourses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} - {c.title} ({c.faculty_name}) {c.feedback_submitted ? ' [✓ Already Submitted]' : ''}
                        </option>
                      ))}
                    </select>
                    <div className="form-text text-muted">
                      Courses in this list are filtered from your enrolled course list.
                    </div>
                  </div>

                  {/* Duplicate warning notification if already submitted */}
                  {isAlreadySubmitted && (
                    <div className="alert alert-warning d-flex align-items-center mb-4 py-2" role="alert">
                      <i className="bi bi-info-circle-fill fs-5 me-2"></i>
                      <div className="small">
                        <strong>Already Submitted:</strong> You have already submitted feedback for this course. Each student can submit only one feedback per subject.
                      </div>
                    </div>
                  )}

                  {/* Course info display pill */}
                  {currentCourse && (
                    <div className="bg-light p-3 rounded-3 mb-4 border d-flex flex-wrap justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-primary">{currentCourse.title} ({currentCourse.code})</div>
                        <div className="small text-muted">
                          Faculty: <span className="text-dark fw-medium">{currentCourse.faculty_name}</span> &nbsp;|&nbsp;
                          Semester: <span className="text-dark">{currentCourse.semester}</span>
                        </div>
                      </div>
                      <span className={`badge ${isAlreadySubmitted ? 'bg-secondary' : 'bg-success'} mt-2 mt-sm-0`}>
                        {isAlreadySubmitted ? 'Feedback Recorded' : 'Ready for Feedback'}
                      </span>
                    </div>
                  )}

                  {/* 1-5 Star Interactive Rating */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark d-block">
                      2. Course & Faculty Rating (1 - 5 Stars) <span className="text-danger">*</span>
                    </label>
                    <div className="p-3 bg-light rounded-3 border">
                      <StarRating
                        rating={rating}
                        onChange={(newRating) => setRating(newRating)}
                        readOnly={isAlreadySubmitted}
                        size="lg"
                      />
                    </div>
                  </div>

                  {/* Feedback Comments */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark">
                      3. Detailed Feedback & Comments <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Share your thoughts on lecture delivery, syllabus coverage, lab practicals, clarity of doubts, and study materials..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      disabled={isAlreadySubmitted}
                      required
                    ></textarea>
                    <div className="form-text text-muted">
                      Please provide constructive feedback to help faculty improve curriculum delivery.
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-flex gap-3 align-items-center">
                    <button
                      type="submit"
                      disabled={submitting || isAlreadySubmitted}
                      className="btn btn-primary-dsce px-4 py-2 d-flex align-items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          <span>Submitting Feedback...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill"></i>
                          <span>{isAlreadySubmitted ? 'Feedback Already Submitted' : 'Submit Feedback'}</span>
                        </>
                      )}
                    </button>

                    {isAlreadySubmitted && (
                      <Link to="/student/my-feedback" className="btn btn-outline-primary">
                        <i className="bi bi-eye me-1"></i> View My Feedback
                      </Link>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
