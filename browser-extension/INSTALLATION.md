# 🚀 JobTrack4U Browser Extension - Quick Installation Guide

## Step 1: Create Extension Icons (Placeholder)

Since the extension requires icons, you need to create 3 simple placeholder images:

### Option A: Use online icon generator
1. Go to https://favicon.io/favicon-generator/
2. Create a simple icon with text "J4U" or a briefcase emoji 📋
3. Download and create these sizes:
   - 16x16 pixels → save as `icon16.png`
   - 48x48 pixels → save as `icon48.png`
   - 128x128 pixels → save as `icon128.png`
4. Place all three in `/browser-extension/icons/` folder

### Option B: Quick placeholder (if you want to test immediately)
Create a folder `/browser-extension/icons/` and just create any 3 PNG files with those names (they can be duplicates for testing).

## Step 2: Install Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Navigate to and select the `/browser-extension/` folder
6. ✅ Extension loaded! You should see "JobTrack4U - Job Scraper" in your extensions

## Step 3: Configure Your Auth Token

1. Login to JobTrack4U at http://localhost:3000
2. Press `F12` to open DevTools
3. Go to **Application** tab → **Local Storage** → select http://localhost:3000
4. Find the `token` key and **copy its value**
5. Click the JobTrack4U extension icon in Chrome toolbar
6. Paste your token and click "Save Token"

## Step 4: Test the Extension!

### Test on LinkedIn:
1. Go to https://www.linkedin.com/jobs/
2. Click on any job listing
3. Wait 2-3 seconds for the page to fully load
4. Click the JobTrack4U extension icon
5. You should see the job details auto-filled!
6. Click "Save to JobTrack4U"
7. Check your JobTrack4U dashboard - the job should appear!

### Test on Indeed:
1. Go to https://www.indeed.com
2. Search for any job and click on a listing
3. Click the extension icon
4. Job details should be auto-filled
5. Save to JobTrack4U!

### Test on Glassdoor:
1. Go to https://www.glassdoor.com/Job/
2. Click on any job listing
3. Click the extension icon
4. Save to JobTrack4U!

## 🎉 You're Done!

The extension is now working and will:
- ✅ Automatically extract job details from LinkedIn, Indeed, and Glassdoor
- ✅ Save jobs directly to your JobTrack4U dashboard with one click
- ✅ Eliminate manual copy-paste data entry
- ✅ Track which job board each job came from

## 🔧 Troubleshooting

**Extension not loading?**
- Make sure you have the icons folder created (even with placeholder images)
- Check chrome://extensions/ for error messages
- Try reloading the extension

**Job details not detected?**
- Make sure you're on a job listing page (not search results)
- Wait 2-3 seconds after page loads
- Check browser console (F12) for scraper messages
- Job board layouts change - some selectors may need updating

**Can't save to JobTrack4U?**
- Verify your backend is running on port 4000
- Check that your auth token is correctly saved
- Open browser console to see any API errors

## 📝 Notes

- The extension currently supports LinkedIn, Indeed, and Glassdoor
- Job board websites frequently update their HTML structure, so scrapers may occasionally need updates
- Your auth token is stored locally in your browser only
- The extension works completely offline for scraping - it only contacts your server when saving

---

**Happy job hunting! 🎯**
