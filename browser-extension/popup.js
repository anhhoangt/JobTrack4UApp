// API Configuration
const API_URL = 'http://localhost:4000/api/v1'; // Change this to your deployed URL

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadJobData();
    setupEventListeners();
});

// Check if user has saved auth token
async function checkAuth() {
    const result = await chrome.storage.local.get(['authToken']);

    if (result.authToken) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('job-section').style.display = 'block';
    } else {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('job-section').style.display = 'none';
    }
}

// Load job data from content script
async function loadJobData() {
    const result = await chrome.storage.local.get(['jobData', 'source']);

    if (result.jobData && result.jobData.company && result.jobData.position) {
        // Show success banner
        document.getElementById('job-detected').style.display = 'block';
        document.getElementById('no-job-detected').style.display = 'none';

        // Fill form with scraped data
        document.getElementById('company').value = result.jobData.company || '';
        document.getElementById('position').value = result.jobData.position || '';
        document.getElementById('location').value = result.jobData.jobLocation || '';
        document.getElementById('salary').value = result.jobData.salary || '';
        document.getElementById('jobUrl').value = result.jobData.jobUrl || window.location.href;
        document.getElementById('source').value = result.source || 'Unknown';

        // Set job type if detected
        if (result.jobData.jobType) {
            document.getElementById('jobType').value = result.jobData.jobType;
        }
    } else {
        // Show error banner
        document.getElementById('job-detected').style.display = 'none';
        document.getElementById('no-job-detected').style.display = 'block';

        // Get current URL anyway
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            document.getElementById('jobUrl').value = tabs[0].url;
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Save token button
    document.getElementById('save-token-btn').addEventListener('click', saveToken);

    // Save job form
    document.getElementById('job-form').addEventListener('submit', saveJob);

    // Logout/change token button
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// Save auth token
async function saveToken() {
    const token = document.getElementById('token-input').value.trim();

    if (!token) {
        showStatus('Please enter a valid token', 'error');
        return;
    }

    await chrome.storage.local.set({ authToken: token });
    showStatus('Token saved successfully!', 'success');

    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Save job to JobTrack4U
async function saveJob(e) {
    e.preventDefault();

    const result = await chrome.storage.local.get(['authToken']);

    if (!result.authToken) {
        showStatus('Please configure your auth token first', 'error');
        return;
    }

    // Get form data
    const jobData = {
        company: document.getElementById('company').value.trim(),
        position: document.getElementById('position').value.trim(),
        jobLocation: document.getElementById('location').value.trim(),
        jobType: document.getElementById('jobType').value,
        salary: document.getElementById('salary').value.trim(),
        jobUrl: document.getElementById('jobUrl').value.trim(),
        source: document.getElementById('source').value.trim(),
        status: 'pending'
    };

    if (!jobData.company || !jobData.position) {
        showStatus('Company and Position are required', 'error');
        return;
    }

    // Show loading state
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = '💾 Saving...';

    try {
        const response = await fetch(`${API_URL}/jobs/quick-add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${result.authToken}`
            },
            body: JSON.stringify(jobData)
        });

        const data = await response.json();

        if (response.ok) {
            showStatus('✓ Job saved successfully!', 'success');

            // Clear storage
            await chrome.storage.local.remove(['jobData', 'source']);

            // Redirect to JobTrack4U after 1.5 seconds
            setTimeout(() => {
                chrome.tabs.create({ url: 'http://localhost:3000/all-jobs' });
                window.close();
            }, 1500);
        } else {
            showStatus(data.msg || 'Failed to save job', 'error');
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save to JobTrack4U';
        }
    } catch (error) {
        console.error('Error saving job:', error);
        showStatus('Network error. Make sure JobTrack4U backend is running.', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save to JobTrack4U';
    }
}

// Logout (clear token)
async function logout() {
    if (confirm('Are you sure you want to remove your auth token?')) {
        await chrome.storage.local.remove(['authToken']);
        window.location.reload();
    }
}

// Show status message
function showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';

    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 5000);
}
