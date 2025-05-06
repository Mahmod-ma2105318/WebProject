import { createApplicationForm } from './applicationForm.js';

export function createJobCard(job) {
    const applicationCount = job.applications ? job.applications.length : 0;

    return `
        <div class="job-card ${!job.isActive ? 'job-inactive' : ''}" data-job-id="${job.id}">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <div class="job-info">
                        <i class="fas fa-building"></i>
                        <span>${job.company}</span>
                    </div>
                    <div class="job-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location}</span>
                    </div>
                </div>
                <span class="status-badge ${!job.isActive ? 'status-inactive' : ''}">
                    ${job.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div class="job-info">
                <i class="fas fa-briefcase"></i>
                <span>${job.type}</span>
            </div>
            <div class="job-info">
                <i class="fas fa-money-bill-wave"></i>
                <span>${job.salary}</span>
            </div>
            <div class="job-actions">
                <div class="application-count">
                    <i class="fas fa-users"></i>
                    <span class="count">${applicationCount}</span>
                    <span>applications</span>
                </div>
                ${job.isActive ? `
                    <a href="apply.html?id=${job.id}" class="btn btn-primary">
                        Apply Now
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

export function initializeJobCardEvents() {
    // Show application form
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('show-application-form')) {
            const jobCard = e.target.closest('.job-card');
            const formContainer = jobCard.querySelector('.application-form-container');
            formContainer.style.display = 'block';
            e.target.style.display = 'none';
        }
    });

    // Hide application form
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('cancel-application')) {
            const jobCard = e.target.closest('.job-card');
            const formContainer = jobCard.querySelector('.application-form-container');
            const applyButton = jobCard.querySelector('.show-application-form');
            formContainer.style.display = 'none';
            applyButton.style.display = 'block';
        }
    });

    // Handle form submission
    document.addEventListener('submit', (e) => {
        if (e.target.classList.contains('application-form')) {
            e.preventDefault();
            const jobId = parseInt(e.target.dataset.jobId);
            const formData = new FormData(e.target);

            // Create new application
            const newApplication = {
                id: Date.now(),
                jobId: jobId,
                name: formData.get('name'),
                email: formData.get('email'),
                resume: formData.get('resume'),
                date: new Date().toISOString()
            };

            // Get current applications from localStorage
            const applications = JSON.parse(localStorage.getItem('applications')) || [];
            applications.push(newApplication);
            localStorage.setItem('applications', JSON.stringify(applications));

            // Update application count
            const jobCard = e.target.closest('.job-card');
            const countElement = jobCard.querySelector('.count');
            const currentCount = parseInt(countElement.textContent);
            countElement.textContent = currentCount + 1;

            // Update header stats
            const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
            const activeJobs = jobs.filter(job => job.isActive).length;
            const totalApplications = applications.length;
            updateStats(activeJobs, totalApplications);

            // Reset and hide form
            e.target.reset();
            const formContainer = jobCard.querySelector('.application-form-container');
            const applyButton = jobCard.querySelector('.show-application-form');
            formContainer.style.display = 'none';
            applyButton.style.display = 'block';

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Application submitted successfully!';
            jobCard.insertBefore(successMessage, formContainer);
            setTimeout(() => successMessage.remove(), 3000);
        }
    });
} 