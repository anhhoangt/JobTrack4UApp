import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false,
  },
  // lastName: {
  //   type: String,
  //   trim: true,
  //   maxlength: 20,
  //   default: 'lastName',
  // },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'my city',
  },
  // User role for access control
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // Multiple Resume storage (array of resume objects)
  resumes: [{
    fileName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
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
        'general',
        'other'
      ],
      default: 'general',
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  }],
  // Legacy resume fields (for backward compatibility - deprecated)
  resumeUrl: {
    type: String,
    default: null,
  },
  resumePublicId: {
    type: String,
    default: null,
  },
  resumeFileName: {
    type: String,
    default: null,
  },
  resumeUploadDate: {
    type: Date,
    default: null,
  },
  // AI request tracking for rate limiting
  aiRequestCount: {
    type: Number,
    default: 0,
  },
  aiRequestResetDate: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export default mongoose.model('User', UserSchema)
