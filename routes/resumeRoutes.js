/**
 * =====================================================
 * RESUME ROUTES (Multiple Resumes Support)
 * =====================================================
 *
 * API routes for multiple resume upload, deletion, retrieval, and management
 * Protected routes - require authentication
 */

import express from 'express';
const router = express.Router();

import {
    uploadResume,
    getAllResumes,
    deleteResume,
    setDefaultResume,
    updateResumeMetadata,
} from '../controllers/resumeController.js';
import { upload } from '../config/cloudinaryConfig.js';

/**
 * RESUME ROUTES
 *
 * GET    /api/v1/resume                        - Get all user's resumes
 * POST   /api/v1/resume/upload                 - Upload a new resume file
 * DELETE /api/v1/resume/:resumeId              - Delete specific resume
 * PATCH  /api/v1/resume/:resumeId              - Update resume metadata (category, filename)
 * PATCH  /api/v1/resume/:resumeId/default      - Set resume as default
 */

// Get all resumes
router.route('/').get(getAllResumes);

// Upload resume (uses multer middleware for file handling)
router.route('/upload').post((req, res, next) => {
    upload.single('resume')(req, res, (err) => {
        if (err) {
            console.error('=== MULTER ERROR ===');
            console.error('Error:', err);

            // Check if it's a Multer error
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'File size too large. Maximum size is 5MB.' });
            }

            return res.status(400).json({ msg: err.message || err.toString() || 'File upload failed' });
        }

        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        next();
    });
}, uploadResume);

// Delete specific resume, update metadata, and set default
router.route('/:resumeId')
    .delete(deleteResume)
    .patch(updateResumeMetadata);

// Set default resume
router.route('/:resumeId/default').patch(setDefaultResume);

export default router;
