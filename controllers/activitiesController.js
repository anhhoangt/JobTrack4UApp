import Activity from '../models/Activity.js'
import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError } from '../errors/index.js'

/**
 * =====================================================
 * ACTIVITIES CONTROLLER (Phase 3 Feature)
 * =====================================================
 *
 * This controller manages all activity-related operations for job applications.
 * Activities represent interactions, tasks, and milestones in the job search process.
 *
 * Key Features:
 * - CRUD operations for activities
 * - Job timeline management
 * - Upcoming activities tracking
 * - Activity completion marking
 * - Filtering and pagination support
 */

/**
 * CREATE ACTIVITY
 *
 * Creates a new activity associated with a job application.
 * Validates that the job exists and belongs to the authenticated user.
 *
 * @route POST /api/v1/activities
 * @access Private
 * @param {Object} req.body - Activity data including jobId, type, title, etc.
 * @returns {Object} Created activity object
 */
const createActivity = async (req, res) => {
    const { jobId } = req.body

    // Security Check: Verify the job exists and belongs to the current user
    // This prevents users from creating activities for jobs they don't own
    const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId })
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    // Associate the activity with the authenticated user
    req.body.createdBy = req.user.userId

    // Create the new activity in the database
    const activity = await Activity.create(req.body)

    res.status(StatusCodes.CREATED).json({ activity })
}

/**
 * GET ALL ACTIVITIES
 *
 * Retrieves activities for the authenticated user with optional filtering.
 * Supports pagination and various filter options for better usability.
 *
 * @route GET /api/v1/activities
 * @access Private
 * @query {String} jobId - Filter by specific job (optional)
 * @query {String} type - Filter by activity type (optional)
 * @query {String} isCompleted - Filter by completion status (optional)
 * @query {Number} page - Page number for pagination (default: 1)
 * @query {Number} limit - Items per page (default: 20)
 * @returns {Object} Paginated activities with metadata
 */
const getAllActivities = async (req, res) => {
    const { jobId, type, isCompleted, page = 1, limit = 20 } = req.query

    // Base query: only get activities created by the authenticated user
    const queryObject = {
        createdBy: req.user.userId,
    }

    // Apply optional filters based on query parameters

    // Filter by specific job if jobId is provided
    if (jobId) {
        queryObject.jobId = jobId
    }

    // Filter by activity type (e.g., 'email-sent', 'interview-scheduled')
    if (type && type !== 'all') {
        queryObject.type = type
    }

    // Filter by completion status (completed vs pending activities)
    if (isCompleted !== undefined) {
        queryObject.isCompleted = isCompleted === 'true'
    }

    // Calculate pagination offset
    const skip = (Number(page) - 1) * Number(limit)

    // Execute query with job details populated for better UX
    // Sort by creation date to show most recent activities first
    const activities = await Activity.find(queryObject)
        .populate('jobId', 'position company status') // Include relevant job info
        .sort({ createdAt: -1 }) // Most recent first
        .skip(skip)
        .limit(Number(limit))

    // Get total count for pagination metadata
    const totalActivities = await Activity.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalActivities / Number(limit))

    res.status(StatusCodes.OK).json({
        activities,
        totalActivities,
        numOfPages,
        currentPage: Number(page)
    })
}

/**
 * GET SINGLE ACTIVITY
 *
 * Retrieves a specific activity by ID.
 * Includes security check to ensure user owns the activity.
 *
 * @route GET /api/v1/activities/:id
 * @access Private
 * @param {String} req.params.id - Activity ID
 * @returns {Object} Activity details with populated job information
 */
const getActivity = async (req, res) => {
    const { id: activityId } = req.params

    // Find activity with security check: user must own the activity
    const activity = await Activity.findOne({
        _id: activityId,
        createdBy: req.user.userId,
    }).populate('jobId', 'position company status')

    if (!activity) {
        throw new NotFoundError(`No activity with id: ${activityId}`)
    }

    res.status(StatusCodes.OK).json({ activity })
}

/**
 * UPDATE ACTIVITY
 *
 * Updates an existing activity with new information.
 * Validates ownership before allowing modifications.
 *
 * @route PATCH /api/v1/activities/:id
 * @access Private
 * @param {String} req.params.id - Activity ID
 * @param {Object} req.body - Updated activity data
 * @returns {Object} Updated activity with populated job information
 */
