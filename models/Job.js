import mongoose from 'mongoose'

/**
 * Job Schema Definition
 *
 * This schema represents a job application in the system. It contains comprehensive
 * information about job opportunities that users are applying to, including basic
 * job details, application tracking, salary information, categorization, and user notes.
 *
 * The schema has evolved through multiple phases:
 * - Phase 1: Basic job information (company, position, status, location)
 * - Phase 2: Enhanced fields (salary, dates, URLs, application method)
 * - Phase 3: Categorization and tagging system for better organization
 */
const JobSchema = new mongoose.Schema(
  {
    // ======== BASIC JOB INFORMATION ========

    /**
     * Company name where the job is located
     * Required field with maximum 50 characters
     */
    company: {
      type: String,
      required: [true, 'Please provide company'],
      maxlength: 50,
    },

    /**
     * Job position/title being applied for
     * Required field with maximum 100 characters
     */
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },

    /**
     * Current status of the job application
     * Tracks the progress through the application process
     */
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },

    /**
     * Type of employment being offered
     * Helps categorize jobs by work arrangement
     */
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },

    /**
     * Physical or remote location of the job
     * Required field that defaults to user's location
     */
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },

    // ======== ENHANCED FIELDS (Phase 1) ========

    /**
     * Date when the application was submitted
     * Automatically set to current date when job is created
     */
    applicationDate: {
      type: Date,
      default: Date.now,
    },

    /**
     * Deadline for submitting the application
     * Optional field to track time-sensitive applications
     */
    applicationDeadline: {
      type: Date,
    },

    /**
     * Salary information object containing range and currency
     * Helps users track compensation expectations
     */
    salary: {
      // Minimum salary offered
      min: {
        type: Number,
        min: 0,
      },
      // Maximum salary offered
      max: {
        type: Number,
        min: 0,
      },
      // Currency code for salary values
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        default: 'USD',
      },
    },

    /**
     * Detailed description of the job role and responsibilities
     * Allows users to store important job details for reference
     */
    jobDescription: {
      type: String,
      maxlength: 1000,
    },

    /**
     * URL of the company's official website
     * Useful for research and follow-up activities
     */
    companyWebsite: {
      type: String,
      maxlength: 200,
    },

    /**
     * Direct URL to the job posting
     * Allows quick access to the original job listing
     */
    jobPostingUrl: {
      type: String,
      maxlength: 500,
    },

    /**
     * Method used to apply for the job
     * Helps track different application channels
     */
    applicationMethod: {
      type: String,
      enum: ['email', 'website', 'linkedin', 'recruiter', 'other'],
      default: 'website',
    },

    /**
     * Personal notes about the job or application process
     * Free-form text for storing additional information
     */
    notes: {
      type: String,
      maxlength: 500,
    },

    // ======== CATEGORIZATION & TAGS (Phase 2) ========

    /**
     * Job category/industry classification
     * Helps organize jobs by field or department
     */
    category: {
      type: String,
      enum: [
        'software-engineering',
        'data-science',
        'product-management',
        'design',
        'marketing',
        'sales',
        'operations',
        'finance',
        'hr',
        'consulting',
        'other'
      ],
      default: 'other',
    },

    /**
     * Array of custom tags for flexible categorization
     * Allows users to create their own classification system
     * Each tag is trimmed and limited to 30 characters
     */
    tags: [{
      type: String,
      maxlength: 30,
      trim: true,
    }],

    /**
     * Priority level for this job application
     * Helps users focus on most important opportunities
     */
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    // ======== USER ASSOCIATION ========

    /**
     * Reference to the user who created this job entry
     * Ensures data isolation between different users
     */
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
  }
)

// Export the Job model for use in controllers and routes
export default mongoose.model('Job', JobSchema)
