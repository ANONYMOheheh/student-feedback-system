// Footer Component
// Displays academic credentials, subject info, and student details
import React from 'react';

export default function Footer() {
  return (
    <footer className="custom-footer mt-auto py-3">
      <div className="container">
        <div className="row align-items-center gy-2">
          <div className="col-md-6 text-center text-md-start">
            <h6 className="mb-1 text-light fw-bold">Dayananda Sagar College of Engineering</h6>
            <p className="mb-0 small text-secondary">
              Department of Master of Computer Applications • MMCA314D: Web Development using Full Stack Open
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="small text-secondary">
              Developed by: <span className="text-white fw-semibold">N VINAY</span> &nbsp;|&nbsp; USN: <span className="text-warning fw-semibold">1DS25MC051</span>
            </div>
            <div className="small text-muted mt-1">
              MCA Lab Project • React + Node.js + Express + MySQL
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
