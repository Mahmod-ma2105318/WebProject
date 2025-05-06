import React from 'react';
import ApplicationForm from './ApplicationForm';

export default function JobsCart({ job }) {
  return (
    <div className="job-card" data-job-id={job.id}>
      <div className="job-header">
        <h3>{job.title}</h3>
        <span className={`status-badge ${job.isActive ? 'active' : 'inactive'}`}>
          {job.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="job-details">
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Type:</strong> {job.type}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Applications:</strong> <span className="count">{job.applications.length}</span></p>
      </div>
      <div className="job-actions">
        {job.isActive && (
          <>
            <button className="btn btn-primary show-application-form">Apply Now</button>
            <ApplicationForm jobId={job.id} />
          </>
        )}
        <button className="btn btn-secondary toggle-status" data-job-id={job.id}>
          {job.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}
