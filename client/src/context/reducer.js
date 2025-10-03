import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  // Phase 3: Activity Actions
  GET_ACTIVITIES_BEGIN,
  GET_ACTIVITIES_SUCCESS,
  GET_ACTIVITIES_ERROR,
  CREATE_ACTIVITY_BEGIN,
  CREATE_ACTIVITY_SUCCESS,
  CREATE_ACTIVITY_ERROR,
  UPDATE_ACTIVITY_BEGIN,
  UPDATE_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_ERROR,
  DELETE_ACTIVITY_BEGIN,
  DELETE_ACTIVITY_SUCCESS,
  DELETE_ACTIVITY_ERROR,
  MARK_ACTIVITY_COMPLETE_BEGIN,
  MARK_ACTIVITY_COMPLETE_SUCCESS,
  MARK_ACTIVITY_COMPLETE_ERROR,
  GET_TIMELINE_ACTIVITIES_BEGIN,
  GET_TIMELINE_ACTIVITIES_SUCCESS,
  GET_TIMELINE_ACTIVITIES_ERROR,
  HANDLE_ACTIVITY_CHANGE,
  CLEAR_ACTIVITY_FILTERS,
  SET_SELECTED_JOB_FOR_TIMELINE,
  CHANGE_ACTIVITY_PAGE,
  // Enhanced Activity Actions
  SET_EDIT_ACTIVITY,
  CLEAR_ACTIVITY_VALUES,
  SEARCH_ACTIVITIES_BEGIN,
  SEARCH_ACTIVITIES_SUCCESS,
  GET_ACTIVITY_DETAILS_BEGIN,
  GET_ACTIVITY_DETAILS_SUCCESS,
} from './actions';

import { initialState } from './appContext';

const reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: 'danger',
      alertText: 'Please provide all values!',
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: '',
      alertText: '',
    };
  }

  if (action.type === SETUP_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === SETUP_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: action.payload.alertText,
    };
  }
  if (action.type === SETUP_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
      userLoading: false,
    };
  }
  if (action.type === UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Profile Updated!',
    };
  }
  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      page: 1,
      [action.payload.name]: action.payload.value,
    };
  }
  if (action.type === CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editJobId: '',
      position: '',
      company: '',
      jobLocation: state.userLocation,
      jobType: 'full-time',
      status: 'pending',
      // Enhanced fields
      applicationDate: '',
      applicationDeadline: '',
      salaryMin: '',
      salaryMax: '',
      salaryCurrency: 'USD',
      jobDescription: '',
      companyWebsite: '',
      jobPostingUrl: '',
      applicationMethod: 'website',
      notes: '',
      // Phase 2 fields
      category: 'other',
      tags: '',
      priority: 'medium',
    };

    return {
      ...state,
      ...initialState,
    };
  }
  if (action.type === CREATE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'New Job Created!',
    };
  }
  if (action.type === CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === GET_JOBS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === GET_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
      numOfPages: action.payload.numOfPages,
    };
  }
  if (action.type === SET_EDIT_JOB) {
    const job = state.jobs.find((job) => job._id === action.payload.id);
    const {
      _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
      applicationDate,
      applicationDeadline,
      salary,
      jobDescription,
      companyWebsite,
      jobPostingUrl,
      applicationMethod,
      notes,
      category,
      tags,
      priority
    } = job;

    // Format dates for input fields
    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toISOString().split('T')[0];
    };

    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
      // Enhanced fields
      applicationDate: formatDate(applicationDate),
      applicationDeadline: formatDate(applicationDeadline),
      salaryMin: salary?.min || '',
      salaryMax: salary?.max || '',
      salaryCurrency: salary?.currency || 'USD',
      jobDescription: jobDescription || '',
      companyWebsite: companyWebsite || '',
      jobPostingUrl: jobPostingUrl || '',
      applicationMethod: applicationMethod || 'website',
      notes: notes || '',
      // Phase 2 fields
      category: category || 'other',
      tags: Array.isArray(tags) ? tags.join(', ') : '',
      priority: priority || 'medium',
    };
  }
  if (action.type === DELETE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === DELETE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === EDIT_JOB_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === EDIT_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Job Updated!',
    };
  }
  if (action.type === EDIT_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === SHOW_STATS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications,
    };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      search: '',
      searchStatus: 'all',
      searchType: 'all',
      sort: 'latest',
    };
  }
  if (action.type === CHANGE_PAGE) {
    return { ...state, page: action.payload.page };
  }
  if (action.type === GET_CURRENT_USER_BEGIN) {
    return { ...state, userLoading: true, showAlert: false };
  }
  if (action.type === GET_CURRENT_USER_SUCCESS) {
    return {
      ...state,
      userLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
    };
  }

  // ======== PHASE 3: ACTIVITY MANAGEMENT REDUCERS ========

  if (action.type === GET_ACTIVITIES_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === GET_ACTIVITIES_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      activities: action.payload.activities,
      totalActivities: action.payload.totalActivities,
      activitiesNumOfPages: action.payload.activitiesNumOfPages,
    };
  }
  if (action.type === GET_ACTIVITIES_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === CREATE_ACTIVITY_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === CREATE_ACTIVITY_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Activity Created Successfully!',
    };
  }
  if (action.type === CREATE_ACTIVITY_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === UPDATE_ACTIVITY_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === UPDATE_ACTIVITY_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Activity Updated Successfully!',
    };
  }
  if (action.type === UPDATE_ACTIVITY_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === DELETE_ACTIVITY_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === DELETE_ACTIVITY_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Activity Deleted Successfully!',
    };
  }
  if (action.type === DELETE_ACTIVITY_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === MARK_ACTIVITY_COMPLETE_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === MARK_ACTIVITY_COMPLETE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Activity Marked as Complete!',
    };
  }
  if (action.type === MARK_ACTIVITY_COMPLETE_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === GET_TIMELINE_ACTIVITIES_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === GET_TIMELINE_ACTIVITIES_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      timelineActivities: action.payload.timelineActivities,
    };
  }
  if (action.type === GET_TIMELINE_ACTIVITIES_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === HANDLE_ACTIVITY_CHANGE) {
    return {
      ...state,
      activitiesPage: 1, // Reset to first page when filters change
      [action.payload.name]: action.payload.value,
    };
  }

  if (action.type === CLEAR_ACTIVITY_FILTERS) {
    return {
      ...state,
      activityType: 'all',
      activityStatus: 'all',
      activitiesPage: 1,
    };
  }

  if (action.type === SET_SELECTED_JOB_FOR_TIMELINE) {
    return {
      ...state,
      selectedJobForTimeline: action.payload.jobId,
    };
  }

  if (action.type === CHANGE_ACTIVITY_PAGE) {
    return {
      ...state,
      activitiesPage: action.payload.page,
    };
  }

  // ======== ENHANCED ACTIVITY REDUCERS ========

  if (action.type === SET_EDIT_ACTIVITY) {
    const activity = state.activities.find((activity) => activity._id === action.payload.id);
    const {
      _id,
      title,
      type,
      description,
      jobId,
      scheduledDate,
      reminderDate,
      priority,
      contactPerson,
    } = activity;

    // Format dates for input fields
    const formatDateTime = (date) => {
      if (!date) return '';
      return new Date(date).toISOString().slice(0, 16);
    };

    return {
      ...state,
      isEditingActivity: true,
      editActivityId: _id,
      activityTitle: title || '',
      activityType: type || '',
      activityDescription: description || '',
      activityJobId: jobId._id || jobId || '',
      activityScheduledDate: formatDateTime(scheduledDate),
      activityReminderDate: formatDateTime(reminderDate),
      activityPriority: priority || 'medium',
      activityContactName: contactPerson?.name || '',
      activityContactEmail: contactPerson?.email || '',
      activityContactPhone: contactPerson?.phone || '',
      activityContactRole: contactPerson?.role || '',
    };
  }

  if (action.type === CLEAR_ACTIVITY_VALUES) {
    return {
      ...state,
      isEditingActivity: false,
      editActivityId: '',
      activityTitle: '',
      activityType: '',
      activityDescription: '',
      activityJobId: '',
      activityScheduledDate: '',
      activityReminderDate: '',
      activityPriority: 'medium',
      activityContactName: '',
      activityContactEmail: '',
      activityContactPhone: '',
      activityContactRole: '',
    };
  }

  if (action.type === SEARCH_ACTIVITIES_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === SEARCH_ACTIVITIES_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      activities: action.payload.activities,
      totalActivities: action.payload.totalActivities,
      activitiesNumOfPages: action.payload.activitiesNumOfPages,
    };
  }

  if (action.type === GET_ACTIVITY_DETAILS_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === GET_ACTIVITY_DETAILS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
    };
  }

  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
