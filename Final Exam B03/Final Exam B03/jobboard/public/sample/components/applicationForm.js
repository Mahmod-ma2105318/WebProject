import { updateStats } from './nav.js';

export function createApplicationForm(job) {
    return `
        <div class="application-form-container">
            <div class="form-actions">
                <button onclick="window.location.href='index.html'" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i> Back to Jobs
                </button>
            </div>
            <form class="application-form" data-job-id="${job.id}">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="resume">Resume Link</label>
                    <input type="url" id="resume" name="resume" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit Application</button>
            </form>
        </div>
    `;
}

export function initializeApplicationFormEvents() {
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

            // Update header stats
            const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
            const activeJobs = jobs.filter(job => job.isActive).length;
            const totalApplications = applications.length;
            updateStats(activeJobs, totalApplications);

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Application submitted successfully!';
            document.querySelector('.application-form-container').prepend(successMessage);

            // Wait a moment to show the success message before redirecting
            setTimeout(() => {
                window.location.replace('index.html');
            }, 1500);
        }
    });
} 