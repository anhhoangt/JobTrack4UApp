/**
 * =====================================================
 * ADMIN CHECK MIDDLEWARE
 * =====================================================
 *
 * Middleware to check if the authenticated user is an admin
 * Use this to protect admin-only routes
 */

import { UnauthenticatedError } from '../errors/index.js';

const checkAdmin = async (req, res, next) => {
    // Check if user has admin role
    if (req.user.role !== 'admin') {
        throw new UnauthenticatedError('Access denied. Admin privileges required.');
    }
    next();
};

export default checkAdmin;
