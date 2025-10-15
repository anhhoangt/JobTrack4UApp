import express from 'express'
const router = express.Router()

import {
    createActivity,
    getAllActivities,
    getActivity,
    updateActivity,
    deleteActivity,
    getJobTimeline,
    getUpcomingActivities,
    markActivityComplete,
    markActivityIncomplete,
} from '../controllers/activitiesController.js'

// General activity routes
router.route('/').post(createActivity).get(getAllActivities)
router.route('/upcoming').get(getUpcomingActivities)
router.route('/:id').get(getActivity).patch(updateActivity).delete(deleteActivity)
router.route('/:id/complete').patch(markActivityComplete)
router.route('/:id/incomplete').patch(markActivityIncomplete)

// Job-specific timeline
router.route('/job/:jobId/timeline').get(getJobTimeline)

export default router