const updateActivity = async (req, res) => {
    const { id: activityId } = req.params

    // Security Check: Verify activity exists and belongs to user
    const activity = await Activity.findOne({
        _id: activityId,
        createdBy: req.user.userId,
    })

    if (!activity) {
        throw new NotFoundError(`No activity with id: ${activityId}`)
    }

    // Update the activity with new data
    // new: true returns the updated document
    // runValidators: true ensures schema validation runs on update
    const updatedActivity = await Activity.findOneAndUpdate(
        { _id: activityId, createdBy: req.user.userId },
        req.body,
        { new: true, runValidators: true }
    ).populate('jobId', 'position company status')

    res.status(StatusCodes.OK).json({ activity: updatedActivity })
}

/**
 * DELETE ACTIVITY
 *
 * Removes an activity from the system.
 * Includes ownership validation for security.
 *
 * @route DELETE /api/v1/activities/:id
 * @access Private
 * @param {String} req.params.id - Activity ID
 * @returns {Object} Success message
 */
const deleteActivity = async (req, res) => {
    const { id: activityId } = req.params

    // Security Check: Verify activity exists and belongs to user
    const activity = await Activity.findOne({
        _id: activityId,
        createdBy: req.user.userId,
    })

    if (!activity) {
        throw new NotFoundError(`No activity with id: ${activityId}`)
    }

    // Remove the activity from the database
    await Activity.findOneAndDelete({
        _id: activityId,
        createdBy: req.user.userId,
    })

    res.status(StatusCodes.OK).json({ msg: 'Activity deleted successfully' })
}

/**
 * GET JOB TIMELINE
 *
 * Retrieves all activities for a specific job, creating a chronological timeline.
 * Useful for viewing the complete history of interactions for a job application.
 *
 * @route GET /api/v1/activities/job/:jobId/timeline
 * @access Private
 * @param {String} req.params.jobId - Job ID
 * @returns {Object} Job details and associated activities timeline
 */
const getJobTimeline = async (req, res) => {
    const { jobId } = req.params

    // Security Check: Verify the job exists and belongs to the user
    const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId })
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    // Get all activities for this job, sorted by creation date (newest first)
    const activities = await Activity.find({
        jobId: jobId,
        createdBy: req.user.userId,
    }).sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({ activities, job })
}

/**
 * GET UPCOMING ACTIVITIES
 *
 * Retrieves activities that are scheduled or have reminders in the near future.
 * Helps users stay on top of important upcoming tasks and deadlines.
 *
 * @route GET /api/v1/activities/upcoming
 * @access Private
 * @query {Number} days - Number of days to look ahead (default: 7)
 * @returns {Object} List of upcoming activities with job details
 */
const getUpcomingActivities = async (req, res) => {
    const { days = 7 } = req.query

    // Define date range for "upcoming" activities
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + Number(days))

    // Find incomplete activities with scheduled dates or reminders in the date range
    const upcomingActivities = await Activity.find({
        createdBy: req.user.userId,
        isCompleted: false, // Only show pending activities
        $or: [
            {
                // Activities scheduled within the date range
                scheduledDate: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
            {
                // Activities with reminders in the date range
                reminderDate: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        ],
    })
        .populate('jobId', 'position company status')
        .sort({ scheduledDate: 1, reminderDate: 1 }) // Sort by earliest dates first

    res.status(StatusCodes.OK).json({ upcomingActivities })
}

/**
 * MARK ACTIVITY AS COMPLETE
 *
 * Marks an activity as completed and records the completion date.
 * Useful for task management and progress tracking.
 *
 * @route PATCH /api/v1/activities/:id/complete
 * @access Private
 * @param {String} req.params.id - Activity ID
 * @returns {Object} Updated activity marked as completed
 */
const markActivityComplete = async (req, res) => {
    const { id: activityId } = req.params

    // Security Check: Verify activity exists and belongs to user
    const activity = await Activity.findOne({
        _id: activityId,
        createdBy: req.user.userId,
    })

    if (!activity) {
        throw new NotFoundError(`No activity with id: ${activityId}`)
    }

    // Update activity to completed status with current timestamp
    const updatedActivity = await Activity.findOneAndUpdate(
        { _id: activityId, createdBy: req.user.userId },
        {
            isCompleted: true,
            completedDate: new Date() // Record when it was completed
        },
        { new: true, runValidators: true }
    ).populate('jobId', 'position company status')

    res.status(StatusCodes.OK).json({ activity: updatedActivity })
}

// Export all controller functions for use in routes
export {
    createActivity,
    getAllActivities,
    getActivity,
    updateActivity,
    deleteActivity,
    getJobTimeline,
    getUpcomingActivities,
    markActivityComplete,
}
