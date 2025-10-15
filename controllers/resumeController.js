/**
 * =====================================================
 * RESUME CONTROLLER
 * =====================================================
 *
 * Handles resume upload, deletion, and retrieval operations
 * Uses Cloudinary for cloud storage
 */

import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

/**
 * UPLOAD RESUME
 *
 * Uploads a resume file to Cloudinary and updates user profile
 *
 * @route POST /api/v1/resume/upload
 * @access Private
 * @param {File} req.file - Resume file (from multer)
 * @returns {Object} Updated user data with resume info
 */
const uploadResume = async (req, res) => {
    try {
        // console.log('Upload resume request received');
        // console.log('User:', req.user);
        // console.log('File:', req.file);

        const { userId } = req.user;

        // Check if file was uploaded
        if (!req.file) {
            console.log('No file uploaded');
            throw new BadRequestError('Please upload a file');
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            throw new NotFoundError('User not found');
        }

        // console.log('User found:', user.email);

        // If user already has a resume, delete the old one from Cloudinary
        if (user.resumePublicId) {
            try {
                console.log('Deleting old resume:', user.resumePublicId);
                await cloudinary.uploader.destroy(user.resumePublicId, {
                    resource_type: 'raw'
                });
            } catch (error) {
                console.error('Error deleting old resume:', error);
                // Continue even if deletion fails
            }
        }

        // Update user with new resume information
        user.resumeUrl = req.file.path;
        user.resumePublicId = req.file.filename;
        user.resumeFileName = req.file.originalname;
        user.resumeUploadDate = new Date();

        await user.save();

        console.log('Resume uploaded successfully');

        res.status(StatusCodes.OK).json({
            msg: 'Resume uploaded successfully',
            resume: {
                url: user.resumeUrl,
                fileName: user.resumeFileName,
                uploadDate: user.resumeUploadDate,
            },
        });
    } catch (error) {
        console.error('Error in uploadResume:', error);
        throw error;
    }
};

/**
 * DELETE RESUME
 *
 * Deletes resume from Cloudinary and removes from user profile
 *
 * @route DELETE /api/v1/resume
 * @access Private
 * @returns {Object} Success message
 */
const deleteResume = async (req, res) => {
    const { userId } = req.user;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Check if user has a resume
    if (!user.resumePublicId) {
        throw new BadRequestError('No resume found to delete');
    }

    // Delete from Cloudinary
    try {
        await cloudinary.uploader.destroy(user.resumePublicId, {
            resource_type: 'raw'
        });
    } catch (error) {
        console.error('Error deleting resume from Cloudinary:', error);
        throw new BadRequestError('Failed to delete resume');
    }

    // Clear resume fields in user document
    user.resumeUrl = null;
    user.resumePublicId = null;
    user.resumeFileName = null;
    user.resumeUploadDate = null;

    await user.save();

    res.status(StatusCodes.OK).json({
        msg: 'Resume deleted successfully',
    });
};

/**
 * GET RESUME INFO
 *
 * Retrieves current user's resume information
 *
 * @route GET /api/v1/resume
 * @access Private
 * @returns {Object} Resume information or null if no resume
 */
const getResumeInfo = async (req, res) => {
    const { userId } = req.user;

    const user = await User.findById(userId).select('resumeUrl resumeFileName resumeUploadDate');

    if (!user) {
        throw new NotFoundError('User not found');
    }

    res.status(StatusCodes.OK).json({
        resume: user.resumeUrl ? {
            url: user.resumeUrl,
            fileName: user.resumeFileName,
            uploadDate: user.resumeUploadDate,
        } : null,
    });
};

export { uploadResume, deleteResume, getResumeInfo };
