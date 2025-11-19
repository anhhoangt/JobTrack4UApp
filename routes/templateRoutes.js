/**
 * =====================================================
 * TEMPLATE ROUTES
 * =====================================================
 *
 * API routes for email and cover letter template management
 * Protected routes - require authentication
 */

import express from 'express';
const router = express.Router();

import {
    createTemplate,
    getAllTemplates,
    getTemplate,
    updateTemplate,
    deleteTemplate,
    toggleFavorite,
    previewTemplate,
    incrementUsage,
    duplicateTemplate,
} from '../controllers/templateController.js';

/**
 * TEMPLATE ROUTES
 *
 * GET    /api/v1/templates                      - Get all user's templates
 * POST   /api/v1/templates                      - Create new template
 * GET    /api/v1/templates/:id                  - Get specific template
 * PATCH  /api/v1/templates/:id                  - Update template
 * DELETE /api/v1/templates/:id                  - Delete template
 * PATCH  /api/v1/templates/:id/favorite         - Toggle favorite status
 * POST   /api/v1/templates/:id/preview          - Preview template with variables
 * POST   /api/v1/templates/:id/use              - Increment usage count
 * POST   /api/v1/templates/:id/duplicate        - Duplicate template
 */

// Base routes
router.route('/')
    .get(getAllTemplates)
    .post(createTemplate);

// Single template routes
router.route('/:id')
    .get(getTemplate)
    .patch(updateTemplate)
    .delete(deleteTemplate);

// Template actions
router.route('/:id/favorite').patch(toggleFavorite);
router.route('/:id/preview').post(previewTemplate);
router.route('/:id/use').post(incrementUsage);
router.route('/:id/duplicate').post(duplicateTemplate);

export default router;
