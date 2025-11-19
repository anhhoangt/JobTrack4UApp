// Background service worker for JobTrack4U extension
// Handles background tasks and message passing

console.log('JobTrack4U Extension - Background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('JobTrack4U Extension installed successfully!');
        // Open welcome page or setup page
        chrome.tabs.create({
            url: 'http://localhost:3000/register'
        });
    } else if (details.reason === 'update') {
        console.log('JobTrack4U Extension updated to version', chrome.runtime.getManifest().version);
    }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);

    if (request.action === 'jobDataScraped') {
        console.log('Job data scraped from:', request.source);
        // Store the data for popup to access
        chrome.storage.local.set({
            jobData: request.data,
            source: request.source
        });
    }

    sendResponse({ success: true });
    return true;
});
