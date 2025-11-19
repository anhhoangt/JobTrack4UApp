# 📦 AI Assistant Feature - Installation Guide

## Required Packages

Run these commands from your project root directory:

```bash
cd /Users/anhthehoang/Desktop/learning-code/jobtrack/JobTrack4UApp

# Install OpenAI for ChatGPT integration
npm install openai

# Install file parsing libraries
npm install pdf-parse mammoth

# Install web scraping libraries
npm install axios cheerio
```

## Package Explanations:

- **openai**: Official OpenAI SDK for ChatGPT integration
- **pdf-parse**: Extract text from PDF resume files
- **mammoth**: Extract text from DOCX/DOC resume files
- **axios**: HTTP client for fetching job descriptions from URLs
- **cheerio**: HTML parser for extracting job descriptions from web pages

## After Installation:

1. Add your OpenAI API key to `.env`:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

2. Restart your server:
   ```bash
   npm run server
   ```

## Features Now Available:

✅ Upload resume files (PDF, DOCX, DOC, TXT) - text is automatically extracted
✅ Paste job description URLs - content is automatically fetched and parsed
✅ Resume tailoring with ATS optimization
✅ Email response generation
✅ Interview preparation with Q&A
✅ Resume analysis and feedback
✅ Cover letter generation

All features are ready to use once packages are installed!
