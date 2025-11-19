/**
 * =====================================================
 * RESUME CONTROLLER (Multiple Resumes Support)
 * =====================================================
 *
 * Handles multiple resume uploads, deletions, and management
 * Each resume can have a category/field designation
 * Uses Cloudinary for cloud storage
 */

import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import { cloudinary } from '../config/cloudinaryConfig.js';

/**
 * UPLOAD RESUME
 *
 * Uploads a new resume file to Cloudinary and adds to user's resume collection
 *
 * @route POST /api/v1/resume/upload
 * @access Private
 * @param {File} req.file - Resume file (from multer)
 * @param {String} req.body.category - Resume category (software-engineering, data-science, etc.)
 * @returns {Object} Updated user data with all resumes
 */
const uploadResume = async (req, res) => {
    try {
        const { userId } = req.user;
        const { category = 'general' } = req.body;

        // Check if file was uploaded
        if (!req.file) {
            throw new BadRequestError('Please upload a file');
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Create new resume object
        const newResume = {
            fileName: req.file.originalname,
            url: req.file.path,
            publicId: req.file.filename,
            category: category,
            uploadDate: new Date(),
            isDefault: user.resumes.length === 0, // First resume is default
        };

        // Add to user's resumes array
        user.resumes.push(newResume);

        // Migrate legacy resume if exists
        if (user.resumePublicId && user.resumes.length === 1) {
            // This means we just added the first resume to the new system
            // and there's a legacy resume, so we already have 2 resumes total
            console.log('Legacy resume detected, keeping new upload');
        }

        await user.save();

        console.log('Resume uploaded successfully');

        res.status(StatusCodes.OK).json({
            msg: 'Resume uploaded successfully',
            resume: newResume,
            allResumes: user.resumes,
        });
    } catch (error) {
        console.error('Error in uploadResume:', error);
        throw error;
    }
};

/**
 * GET ALL RESUMES
 *
 * Retrieves all resumes for the current user
 *
 * @route GET /api/v1/resume
 * @access Private
 * @returns {Array} Array of resume objects
 */
const getAllResumes = async (req, res) => {
    const { userId } = req.user;

    const user = await User.findById(userId).select('resumes resumeUrl resumeFileName resumeUploadDate resumePublicId');

    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Migrate legacy resume to new system if exists
    const legacyMigrated = await migrateLegacyResume(user);

    res.status(StatusCodes.OK).json({
        resumes: user.resumes,
        migrated: legacyMigrated,
    });
};

/**
 * DELETE SPECIFIC RESUME
 *
 * Deletes a specific resume from the collection
 *
 * @route DELETE /api/v1/resume/:resumeId
 * @access Private
 * @param {String} req.params.resumeId - MongoDB _id of the resume to delete
 * @returns {Object} Success message
 */
const deleteResume = async (req, res) => {
    const { userId } = req.user;
    const { resumeId } = req.params;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Find the resume in the array
    const resumeIndex = user.resumes.findIndex(
        (resume) => resume._id.toString() === resumeId
    );

    if (resumeIndex === -1) {
        throw new NotFoundError('Resume not found');
    }

    const resumeToDelete = user.resumes[resumeIndex];

    // Delete from Cloudinary
    try {
        await cloudinary.uploader.destroy(resumeToDelete.publicId, {
            resource_type: 'raw',
        });
    } catch (error) {
        console.error('Error deleting resume from Cloudinary:', error);
        throw new BadRequestError('Failed to delete resume');
    }

    // If this was the default resume, set another one as default
    const wasDefault = resumeToDelete.isDefault;

    // Remove from array
    user.resumes.splice(resumeIndex, 1);

    // If deleted resume was default and there are other resumes, make the first one default
    if (wasDefault && user.resumes.length > 0) {
        user.resumes[0].isDefault = true;
    }

    await user.save();

    res.status(StatusCodes.OK).json({
        msg: 'Resume deleted successfully',
        resumes: user.resumes,
    });
};

/**
 * SET DEFAULT RESUME
 *
 * Sets a specific resume as the default one
 *
 * @route PATCH /api/v1/resume/:resumeId/default
 * @access Private
 * @param {String} req.params.resumeId - MongoDB _id of the resume to set as default
 * @returns {Object} Updated resumes array
 */
const setDefaultResume = async (req, res) => {
    const { userId } = req.user;
    const { resumeId } = req.params;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Find the resume
    const resume = user.resumes.find((r) => r._id.toString() === resumeId);
    if (!resume) {
        throw new NotFoundError('Resume not found');
    }

    // Set all resumes to not default
    user.resumes.forEach((r) => {
        r.isDefault = false;
    });

    // Set the selected resume as default
    resume.isDefault = true;

    await user.save();

    res.status(StatusCodes.OK).json({
        msg: 'Default resume updated',
        resumes: user.resumes,
    });
};

/**
 * UPDATE RESUME METADATA
 *
 * Updates resume category or filename
 *
 * @route PATCH /api/v1/resume/:resumeId
 * @access Private
 * @param {String} req.params.resumeId - MongoDB _id of the resume to update
 * @param {String} req.body.category - New category (optional)
 * @param {String} req.body.fileName - New file name (optional)
 * @returns {Object} Updated resume
 */
const updateResumeMetadata = async (req, res) => {
    const { userId } = req.user;
    const { resumeId } = req.params;
    const { category, fileName } = req.body;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Find the resume
    const resume = user.resumes.find((r) => r._id.toString() === resumeId);
    if (!resume) {
        throw new NotFoundError('Resume not found');
    }

    // Update fields if provided
    if (category) {
        resume.category = category;
    }
    if (fileName) {
        resume.fileName = fileName;
    }

    await user.save();

    res.status(StatusCodes.OK).json({
        msg: 'Resume updated successfully',
        resume: resume,
    });
};

/**
 * HELPER: Migrate legacy single resume to new system
 *
 * @param {Object} user - User document
 * @returns {Boolean} Whether migration occurred
 */
const migrateLegacyResume = async (user) => {
    // Check if there's a legacy resume and no new resumes
    if (user.resumePublicId && user.resumes.length === 0) {
        console.log('Migrating legacy resume for user:', user._id);

        user.resumes.push({
            fileName: user.resumeFileName || 'Legacy Resume',
            url: user.resumeUrl,
            publicId: user.resumePublicId,
            category: 'general',
            uploadDate: user.resumeUploadDate || new Date(),
            isDefault: true,
        });

        // Clear legacy fields
        user.resumeUrl = null;
        user.resumePublicId = null;
        user.resumeFileName = null;
        user.resumeUploadDate = null;

        await user.save();
        return true;
    }

    return false;
};

export {
    uploadResume,
    getAllResumes,
    deleteResume,
    setDefaultResume,
    updateResumeMetadata,
};
