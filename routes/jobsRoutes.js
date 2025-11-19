import express from "express";
const router = express.Router();

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
  getAdvancedAnalytics,
  quickAddJob,
} from "../controllers/jobsController.js";

// import testUser from '../middleware/testUser.js';

// router.route("/").post(testUser, createJob).get(getAllJobs);
router.route("/").post(createJob).get(getAllJobs);
// remember about :id
router.route("/stats").get(showStats);
router.route("/advanced-analytics").get(getAdvancedAnalytics);
router.route("/quick-add").post(quickAddJob);
// router.route('/:id').delete(testUser, deleteJob).patch(testUser, updateJob);
router.route("/:id").delete(deleteJob).patch(updateJob);

export default router;
