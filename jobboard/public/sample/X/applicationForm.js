import { updateStats } from './nav.js';

export function createApplicationForm(jobId) {
    return `
        <div class="application-form-container" style="display: none;">
            <form class="application-form" data-job-id="${jobId}">
                <div class="form-group">
                    <label for="name-${jobId}">Full Name</label>
                    <input type="text" id="name-${jobId}" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email-${jobId}">Email</label>
                    <input type="email" id="email-${jobId}" name="email" required>
                </div>
                <div class="form-group">
                    <label for="resume-${jobId}">Resume Link</label>
                    <input type="url" id="resume-${jobId}" name="resume" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Submit Application</button>
                    <button type="button" class="btn btn-secondary cancel-application">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

export function initializeApplicationFormEvents() {
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

            // Create new application with only required fields
            const newApplication = {
                name: formData.get('name'),
                email: formData.get('email'),
                resume: formData.get('resume')
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