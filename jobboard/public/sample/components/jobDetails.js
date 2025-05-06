export function createJobDetails(job) {
    return `
        <div class="job-details">
            <h2>You are applying to: ${job.title}</h2>
        </div>
    `;
} 