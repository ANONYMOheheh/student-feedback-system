// My Feedback Page
// Displays student's past feedback submissions with star ratings and comments
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import StarRating from '../components/StarRating';

export default function MyFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/feedback/mine');
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your feedback history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFeedbacks();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-chat-square-quote-fill text-primary me-2"></i>
            My Submitted Feedback
          </h2>
          <p className="text-muted small mb-0">
            Review all previous feedback and ratings you submitted for faculty and courses.
          </p>
        </div>
        <div className="mt-2 mt-sm-0">
          <Link to="/student/feedback" className="btn btn-primary-dsce btn-sm">
            <i className="bi bi-plus-circle me-1"></i> Submit New Feedback
          </Link>
        </div>
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
          <p className="text-muted small mt-2">Loading your feedback history...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="card feedback-card border-0 shadow-sm text-center p-5">
          <div className="mb-3">
            <i className="bi bi-chat-dots text-muted display-4"></i>
          </div>
          <h4 className="fw-bold text-dark">No Feedback Submitted Yet</h4>
          <p className="text-muted mx-auto" style={{ maxWidth: '450px' }}>
            You haven't submitted feedback for any course yet. Select your courses and submit your ratings.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/student/courses" className="btn btn-outline-primary px-3">
              View Courses
            </Link>
            <Link to="/student/feedback" className="btn btn-primary-dsce px-3">
              Give Feedback
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {feedbacks.map((item) => (
            <div key={item.id} className="col-md-6">
              <div className="card h-100 feedback-card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-primary border border-primary fw-bold">
                      {item.course_code}
                    </span>
                    <span className="badge bg-secondary-subtle text-secondary small">
                      {item.semester}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{item.course_title}</h5>
                  <div className="text-muted small mb-3">
                    <i className="bi bi-person-video3 me-1 text-primary"></i>
                    Faculty: <strong>{item.faculty_name}</strong>
                  </div>

                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small fw-semibold text-secondary">Your Rating:</span>
                      <StarRating rating={item.rating} readOnly={true} size="md" />
                    </div>
                    <div className="mt-2 text-dark" style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
                      "{item.comments || 'No comments entered.'}"
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center text-muted small pt-2 border-top">
                    <span>
                      <i className="bi bi-calendar3 me-1"></i>
                      Submitted on: {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span className="badge bg-success-subtle text-success border border-success">
                      ✓ Recorded
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
