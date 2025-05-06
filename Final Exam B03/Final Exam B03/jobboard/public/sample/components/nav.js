export function createNav() {
    return `
        <div class="banner">
            <div class="container">
                <div class="banner-content">
                    <div class="logo">
                        <i class="fas fa-briefcase"></i>
                        <span>JobBoard</span>
                    </div>
                    <div class="banner-stats">
                        <div class="stat-item">
                            <i class="fas fa-building"></i>
                            <span id="totalJobs">0</span>
                            <span class="stat-label">Active Jobs</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-file-alt"></i>
                            <span id="totalApplications">0</span>
                            <span class="stat-label">Applications</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function updateStats(activeJobs, totalApplications) {
    document.getElementById('totalJobs').textContent = activeJobs;
    document.getElementById('totalApplications').textContent = totalApplications;
} 