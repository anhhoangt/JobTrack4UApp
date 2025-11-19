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
} from '../controllers/aiController.js';

/**
 * AI ROUTES
 *
 * POST   /api/v1/ai/tailor-resume      - Tailor resume to job description
 * POST   /api/v1/ai/email-response     - Generate email response
 * POST   /api/v1/ai/interview-prep     - Generate interview Q&A
 * POST   /api/v1/ai/analyze-resume     - Analyze resume and provide feedback
 * POST   /api/v1/ai/cover-letter       - Generate cover letter
 */

router.route('/tailor-resume').post(tailorResume);
router.route('/email-response').post(generateEmailResponse);
router.route('/interview-prep').post(generateInterviewPrep);
router.route('/analyze-resume').post(analyzeResume);
router.route('/cover-letter').post(generateCoverLetter);

export default router;
