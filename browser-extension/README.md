# JobTrack4U Browser Extension

Automatically save job listings from LinkedIn, Indeed, Glassdoor, and more to your JobTrack4U dashboard with one click!

## 🎯 Features

- **One-Click Job Saving**: Extract job details automatically from job boards
- **Smart Field Detection**: Automatically detects company, position, location, salary, etc.
- **Multi-Platform Support**: Works on LinkedIn, Indeed, Glassdoor, and more
- **Direct Integration**: Saves directly to your JobTrack4U account
- **No Copy-Paste**: Eliminates manual data entry

## 📦 Installation

### Chrome/Edge Installation

1. Download or clone this extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `browser-extension` folder
6. The extension icon will appear in your toolbar!

### Firefox Installation

1. Open Firefox and go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Navigate to the `browser-extension` folder and select `manifest.json`

## 🔧 Setup

1. **Install the extension** using instructions above
2. **Login to JobTrack4U** at http://localhost:3000 (or your deployed URL)
3. **Click the extension icon** and enter your authentication token
4. **Browse job boards** and click the extension when viewing a job!

### Getting Your Auth Token

1. Log into JobTrack4U
2. Open browser DevTools (F12)
3. Go to Application > Local Storage
4. Find your `token` value
5. Copy and paste it into the extension settings

## 🚀 Usage

1. Navigate to a job listing on:
   - LinkedIn Jobs
   - Indeed
   - Glassdoor
   - (More platforms coming soon!)

2. Click the JobTrack4U extension icon

3. Review the auto-filled job details

4. Click "Save to JobTrack4U"

5. Done! Check your JobTrack4U dashboard

## 🛠️ Supported Job Boards

- ✅ **LinkedIn** - Full support for job listings
- ✅ **Indeed** - Full support for job listings
- ✅ **Glassdoor** - Full support for job listings
- 🚧 **Monster** - Coming soon
- 🚧 **ZipRecruiter** - Coming soon

## 📝 Development

### File Structure

```
browser-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── background.js         # Background service worker
├── styles.css            # Popup styles
├── scrapers/
│   ├── linkedin.js       # LinkedIn scraper
│   ├── indeed.js         # Indeed scraper
│   └── glassdoor.js      # Glassdoor scraper
└── icons/               # Extension icons (16x16, 48x48, 128x128)
```

### Adding a New Job Board

1. Create a new scraper file in `scrapers/your-board.js`
2. Add content script match pattern in `manifest.json`
3. Implement the scraper following the template below:

```javascript
(function() {
    // Extract job details specific to this job board
    const jobData = {
        company: document.querySelector('.company-name')?.textContent?.trim(),
        position: document.querySelector('.job-title')?.textContent?.trim(),
        jobLocation: document.querySelector('.location')?.textContent?.trim(),
        // ... more fields
    };

    // Store data for popup to access
    chrome.storage.local.set({ jobData, source: 'YourBoard' });
})();
```

## 🔒 Privacy & Security

- **No Data Collection**: We don't collect or store any of your browsing data
- **Local Storage Only**: Auth token stored locally in your browser
- **Secure Communication**: All API calls use HTTPS
- **Open Source**: Review the code yourself!

## ⚙️ API Endpoint

The extension sends job data to:
```
POST /api/v1/jobs/quick-add
Headers: Authorization: Bearer YOUR_TOKEN
Body: { company, position, jobLocation, jobType, jobUrl, description, salary, source }
```

## 🐛 Troubleshooting

**Extension not detecting job details?**
- Make sure you're on a supported job board
- Refresh the page and try again
- Check browser console for errors

**Can't save jobs?**
- Verify your auth token is correct
- Make sure JobTrack4U backend is running
- Check network tab in DevTools for API errors

**Extension icon not showing?**
- Reload the extension in chrome://extensions
- Make sure it's enabled
- Try restarting your browser

## 📧 Support

Having issues? Create an issue in the GitHub repository or contact support.

## 📄 License

MIT License - Feel free to modify and use!

---

Made with ❤️ for job seekers everywhere
