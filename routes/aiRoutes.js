/**
 * =====================================================
 * AI ROUTES
 * =====================================================
 *
 * API routes for AI-powered features
 * Protected routes - require authentication
 */

import express from 'express';
const router = express.Router();

import {
    tailorResume,
    generateEmailResponse,
    generateInterviewPrep,
    analyzeResume,
    generateCoverLetter,
    parseResumeFile,
    fetchJobDescription,
} from '../controllers/aiController.js';

import { upload } from '../config/cloudinaryConfig.js';
import checkAILimit from '../middleware/checkAILimit.js';

/**
 * AI ROUTES
 *
 * POST   /api/v1/ai/tailor-resume      - Tailor resume to job description (RATE LIMITED)
 * POST   /api/v1/ai/email-response     - Generate email response (RATE LIMITED)
 * POST   /api/v1/ai/interview-prep     - Generate interview Q&A (RATE LIMITED)
 * POST   /api/v1/ai/analyze-resume     - Analyze resume and provide feedback (RATE LIMITED)
 * POST   /api/v1/ai/cover-letter       - Generate cover letter (RATE LIMITED)
 * POST   /api/v1/ai/parse-resume       - Parse resume file (PDF/DOCX/TXT) (NO LIMIT)
 * POST   /api/v1/ai/fetch-job-description - Fetch job description from URL (NO LIMIT)
 *
 * RATE LIMITING:
 * - Normal users: 2 requests per day
 * - Admin users: Unlimited requests
 */

// AI-powered routes with rate limiting
router.route('/tailor-resume').post(checkAILimit, tailorResume);
router.route('/email-response').post(checkAILimit, generateEmailResponse);
router.route('/interview-prep').post(checkAILimit, generateInterviewPrep);
router.route('/analyze-resume').post(checkAILimit, analyzeResume);
router.route('/cover-letter').post(checkAILimit, generateCoverLetter);

// Utility routes without rate limiting (don't consume OpenAI tokens significantly)
// File upload route for resume parsing
router.route('/parse-resume').post(upload.single('resume'), parseResumeFile);

// URL fetching route
router.route('/fetch-job-description').post(fetchJobDescription);

export default router;
