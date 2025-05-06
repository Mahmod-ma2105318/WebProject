import { createNav, updateStats } from './components/nav.js';
import { createJobCard } from './components/jobCard.js';
import { createApplicationForm, initializeApplicationFormEvents } from './components/applicationForm.js';

// Job data
const jobs = [
    {
        id: 1,
        title: "Senior Software Engineer",
        company: "TechCorp",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$120,000 - $150,000",
        description: "We are looking for a Senior Software Engineer to join our team...",
        isActive: true
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "WebSolutions",
        location: "Remote",
        type: "Full-time",
        salary: "$90,000 - $110,000",
        description: "Join our team as a Frontend Developer...",
        isActive: true
    },
    {
        id: 3,
        title: "Backend Developer",
        company: "DataSystems",
        location: "New York, NY",
        type: "Full-time",
        salary: "$100,000 - $130,000",
        description: "Looking for an experienced Backend Developer...",
        isActive: false
    },
    {
        id: 4,
        title: "DevOps Engineer",
        company: "CloudTech",
        location: "Seattle, WA",
        type: "Full-time",
        salary: "$110,000 - $140,000",
        description: "Seeking a DevOps Engineer to manage our infrastructure...",
        isActive: true
    },
    {
        id: 5,
        title: "UI/UX Designer",
        company: "DesignHub",
        location: "Los Angeles, CA",
        type: "Full-time",
        salary: "$85,000 - $105,000",
        description: "Join our creative team as a UI/UX Designer...",
        isActive: false
    },
    {
        id: 6,
        title: "Mobile Developer",
        company: "AppWorks",
        location: "Boston, MA",
        type: "Full-time",
        salary: "$95,000 - $120,000",
        description: "Looking for a Mobile Developer with React Native experience...",
        isActive: true
    }
];

// Function to update stats across all pages
function updatePageStats() {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const activeJobs = jobs.filter(job => job.isActive).length;
    const totalApplications = applications.length;
    updateStats(activeJobs, totalApplications);
}

// Initialize the page
function initializePage() {
    const isApplyPage = window.location.pathname.includes('apply.html');

    // Initialize localStorage with jobs if not already present
    if (!localStorage.getItem('jobs')) {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }

    // Initialize applications if not already present
    if (!localStorage.getItem('applications')) {
        const initialApplications = [
            { id: 1, jobId: 1, name: "John Smith", email: "john@email.com", resume: "resume1.pdf", date: "2024-03-15" },
            { id: 2, jobId: 1, name: "Sarah Johnson", email: "sarah@email.com", resume: "resume2.pdf", date: "2024-03-16" },
            { id: 3, jobId: 1, name: "Mike Brown", email: "mike@email.com", resume: "resume3.pdf", date: "2024-03-17" },
            { id: 4, jobId: 2, name: "Emily Davis", email: "emily@email.com", resume: "resume4.pdf", date: "2024-03-15" },
            { id: 5, jobId: 2, name: "David Wilson", email: "david@email.com", resume: "resume5.pdf", date: "2024-03-16" },
            { id: 6, jobId: 4, name: "Lisa Anderson", email: "lisa@email.com", resume: "resume6.pdf", date: "2024-03-15" },
            { id: 7, jobId: 4, name: "Tom Harris", email: "tom@email.com", resume: "resume7.pdf", date: "2024-03-16" },
            { id: 8, jobId: 4, name: "Rachel Green", email: "rachel@email.com", resume: "resume8.pdf", date: "2024-03-17" },
            { id: 9, jobId: 6, name: "James Wilson", email: "james@email.com", resume: "resume9.pdf", date: "2024-03-15" },
            { id: 10, jobId: 6, name: "Emma Thompson", email: "emma@email.com", resume: "resume10.pdf", date: "2024-03-16" }
        ];
        localStorage.setItem('applications', JSON.stringify(initialApplications));
    }

    // Add navigation to the page
    document.body.insertAdjacentHTML('afterbegin', createNav());

    if (isApplyPage) {
        initializeApplyPage();
    } else {
        initializeMainPage();
    }
}

// Initialize main page
function initializeMainPage() {
    // Get data from localStorage
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const applications = JSON.parse(localStorage.getItem('applications')) || [];

    // Update stats
    const activeJobs = jobs.filter(job => job.isActive).length;
    const totalApplications = applications.length;
    updateStats(activeJobs, totalApplications);

    // Render job cards
    const jobsContainer = document.querySelector('.jobs-grid');
    jobsContainer.innerHTML = ''; // Clear existing content

    jobs.forEach(job => {
        // Get applications for this specific job
        const jobApplications = applications.filter(app => app.jobId === job.id);
        // Create job card with the filtered applications
        const jobWithApplications = {
            ...job,
            applications: jobApplications
        };
        jobsContainer.insertAdjacentHTML('beforeend', createJobCard(jobWithApplications));
    });

    // Add event listener for active toggle
    const activeToggle = document.getElementById('showActiveOnly');
    if (activeToggle) {
        activeToggle.addEventListener('change', () => {
            const filteredJobs = activeToggle.checked
                ? jobs.filter(job => job.isActive)
                : jobs;

            jobsContainer.innerHTML = ''; // Clear existing content
            filteredJobs.forEach(job => {
                // Get applications for this specific job
                const jobApplications = applications.filter(app => app.jobId === job.id);
                // Create job card with the filtered applications
                const jobWithApplications = {
                    ...job,
                    applications: jobApplications
                };
                jobsContainer.insertAdjacentHTML('beforeend', createJobCard(jobWithApplications));
            });
        });
    }
}

// Initialize apply page
function initializeApplyPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('id'));
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const job = jobs.find(j => j.id === jobId);

    if (!job) {
        window.location.href = 'index.html';
        return;
    }

    // Create and append job details
    document.getElementById('jobDetails').insertAdjacentHTML('beforeend', `
        <div class="job-details">
            <h2>You are applying to: ${job.title}</h2>
            <div class="job-meta">
                <div class="job-info">
                    <i class="fas fa-building"></i>
                    <span>${job.company}</span>
                </div>
                <div class="job-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="job-info">
                    <i class="fas fa-briefcase"></i>
                    <span>${job.type}</span>
                </div>
                <div class="job-info">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>${job.salary}</span>
                </div>
            </div>
        </div>
    `);

    // Create and append application form
    document.getElementById('applicationForm').insertAdjacentHTML('beforeend', createApplicationForm(job));

    // Initialize application form events
    initializeApplicationFormEvents();
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 