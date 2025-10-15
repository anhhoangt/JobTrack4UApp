/**
 * =====================================================
 * RESUME ROUTES
 * =====================================================
 *
 * API routes for resume upload, deletion, and retrieval
 * Protected routes - require authentication
 */

import express from 'express';
const router = express.Router();

import { uploadResume, deleteResume, getResumeInfo } from '../controllers/resumeController.js';
import { upload } from '../config/cloudinaryConfig.js';

/**
 * RESUME ROUTES
 *
 * GET    /api/v1/resume        - Get current user's resume info
 * POST   /api/v1/resume/upload - Upload a new resume file
 * DELETE /api/v1/resume        - Delete current resume
 */

// Get resume info
router.route('/').get(getResumeInfo).delete(deleteResume);

// Upload resume (uses multer middleware for file handling)
router.route('/upload').post((req, res, next) => {
    // console.log('=== RESUME UPLOAD STARTED ===');
    // console.log('User:', req.user);
    // console.log('Request headers:', req.headers);

    upload.single('resume')(req, res, (err) => {
        if (err) {
            console.error('=== MULTER ERROR ===');
            console.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
            console.error('Error type:', typeof err);
            console.error('Error:', err);

            // Check if it's a Multer error
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'File size too large. Maximum size is 5MB.' });
            }

            return res.status(400).json({ msg: err.message || err.toString() || 'File upload failed' });
        }

        // console.log('=== FILE PROCESSED ===');
        // console.log('File:', req.file);

        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        next();
    });
}, uploadResume);

export default router;
