/**
 * =====================================================
 * TEMPLATE CONTROLLER
 * =====================================================
 *
 * Handles CRUD operations for email and cover letter templates
 * Includes variable substitution and preview functionality
 */

import { StatusCodes } from 'http-status-codes';
import Template from '../models/Template.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';

/**
 * CREATE TEMPLATE
 *
 * Creates a new email or cover letter template
 *
 * @route POST /api/v1/templates
 * @access Private
 */
const createTemplate = async (req, res) => {
    const { name, content } = req.body;

    if (!name || !content) {
        throw new BadRequestError('Please provide template name and content');
    }

    req.body.createdBy = req.user.userId;
    const template = await Template.create(req.body);

    res.status(StatusCodes.CREATED).json({
        msg: 'Template created successfully',
        template,
    });
};

/**
 * GET ALL TEMPLATES
 *
 * Retrieves all templates for the current user with optional filtering
 *
 * @route GET /api/v1/templates
 * @access Private
 * @query {String} type - Filter by template type
 * @query {Boolean} favorite - Filter favorites only
 */
const getAllTemplates = async (req, res) => {
    const { type, favorite } = req.query;

    const queryObject = {
        createdBy: req.user.userId,
    };

    // Filter by type
    if (type && type !== 'all') {
        queryObject.type = type;
    }

    // Filter favorites
    if (favorite === 'true') {
        queryObject.isFavorite = true;
    }

    // Sort: favorites first, then by most recently created
    const templates = await Template.find(queryObject)
        .sort('-isFavorite -createdAt')
        .select('-__v');

    res.status(StatusCodes.OK).json({
        templates,
        count: templates.length,
    });
};

/**
 * GET SINGLE TEMPLATE
 *
 * Retrieves a specific template by ID
 *
 * @route GET /api/v1/templates/:id
 * @access Private
 */
const getTemplate = async (req, res) => {
    const { id: templateId } = req.params;

    const template = await Template.findOne({ _id: templateId });

    if (!template) {
        throw new NotFoundError(`No template with id: ${templateId}`);
    }

    checkPermissions(req.user, template.createdBy);

    res.status(StatusCodes.OK).json({ template });
};

/**
 * UPDATE TEMPLATE
 *
 * Updates an existing template
 *
 * @route PATCH /api/v1/templates/:id
 * @access Private
 */
const updateTemplate = async (req, res) => {
    const { id: templateId } = req.params;
    const { name, content } = req.body;

    if (!name || !content) {
        throw new BadRequestError('Please provide template name and content');
    }

    const template = await Template.findOne({ _id: templateId });

    if (!template) {
        throw new NotFoundError(`No template with id: ${templateId}`);
    }

    checkPermissions(req.user, template.createdBy);

    const updatedTemplate = await Template.findOneAndUpdate(
        { _id: templateId },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(StatusCodes.OK).json({
        msg: 'Template updated successfully',
        template: updatedTemplate,
    });
};

/**
 * DELETE TEMPLATE
 *
 * Deletes a template
 *
 * @route DELETE /api/v1/templates/:id
 * @access Private
 */
const deleteTemplate = async (req, res) => {
    const { id: templateId } = req.params;

    const template = await Template.findOne({ _id: templateId });

    if (!template) {
        throw new NotFoundError(`No template with id: ${templateId}`);
    }

    checkPermissions(req.user, template.createdBy);

    await template.remove();

    res.status(StatusCodes.OK).json({ msg: 'Template deleted successfully' });
};

/**
 * TOGGLE FAVORITE
 *
 * Toggles the favorite status of a template
 *
 * @route PATCH /api/v1/templates/:id/favorite
 * @access Private
 */
const toggleFavorite = async (req, res) => {
    const { id: templateId } = req.params;

    const template = await Template.findOne({ _id: templateId });

    if (!template) {
        throw new NotFoundError(`No template with id: ${templateId}`);
    }

    checkPermissions(req.user, template.createdBy);

    template.isFavorite = !template.isFavorite;
    await template.save();

    res.status(StatusCodes.OK).json({
        msg: `Template ${template.isFavorite ? 'added to' : 'removed from'} favorites`,
        template,
    });
};

/**
 * PREVIEW TEMPLATE
 *
 * Generates a preview of the template with sample or provided variable values
 *
 * @route POST /api/v1/templates/:id/preview
 * @access Private
 * @body {Object} variables - Key-value pairs for variable substitution
 */
const previewTemplate = async (req, res) => {
    const { id: templateId } = req.params;
    const { variables = {} } = req.body;

    const template = await Template.findOne({ _id: templateId });

    if (!template) {
        throw new NotFoundError(`No template with id: ${templateId}`);
    }

    checkPermissions(req.user, template.createdBy);

    // Default sample values for common variables
    const defaultValues = {
        yourName: req.user?.name || 'Your Name',
        yourEmail: req.user?.email || 'your.email@example.com',
        yourPhone: '+1 (555) 123-4567',
        yourLocation: req.user?.location || 'Your City',
        companyName: 'ABC Company',
        position: 'Software Engineer',
        hiringManager: 'Hiring Manager',
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        currentDate: new Date().toLocaleDateString(),
    };

    // Merge provided variables with defaults
    const allVariables = { ...defaultValues, ...variables };

    // Replace variables in content
    let previewContent = template.content;
    let previewSubject = template.subject || '';

    // Replace variables in both content and subject
    Object.keys(allVariables).forEach((key) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        previewContent = previewContent.replace(regex, allVariables[key]);
        previewSubject = previewSubject.replace(regex, allVariables[key]);
    });

    res.status(StatusCodes.OK).json({
        template: {
            ...template.toObject(),
            previewContent,
            previewSubject,
        },
        variables: allVariables,
    });
};

/**
 * INCREMENT USAGE COUNT
 *
 * Increments the usage count when a template is used
 *
 * @route POST /api/v1/templates/:id/use
 * @access Private
 */
const incrementUsage = async (req, res) => {
    const { id: templateId } = req.params;

    const template = await Template.findOne({ _id: templateId });

    if (!template) {
        throw new NotFoundError(`No template with id: ${templateId}`);
    }

    checkPermissions(req.user, template.createdBy);

    template.usageCount += 1;
    await template.save();

    res.status(StatusCodes.OK).json({
        msg: 'Usage count updated',
        usageCount: template.usageCount,
    });
};

/**
 * DUPLICATE TEMPLATE
 *
 * Creates a copy of an existing template
 *
 * @route POST /api/v1/templates/:id/duplicate
 * @access Private
 */
const duplicateTemplate = async (req, res) => {
    const { id: templateId } = req.params;

    const original = await Template.findOne({ _id: templateId });

    if (!original) {
        throw new NotFoundError(`No template with id: ${templateId}`);
    }

    checkPermissions(req.user, original.createdBy);

    // Create a copy with modified name
    const duplicate = await Template.create({
        name: `${original.name} (Copy)`,
        type: original.type,
        subject: original.subject,
        content: original.content,
        description: original.description,
        createdBy: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({
        msg: 'Template duplicated successfully',
        template: duplicate,
    });
};

export {
    createTemplate,
    getAllTemplates,
    getTemplate,
    updateTemplate,
    deleteTemplate,
    toggleFavorite,
    previewTemplate,
    incrementUsage,
    duplicateTemplate,
};
