// Star Rating Component
// Supports both interactive rating selection (1-5) and read-only display
import React, { useState } from 'react';

export default function StarRating({ rating = 0, onChange, readOnly = false, size = 'md' }) {
  const [hoverRating, setHoverRating] = useState(0);

  const starLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  const currentVal = hoverRating || rating;

  // Read-only display mode
  if (readOnly) {
    return (
      <div className="d-inline-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
            style={{ fontSize: size === 'sm' ? '0.9rem' : size === 'lg' ? '1.4rem' : '1.1rem' }}
          />
        ))}
        {rating > 0 && (
          <span className="ms-1 fw-bold text-dark small">({Number(rating).toFixed(1)})</span>
        )}
      </div>
    );
  }

  // Interactive selection mode
  return (
    <div>
      <div className="d-flex align-items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= currentVal;
          return (
            <button
              key={star}
              type="button"
              className="star-btn p-0"
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              title={`${star} Star${star > 1 ? 's' : ''} - ${starLabels[star]}`}
            >
              <i className={`bi ${isFilled ? 'bi-star-fill active' : 'bi-star text-secondary'}`} />
            </button>
          );
        })}
        {currentVal > 0 && (
          <span className="badge bg-warning text-dark ms-2 px-2 py-1 fs-6">
            {currentVal} ★ - {starLabels[currentVal]}
          </span>
        )}
      </div>
      <div className="form-text mt-1 text-muted">
        Click to rate the faculty and course quality on a scale of 1 to 5 stars.
      </div>
    </div>
  );
}
