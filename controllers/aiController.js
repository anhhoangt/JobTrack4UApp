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
import { extractTextFromFile } from '../utils/fileParser.js';
import { fetchJobDescriptionFromURL } from '../utils/jobDescriptionScraper.js';
import fs from 'fs';

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
            aiRemainingRequests: req.aiRemainingRequests,
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
            aiRemainingRequests: req.aiRemainingRequests,
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
            aiRemainingRequests: req.aiRemainingRequests,
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
            aiRemainingRequests: req.aiRemainingRequests,
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
            aiRemainingRequests: req.aiRemainingRequests,
        });
    } catch (error) {
        console.error('AI Error:', error);
        throw new BadRequestError('Failed to generate cover letter. Please check your OpenAI API key.');
    }
};

/**
 * PARSE RESUME FILE
 *
 * Extracts text from uploaded resume file (PDF, DOCX, TXT)
 *
 * @route POST /api/v1/ai/parse-resume
 * @access Private
 */
const parseResumeFile = async (req, res) => {
    try {
        if (!req.file) {
            throw new BadRequestError('Please upload a file');
        }

        const resumeText = await extractTextFromFile(req.file);

        // Clean up the uploaded file ONLY if it's a local file (not Cloudinary URL)
        if (req.file.path && !req.file.path.startsWith('http')) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.log('Could not delete local file:', unlinkError.message);
            }
        }

        res.status(StatusCodes.OK).json({
            msg: 'Resume parsed successfully',
            resumeText,
        });
    } catch (error) {
        // Clean up file if it exists and is local
        if (req.file && req.file.path && !req.file.path.startsWith('http')) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.log('Could not delete local file:', unlinkError.message);
            }
        }
        console.error('Parse Error:', error);
        throw new BadRequestError(error.message || 'Failed to parse resume file');
    }
};

/**
 * FETCH JOB DESCRIPTION FROM URL
 *
 * Fetches and extracts job description from URL
 *
 * @route POST /api/v1/ai/fetch-job-description
 * @access Private
 */
const fetchJobDescription = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        throw new BadRequestError('Please provide a URL');
    }

    try {
        const jobDescription = await fetchJobDescriptionFromURL(url);

        res.status(StatusCodes.OK).json({
            msg: 'Job description fetched successfully',
            jobDescription,
        });
    } catch (error) {
        console.error('Fetch Error:', error);
        throw new BadRequestError(error.message || 'Failed to fetch job description from URL');
    }
};

export {
    tailorResume,
    generateEmailResponse,
    generateInterviewPrep,
    analyzeResume,
    generateCoverLetter,
    parseResumeFile,
    fetchJobDescription,
};
