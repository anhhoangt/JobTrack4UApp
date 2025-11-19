/**
 * =====================================================
 * AI SERVICE - OpenAI Integration
 * =====================================================
 *
 * Centralized service for all AI operations using OpenAI API
 * Includes resume tailoring, email responses, and interview prep
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Tailor resume to match job description (ATS-optimized)
 */
export const tailorResume = async (resumeText, jobDescription) => {
    const prompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.

I need you to tailor this resume to match the following job description while keeping it ATS-friendly.

ORIGINAL RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
1. Analyze the job description for key skills, requirements, and keywords
2. Modify the resume to highlight relevant experience and skills
3. Use keywords from the job description naturally throughout
4. Maintain ATS-friendly formatting (no tables, simple formatting)
5. Keep the same overall structure and length
6. Focus on quantifiable achievements that match the role
7. Ensure all claims are based on the original resume content
8. Add a tailored professional summary at the top

Return ONLY the tailored resume text in a clean, ATS-friendly format.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are an expert resume writer specializing in ATS optimization and job-specific resume tailoring.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 2000,
    });

    return response.choices[0].message.content;
};

/**
 * Generate professional email response
 */
export const generateEmailResponse = async (emailContent, context = '') => {
    const prompt = `You are a professional career advisor helping to write email responses.

ORIGINAL EMAIL:
${emailContent}

${context ? `ADDITIONAL CONTEXT:\n${context}` : ''}

INSTRUCTIONS:
1. Write a professional, courteous response
2. Address all points in the original email
3. Maintain appropriate tone (formal business communication)
4. Be concise but thorough
5. Include appropriate greeting and closing
6. Proofread for grammar and spelling

Generate a professional email response:`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are a professional career advisor helping to write professional email responses for job seekers.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 800,
    });

    return response.choices[0].message.content;
};

/**
 * Generate interview questions and answers based on job description
 */
export const generateInterviewPrep = async (jobDescription, resumeText = '') => {
    const prompt = `You are an interview coach helping prepare for a job interview.

JOB DESCRIPTION:
${jobDescription}

${resumeText ? `CANDIDATE'S RESUME:\n${resumeText}` : ''}

INSTRUCTIONS:
Generate comprehensive interview preparation including:

1. 10 most likely interview questions for this role
2. Strong, STAR-method based answers for each question
3. 5 questions the candidate should ask the interviewer
4. Key skills to emphasize during the interview
5. Potential red flags or challenges to address

Format the response as:
## Common Interview Questions & Answers
[Questions with detailed answers]

## Questions to Ask the Interviewer
[Thoughtful questions]

## Key Points to Emphasize
[Strategic talking points]

## Preparation Tips
[Specific advice for this role]`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are an expert interview coach with years of experience helping candidates prepare for technical and behavioral interviews.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 3000,
    });

    return response.choices[0].message.content;
};

/**
 * Analyze resume and provide improvement suggestions
 */
export const analyzeResume = async (resumeText) => {
    const prompt = `Analyze this resume and provide detailed feedback:

RESUME:
${resumeText}

Provide analysis covering:
1. Overall strength (score out of 10)
2. ATS compatibility issues
3. Formatting recommendations
4. Content improvement suggestions
5. Missing key elements
6. Power words to add
7. Things to remove or de-emphasize

Be specific and actionable.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are a professional resume reviewer and career coach.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 1500,
    });

    return response.choices[0].message.content;
};

/**
 * Generate cover letter based on resume and job description
 */
export const generateCoverLetter = async (resumeText, jobDescription, companyName = '') => {
    const prompt = `Generate a compelling cover letter for this job application.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

${companyName ? `COMPANY NAME: ${companyName}` : ''}

INSTRUCTIONS:
1. Create a professional, engaging cover letter
2. Highlight relevant experience from the resume
3. Show enthusiasm for the role and company
4. Address how the candidate meets key requirements
5. Keep it to 3-4 paragraphs
6. Use confident, active language
7. Include proper formatting with greeting and closing

Generate the cover letter:`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You are an expert at writing compelling, personalized cover letters that get interviews.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.8,
        max_tokens: 1200,
    });

    return response.choices[0].message.content;
};

export default {
    tailorResume,
    generateEmailResponse,
    generateInterviewPrep,
    analyzeResume,
    generateCoverLetter,
};
