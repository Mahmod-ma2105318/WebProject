import { createApplicationForm } from './applicationForm.js';

export function createJobCard(job, applications = []) {
    const applicationCount = applications.filter(app => app.jobId === job.id).length;

    return `
        <div class="job-card" data-job-id="${job.id}">
            <div class="job-header">
                <h3>${job.title}</h3>
                <span class="status-badge ${job.isActive ? 'active' : 'inactive'}">
                    ${job.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div class="job-details">
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Type:</strong> ${job.type}</p>
                <p><strong>Salary:</strong> ${job.salary}</p>
                <p><strong>Applications:</strong> <span class="count">${applicationCount}</span></p>
            </div>
            <div class="job-actions">
                ${job.isActive ? `
                    <button class="btn btn-primary show-application-form">Apply Now</button>
                    ${createApplicationForm(job.id)}
                ` : ''}
                <button class="btn btn-secondary toggle-status" data-job-id="${job.id}">
                    ${job.isActive ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    `;
} 