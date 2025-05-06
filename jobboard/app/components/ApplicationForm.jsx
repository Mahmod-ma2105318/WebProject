import React from 'react'

export default function ApplicationForm({ jobId }) {
  return (
    <div className="application-form-container" style={{ display: 'none' }}>
      <form className="application-form" data-job-id={jobId}>
        <div className="form-group">
          <label htmlFor={`name-${jobId}`}>Full Name</label>
          <input type="text" id={`name-${jobId}`} name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor={`email-${jobId}`}>Email</label>
          <input type="email" id={`email-${jobId}`} name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor={`resume-${jobId}`}>Resume Link</label>
          <input type="url" id={`resume-${jobId}`} name="resume" required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Submit Application</button>
          <button type="button" className="btn btn-secondary cancel-application">Cancel</button>
        </div>
      </form>
    </div>
  );
}

