/**
 * =====================================================
 * AI REQUEST LIMIT MIDDLEWARE
 * =====================================================
 *
 * Rate limiting middleware for AI assistant features
 * - Normal users: Limited to 2 requests per day
 * - Admin users: Unlimited requests
 * - Counter resets daily at midnight
 */

import User from '../models/User.js';
import { BadRequestError } from '../errors/index.js';

const checkAILimit = async (req, res, next) => {
    try {
        const { userId, role } = req.user;

        // Admin users have unlimited access
        if (role === 'admin') {
            return next();
        }

        // Get user from database to check AI request count
        const user = await User.findById(userId);

        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Check if we need to reset the counter (24 hours have passed)
        const now = new Date();
        const resetDate = new Date(user.aiRequestResetDate);
        const hoursSinceReset = (now - resetDate) / (1000 * 60 * 60);

        // Reset counter if 24 hours have passed
        if (hoursSinceReset >= 24) {
            user.aiRequestCount = 0;
            user.aiRequestResetDate = now;
            await user.save();
        }

        // Check if user has exceeded the limit (2 requests for normal users)
        const AI_REQUEST_LIMIT = 2;

        if (user.aiRequestCount >= AI_REQUEST_LIMIT) {
            throw new BadRequestError(
                `You have reached your daily limit of ${AI_REQUEST_LIMIT} AI requests. Your limit will reset in ${Math.ceil(24 - hoursSinceReset)} hours. Upgrade to admin for unlimited access.`
            );
        }

        // Increment the request count
        user.aiRequestCount += 1;
        await user.save();

        // Attach remaining requests to response for frontend
        req.aiRemainingRequests = AI_REQUEST_LIMIT - user.aiRequestCount;

        next();
    } catch (error) {
        if (error instanceof BadRequestError) {
            throw error;
        }
        throw new BadRequestError('Failed to check AI request limit');
    }
};

export default checkAILimit;
