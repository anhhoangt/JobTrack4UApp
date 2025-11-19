/**
 * =====================================================
 * AI CONTROLLER
 * =====================================================
 *
 * Handles all AI-powered features:
 * - Resume tailoring
 * - Email response generation
 * - Interview preparation
 * - Resume analysis
 * - Cover letter generation
 */

import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';
import aiService from '../services/aiService.js';

/**
 * TAILOR RESUME
 *
 * Generates ATS-optimized resume tailored to job description
 *
 * @route POST /api/v1/ai/tailor-resume
 * @access Private
 */
const tailorResume = async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
        throw new BadRequestError('Please provide both resume and job description');
    }

    try {
        const tailoredResume = await aiService.tailorResume(resumeText, jobDescription);

        res.status(StatusCodes.OK).json({
            msg: 'Resume tailored successfully',
            tailoredResume,
        });
    } catch (error) {
        console.error('AI Error:', error);
        throw new BadRequestError('Failed to generate tailored resume. Please check your OpenAI API key.');
    }
};

/**
 * GENERATE EMAIL RESPONSE
 *
 * Generates professional email response
 *
 * @route POST /api/v1/ai/email-response
 * @access Private
 */
const generateEmailResponse = async (req, res) => {
    const { emailContent, context } = req.body;

    if (!emailContent) {
        throw new BadRequestError('Please provide email content');
    }

    try {
        const emailResponse = await aiService.generateEmailResponse(emailContent, context);

        res.status(StatusCodes.OK).json({
            msg: 'Email response generated successfully',
            emailResponse,
        });
    } catch (error) {
        console.error('AI Error:', error);
        throw new BadRequestError('Failed to generate email response. Please check your OpenAI API key.');
    }
};

/**
 * GENERATE INTERVIEW PREP
 *
 * Generates interview questions and answers
 *
 * @route POST /api/v1/ai/interview-prep
 * @access Private
 */
const generateInterviewPrep = async (req, res) => {
    const { jobDescription, resumeText } = req.body;

    if (!jobDescription) {
        throw new BadRequestError('Please provide job description');
    }

    try {
        const interviewPrep = await aiService.generateInterviewPrep(jobDescription, resumeText);

        res.status(StatusCodes.OK).json({
            msg: 'Interview preparation generated successfully',
            interviewPrep,
        });
    } catch (error) {
        console.error('AI Error:', error);
        throw new BadRequestError('Failed to generate interview prep. Please check your OpenAI API key.');
    }
};

/**
 * ANALYZE RESUME
 *
 * Provides detailed resume feedback and suggestions
 *
 * @route POST /api/v1/ai/analyze-resume
 * @access Private
 */
const analyzeResume = async (req, res) => {
    const { resumeText } = req.body;

    if (!resumeText) {
        throw new BadRequestError('Please provide resume text');
    }

    try {
        const analysis = await aiService.analyzeResume(resumeText);

        res.status(StatusCodes.OK).json({
            msg: 'Resume analyzed successfully',
            analysis,
        });
    } catch (error) {
        console.error('AI Error:', error);
        throw new BadRequestError('Failed to analyze resume. Please check your OpenAI API key.');
    }
};

/**
 * GENERATE COVER LETTER
 *
 * Generates personalized cover letter
 *
 * @route POST /api/v1/ai/cover-letter
 * @access Private
 */
const generateCoverLetter = async (req, res) => {
    const { resumeText, jobDescription, companyName } = req.body;

    if (!resumeText || !jobDescription) {
        throw new BadRequestError('Please provide resume and job description');
    }

    try {
        const coverLetter = await aiService.generateCoverLetter(resumeText, jobDescription, companyName);

        res.status(StatusCodes.OK).json({
            msg: 'Cover letter generated successfully',
            coverLetter,
        });
    } catch (error) {
        console.error('AI Error:', error);
        throw new BadRequestError('Failed to generate cover letter. Please check your OpenAI API key.');
    }
};

export {
    tailorResume,
    generateEmailResponse,
    generateInterviewPrep,
    analyzeResume,
    generateCoverLetter,
};
