import mongoose from 'mongoose';

/**
 * =====================================================
 * TEMPLATE SCHEMA
 * =====================================================
 *
 * This schema represents email and cover letter templates
 * that users can create, customize, and reuse for job applications.
 *
 * Features:
 * - Multiple template types (cover letter, email, follow-up, etc.)
 * - Variable substitution support ({{companyName}}, {{position}}, etc.)
 * - Subject line for email templates
 * - Rich content storage
 */

const TemplateSchema = new mongoose.Schema(
    {
        /**
         * Template name/title
         * User-friendly name to identify the template
         */
        name: {
            type: String,
            required: [true, 'Please provide a template name'],
            maxlength: 100,
            trim: true,
        },

        /**
         * Template type/category
         * Determines the purpose and context of the template
         */
        type: {
            type: String,
            enum: [
                'cover-letter',      // Cover letter for job applications
                'email',            // General email template
                'follow-up',        // Follow-up email after application
                'thank-you',        // Thank you email after interview
                'networking',       // Networking/introduction email
                'referral-request', // Requesting referral
                'resignation',      // Resignation letter
                'acceptance',       // Job offer acceptance
                'decline',          // Job offer decline
                'other',           // Custom/other templates
            ],
            required: [true, 'Please provide a template type'],
            default: 'email',
        },

        /**
         * Email subject line
         * Used for email templates (optional for cover letters)
         */
        subject: {
            type: String,
            maxlength: 200,
            trim: true,
        },

        /**
         * Template content/body
         * Main content with support for variables
         * Variables format: {{variableName}}
         */
        content: {
            type: String,
            required: [true, 'Please provide template content'],
            maxlength: 5000,
        },

        /**
         * Description/notes about the template
         * Helps users remember when to use this template
         */
        description: {
            type: String,
            maxlength: 500,
        },

        /**
         * Available variables in this template
         * Tracked for easy reference and validation
         * Automatically extracted from content
         */
        variables: [{
            type: String,
        }],

        /**
         * Whether this is a default/favorite template
         */
        isFavorite: {
            type: Boolean,
            default: false,
        },

        /**
         * Usage count
         * Track how many times this template has been used
         */
        usageCount: {
            type: Number,
            default: 0,
        },

        /**
         * Reference to the user who created this template
         */
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

/**
 * Pre-save middleware to extract variables from content
 * Finds all {{variableName}} patterns in the content
 */
TemplateSchema.pre('save', function (next) {
    // Extract variables from content
    const variableRegex = /\{\{(\w+)\}\}/g;
    const matches = this.content.match(variableRegex);

    if (matches) {
        // Remove duplicates and store variable names without braces
        this.variables = [...new Set(matches.map(match => match.replace(/\{\{|\}\}/g, '')))];
    } else {
        this.variables = [];
    }

    next();
});

/**
 * Index for faster queries
 */
TemplateSchema.index({ createdBy: 1, type: 1 });
TemplateSchema.index({ createdBy: 1, isFavorite: -1, createdAt: -1 });

export default mongoose.model('Template', TemplateSchema);
