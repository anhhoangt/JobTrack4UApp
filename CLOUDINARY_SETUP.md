# Cloudinary Resume Upload Setup Guide

## Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. Complete registration
4. You'll get a free account with generous limits:
   - 25 GB storage
   - 25 GB bandwidth per month
   - Perfect for job application tracking!

## Step 2: Get Your Credentials

1. Log in to Cloudinary Dashboard
2. Go to Dashboard Home
3. You'll see your credentials:
   - **Cloud Name**: (e.g., "dxyz123abc")
   - **API Key**: (e.g., "123456789012345")
   - **API Secret**: (e.g., "aBcDeFgHiJkLmNoPqRsTuVwXyZ")

## Step 3: Update .env File

Replace the placeholder values in `/Users/anhthehoang/Desktop/learning-code/jobtrack/JobTrack4UApp/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

## Step 4: What I've Already Set Up (Backend)

✅ Installed required packages:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload handling
- `multer-storage-cloudinary` - Cloudinary storage for multer

✅ Created configuration file: `/config/cloudinaryConfig.js`
- Configured Cloudinary connection
- Set up file upload middleware
- Added file validation (PDF, DOC, DOCX only)
- Limited file size to 5MB

✅ Updated User model: `/models/User.js`
- Added resume fields:
  - `resumeUrl` - Cloudinary URL to access resume
  - `resumePublicId` - Cloudinary file ID for deletion
  - `resumeFileName` - Original filename
  - `resumeUploadDate` - When it was uploaded

✅ Created resume controller: `/controllers/resumeController.js`
- `uploadResume()` - Upload new resume (replaces old one automatically)
- `deleteResume()` - Delete current resume
- `getResumeInfo()` - Get resume information

✅ Created resume routes: `/routes/resumeRoutes.js`
- `POST /api/v1/resume/upload` - Upload resume
- `GET /api/v1/resume` - Get resume info
- `DELETE /api/v1/resume` - Delete resume

✅ Updated server: `/server.js`
- Registered resume routes
- Protected with authentication middleware

## Step 5: Next Steps (Frontend - Coming Next)

I'll now update the Profile page to include:
- File upload button
- Current resume display with download/preview
- Delete resume button
- Upload progress indicator
- File validation on frontend

## How It Works

1. **Upload Flow:**
   - User selects PDF/DOC/DOCX file
   - Frontend sends file to `/api/v1/resume/upload`
   - Multer processes the file
   - Cloudinary stores it securely
   - User model updated with file info
   - Old resume automatically deleted if exists

2. **Security:**
   - Only authenticated users can upload
   - File type validation (PDF, DOC, DOCX only)
   - File size limit (5MB max)
   - Each user can only access their own resume

3. **Storage:**
   - Files stored in Cloudinary folder: `jobtrack-resumes`
   - Unique filename: `{userId}-{timestamp}-{originalName}`
   - Automatic CDN delivery for fast access
   - Old resumes automatically replaced

## Testing After Setup

Once you add your Cloudinary credentials to `.env`, you can test:

1. Restart your server: `npm start`
2. The frontend will be updated next to handle uploads
3. Upload a resume in the Profile page
4. Download/preview it
5. Delete and re-upload

## Cloudinary Dashboard Features

In your Cloudinary dashboard, you can:
- View all uploaded resumes
- See storage usage
- Download files manually
- Delete files if needed
- Monitor bandwidth usage
