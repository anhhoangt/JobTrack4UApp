import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';
const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search, category, priority } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  // add stuff based on condition

  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }
  // Phase 2: Category and Priority filters
  if (category && category !== 'all') {
    queryObject.category = category;
  }
  if (priority && priority !== 'all') {
    queryObject.priority = priority;
  }
  // NO AWAIT

  let result = Job.find(queryObject);

  // chain sort conditions

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  //

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }
  // check permissions

  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
};
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

const getAdvancedAnalytics = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.userId);

  // 1. Status Distribution (similar to existing stats but with percentages)
  const statusStats = await Job.aggregate([
    { $match: { createdBy: userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const totalJobs = await Job.countDocuments({ createdBy: userId });

  const statusDistribution = {
    pending: 0,
    interview: 0,
    declined: 0,
  };

  statusStats.forEach(({ _id, count }) => {
    statusDistribution[_id] = count;
  });

  const statusPercentages = {
    pending: totalJobs > 0 ? ((statusDistribution.pending / totalJobs) * 100).toFixed(1) : 0,
    interview: totalJobs > 0 ? ((statusDistribution.interview / totalJobs) * 100).toFixed(1) : 0,
    declined: totalJobs > 0 ? ((statusDistribution.declined / totalJobs) * 100).toFixed(1) : 0,
  };

  // 2. Response Rate Calculation
  // Applications that moved from pending to interview or declined
  const responseRate = totalJobs > 0
    ? (((statusDistribution.interview + statusDistribution.declined) / totalJobs) * 100).toFixed(1)
    : 0;

  // 3. Success Rate (Interview Rate)
  const successRate = totalJobs > 0
    ? ((statusDistribution.interview / totalJobs) * 100).toFixed(1)
    : 0;

  // 4. Application Velocity (applications per week for last 12 weeks)
  const twelveWeeksAgo = moment().subtract(12, 'weeks').toDate();
  const weeklyApplications = await Job.aggregate([
    {
      $match: {
        createdBy: userId,
        createdAt: { $gte: twelveWeeksAgo }
      }
    },
    {
      $group: {
        _id: {
          week: { $week: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } }
  ]);

  // Format weekly data
  const formattedWeeklyApps = weeklyApplications.map(item => {
    const { _id: { year, week }, count } = item;
    // Calculate the start of week date
    const startOfYear = moment().year(year).startOf('year');
    const weekDate = startOfYear.add(week - 1, 'weeks');
    return {
      week: `Week ${week}`,
      date: weekDate.format('MMM DD'),
      count
    };
  });

  // Calculate average applications per week
  const avgAppsPerWeek = weeklyApplications.length > 0
    ? (weeklyApplications.reduce((sum, item) => sum + item.count, 0) / 12).toFixed(1)
    : 0;

  // 5. Category Performance Breakdown
  const categoryStats = await Job.aggregate([
    { $match: { createdBy: userId } },
    {
      $group: {
        _id: '$category',
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        interview: {
          $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] }
        },
        declined: {
          $sum: { $cond: [{ $eq: ['$status', 'declined'] }, 1, 0] }
        }
      }
    },
    { $sort: { total: -1 } }
  ]);

  const categoryPerformance = categoryStats.map(cat => ({
    category: cat._id || 'Uncategorized',
    total: cat.total,
    pending: cat.pending,
    interview: cat.interview,
    declined: cat.declined,
    interviewRate: cat.total > 0 ? ((cat.interview / cat.total) * 100).toFixed(1) : 0
  }));

  // 6. Priority Distribution
  const priorityStats = await Job.aggregate([
    { $match: { createdBy: userId } },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  const priorityDistribution = {
    low: 0,
    medium: 0,
    high: 0,
  };

  priorityStats.forEach(({ _id, count }) => {
    if (_id) {
      priorityDistribution[_id] = count;
    }
  });

  // 7. Time-based Insights
  const last30Days = moment().subtract(30, 'days').toDate();
  const last7Days = moment().subtract(7, 'days').toDate();

  const recentApplications = {
    last7Days: await Job.countDocuments({
      createdBy: userId,
      createdAt: { $gte: last7Days }
    }),
    last30Days: await Job.countDocuments({
      createdBy: userId,
      createdAt: { $gte: last30Days }
    })
  };

  // 8. Job Type Distribution
  const jobTypeStats = await Job.aggregate([
    { $match: { createdBy: userId } },
    { $group: { _id: '$jobType', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const jobTypeDistribution = jobTypeStats.map(type => ({
    type: type._id || 'Not Specified',
    count: type.count,
    percentage: totalJobs > 0 ? ((type.count / totalJobs) * 100).toFixed(1) : 0
  }));

  // 9. Monthly Trend (last 6 months with more details)
  const monthlyTrend = await Job.aggregate([
    { $match: { createdBy: userId } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        interview: {
          $sum: { $cond: [{ $eq: ['$status', 'interview'] }, 1, 0] }
        },
        declined: {
          $sum: { $cond: [{ $eq: ['$status', 'declined'] }, 1, 0] }
        }
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  const formattedMonthlyTrend = monthlyTrend
    .map((item) => {
      const { _id: { year, month }, total, pending, interview, declined } = item;
      const date = moment().month(month - 1).year(year).format('MMM YYYY');
      return { date, total, pending, interview, declined };
    })
    .reverse();

  // 10. Conversion Funnel
  const conversionFunnel = {
    applied: totalJobs,
    responded: statusDistribution.interview + statusDistribution.declined,
    interviewing: statusDistribution.interview,
    // We can assume offers are tracked separately or in a different status in the future
  };

  res.status(StatusCodes.OK).json({
    totalJobs,
    statusDistribution,
    statusPercentages,
    responseRate: parseFloat(responseRate),
    successRate: parseFloat(successRate),
    avgAppsPerWeek: parseFloat(avgAppsPerWeek),
    categoryPerformance,
    priorityDistribution,
    recentApplications,
    jobTypeDistribution,
    weeklyApplications: formattedWeeklyApps,
    monthlyTrend: formattedMonthlyTrend,
    conversionFunnel
  });
};

/**
 * QUICK ADD JOB FROM EXTENSION
 *
 * Creates a job from browser extension scraped data
 * Includes smart field mapping and validation
 *
 * @route POST /api/v1/jobs/quick-add
 * @access Private
 */
const quickAddJob = async (req, res) => {
    const { userId } = req.user;

    // Extract and map fields from extension data
    const {
        company,
        position,
        jobLocation,
        jobType,
        status = 'pending',
        jobUrl,
        description,
        salary,
        postedDate,
        source, // Which job board it came from
    } = req.body;

    if (!position || !company) {
        throw new BadRequestError('Please provide position and company');
    }

    // Create job with extension data
    const job = await Job.create({
        company,
        position,
        jobLocation: jobLocation || 'Remote',
        status,
        jobType: jobType || 'full-time',
        createdBy: userId,
        // Enhanced fields from scraper
        jobUrl: jobUrl || '',
        description: description || '',
        salary: salary || '',
        applicationDate: postedDate ? new Date(postedDate) : undefined,
        notes: source ? `Added via browser extension from ${source}` : 'Added via browser extension',
    });

    res.status(StatusCodes.CREATED).json({
        msg: 'Job added successfully from extension',
        job
    });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats, getAdvancedAnalytics, quickAddJob };
