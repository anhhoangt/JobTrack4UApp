import mongoose from 'mongoose'

/**
 * Activity Schema Definition (Phase 3 Feature)
 *
 * This schema represents activities/interactions related to job applications.
 * It provides comprehensive tracking of all actions taken during the job search process,
 * including communications, interviews, follow-ups, and important milestones.
 *
 * Key Features:
 * - Timeline tracking for each job application
 * - Task management with completion status and reminders
 * - Contact person information for networking
 * - File attachments for documents and correspondence
 * - Priority levels for activity importance
 * - Flexible activity types covering the entire job search workflow
 */
const ActivitySchema = new mongoose.Schema(
  {
    /**
     * Reference to the associated job application
     * Links this activity to a specific job in the system
     * Required field for maintaining job-activity relationships
     */
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Please provide job'],
    },

    /**
     * Type of activity being tracked
     * Predefined categories covering common job search activities:
     * - Communication: email-sent, email-received, phone-call-made, phone-call-received
     * - Application Process: application-sent, follow-up-sent
     * - Interviews: interview-scheduled, interview-completed
     * - Outcomes: offer-received, rejection-received
     * - General: note-added, other
     */
    type: {
      type: String,
      enum: [
        'application-sent',      // Initial job application submission
        'email-sent',           // Outgoing email communication
        'email-received',       // Incoming email from employer
        'phone-call-made',      // Outbound phone call
        'phone-call-received',  // Inbound phone call
        'interview-scheduled',  // Interview appointment set
        'interview-completed',  // Interview finished
        'follow-up-sent',       // Follow-up communication sent
        'offer-received',       // Job offer received
        'rejection-received',   // Rejection notification
        'note-added',          // General note or observation
        'other'                // Miscellaneous activities
      ],
      required: [true, 'Please provide activity type'],
    },

    /**
     * Brief title/summary of the activity
     * Required field providing quick identification of the activity
     * Limited to 100 characters for conciseness
     */
    title: {
      type: String,
      required: [true, 'Please provide activity title'],
      maxlength: 100,
    },

    /**
     * Detailed description of the activity
     * Optional field for storing comprehensive information
     * Limited to 500 characters to maintain database efficiency
     */
    description: {
      type: String,
      maxlength: 500,
    },

    /**
     * Planned/scheduled date for the activity
     * Used for future activities and planning
     * Optional field for activities that don't have specific timing
     */
    scheduledDate: {
      type: Date,
    },

    /**
     * Actual completion date of the activity
     * Automatically populated when activity is marked as completed
     * Used for tracking actual vs planned timelines
     */
    completedDate: {
      type: Date,
    },

    /**
     * Completion status of the activity
     * Boolean flag indicating whether the activity has been finished
     * Defaults to false for new activities
     */
    isCompleted: {
      type: Boolean,
      default: false,
    },

    /**
     * Priority level for the activity
     * Helps users focus on most important tasks
     * Three levels: low, medium (default), high
     */
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    /**
     * Date for reminder notifications
     * Optional field for setting up alerts about upcoming activities
     * Can be used to trigger notifications in future implementations
     */
    reminderDate: {
      type: Date,
    },

    /**
     * Contact person information
     * Embedded document for storing details about people involved in the activity
     * Useful for networking and relationship management
     */
    contactPerson: {
      // Full name of the contact person
      name: {
        type: String,
        maxlength: 50,
      },
      // Email address for future communication
      email: {
        type: String,
        maxlength: 100,
      },
      // Phone number for direct contact
      phone: {
        type: String,
        maxlength: 20,
      },
      // Job title or role of the contact person
      role: {
        type: String,
        maxlength: 50,
      },
    },

    /**
     * File attachments related to the activity
     * Array of embedded documents for storing file references
     * Supports various document types commonly used in job applications
     */
    attachments: [{
      // Display name for the attachment
      name: {
        type: String,
        maxlength: 100,
      },
      // URL or file path to the attachment
      url: {
        type: String,
        maxlength: 500,
      },
      // Type of document attached
      type: {
        type: String,
        enum: ['resume', 'cover-letter', 'portfolio', 'other'],
        default: 'other',
      },
    }],

    /**
     * Reference to the user who created this activity
     * Ensures data isolation between different users
     * Required for security and data organization
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

/**
 * Database Indexes for Performance Optimization
 *
 * These indexes improve query performance for common access patterns:
 * 1. Finding activities by job (with recent activities first)
 * 2. Finding activities by user (with recent activities first)
 */
ActivitySchema.index({ jobId: 1, createdAt: -1 })
ActivitySchema.index({ createdBy: 1, createdAt: -1 })

// Export the Activity model for use in controllers and routes
export default mongoose.model('Activity', ActivitySchema)
