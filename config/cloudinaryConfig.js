/**
 * =====================================================
 * CLOUDINARY CONFIGURATION
 * =====================================================
 *
 * Configures Cloudinary for file uploads (resumes, documents)
 *
 * Features:
 * - Cloud-based file storage
 * - Automatic file optimization
 * - Secure file URLs
 * - CDN delivery
 */

import cloudinaryModule from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the v2 API from cloudinary
const cloudinary = cloudinaryModule.v2;

// Log to verify credentials are loaded (remove in production)
// console.log('Cloudinary Config:');
// console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
// console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'NOT SET');
// console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'NOT SET');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * CLOUDINARY STORAGE CONFIGURATION
 *
 * Pass the full cloudinary module (not just v2) to CloudinaryStorage
 */
const storage = new CloudinaryStorage({
    cloudinary: cloudinaryModule,
    params: {
        folder: 'jobtrack-resumes',
        resource_type: 'raw',
    },
});

/**
 * FILE FILTER
 *
 * Validates uploaded files before processing
 * - Only accepts PDF, DOC, DOCX files
 * - Rejects other file types with error message
 */
const fileFilter = (req, file, cb) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
    }
};

/**
 * MULTER UPLOAD CONFIGURATION
 *
 * Configures multer with:
 * - Cloudinary storage
 * - File size limit (5MB)
 * - File type validation
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: fileFilter,
});

// Export cloudinary instance and upload middleware
export { cloudinary, upload };
