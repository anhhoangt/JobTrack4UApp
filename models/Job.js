import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },
    // Enhanced fields for Phase 1
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    applicationDeadline: {
      type: Date,
    },
    salary: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        default: 'USD',
      },
    },
    jobDescription: {
      type: String,
      maxlength: 1000,
    },
    companyWebsite: {
      type: String,
      maxlength: 200,
    },
    jobPostingUrl: {
      type: String,
      maxlength: 500,
    },
    applicationMethod: {
      type: String,
      enum: ['email', 'website', 'linkedin', 'recruiter', 'other'],
      default: 'website',
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Job', JobSchema)
