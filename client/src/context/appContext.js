// React imports for context and state management
import React, { useReducer, useContext, useEffect } from 'react';

// Local imports for state management
import reducer from './reducer';
import axios from 'axios';

// Action type constants for the reducer
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
  MARK_ACTIVITY_INCOMPLETE_BEGIN,
  MARK_ACTIVITY_INCOMPLETE_SUCCESS,
  MARK_ACTIVITY_INCOMPLETE_ERROR,
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

/**
 * INITIAL APPLICATION STATE
 */
const initialState = {
  // ======== USER AUTHENTICATION & LOADING ========
  userLoading: true,
  isLoading: false,
  user: null,
  userLocation: '',

  // ======== UI STATE MANAGEMENT ========
  showAlert: false,
  alertText: '',
  alertType: '',
  showSidebar: false,

  // ======== JOB FORM STATE (Create/Edit) ========
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: '',
  jobType: 'full-time',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  status: 'pending',
  statusOptions: ['interview', 'declined', 'pending'],

  // ======== ENHANCED FIELDS (Phase 1) ========
  applicationDate: '',
  applicationDeadline: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  jobDescription: '',
  companyWebsite: '',
  jobPostingUrl: '',
  applicationMethod: 'website',
  applicationMethodOptions: ['email', 'website', 'linkedin', 'recruiter', 'other'],
  notes: '',

  // ======== PHASE 2: CATEGORIZATION & TAGGING ========
  category: 'other',
  categoryOptions: [
    'software-engineering',
    'data-science',
    'product-management',
    'design',
    'marketing',
    'sales',
    'operations',
    'finance',
    'hr',
    'consulting',
    'other'
  ],
  tags: '',
  priority: 'medium',
  priorityOptions: ['low', 'medium', 'high'],

  // ======== JOB LISTING & SEARCH STATE ========
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,

  // ======== SEARCH & FILTERING STATE ========
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
  searchCategory: 'all',
  searchPriority: 'all',

  // ======== STATISTICS & ANALYTICS ========
  stats: {},
  monthlyApplications: [],

  // ======== PHASE 3: ACTIVITY MANAGEMENT STATE ========
  activities: [],
  timelineActivities: [],
  totalActivities: 0,
  activitiesPage: 1,
  activitiesNumOfPages: 1,
  activityType: 'all',
  activityStatus: 'all',
  selectedJobForTimeline: '',
  upcomingActivities: [],

  // Activity Search
  activitySearch: '',

  // Activity Form State
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

/**
 * REACT CONTEXT CREATION
 */
const AppContext = React.createContext();

/**
 * APPLICATION PROVIDER COMPONENT
 */
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Create axios instance with base URL for all API calls
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  // Response interceptor for automatic authentication handling
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  // ======== ALERT SYSTEM FUNCTIONS ========
  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  // ======== USER AUTHENTICATION FUNCTIONS ========
  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, location } = data;

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    dispatch({ type: LOGOUT_USER });
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  // ======== FORM HANDLING FUNCTIONS ========
  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  // ======== JOB MANAGEMENT FUNCTIONS ========
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const {
        position,
        company,
        jobLocation,
        jobType,
        status,
        applicationDate,
        applicationDeadline,
        salaryMin,
        salaryMax,
        salaryCurrency,
        jobDescription,
        companyWebsite,
        jobPostingUrl,
        applicationMethod,
        notes,
        category,
        tags,
        priority
      } = state;

      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status,
        applicationDate,
        applicationDeadline,
        salary: {
          min: salaryMin,
          max: salaryMax,
          currency: salaryCurrency
        },
        jobDescription,
        companyWebsite,
        jobPostingUrl,
        applicationMethod,
        notes,
        category,
        tags: tagsArray,
        priority
      });

      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort, searchCategory, searchPriority } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

    if (search) {
      url = url + `&search=${search}`;
    }
    if (searchCategory && searchCategory !== 'all') {
      url = url + `&category=${searchCategory}`;
    }
    if (searchPriority && searchPriority !== 'all') {
      url = url + `&priority=${searchPriority}`;
    }

    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;

      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });

    try {
      const {
        position,
        company,
        jobLocation,
        jobType,
        status,
        applicationDate,
        applicationDeadline,
        salaryMin,
        salaryMax,
        salaryCurrency,
        jobDescription,
        companyWebsite,
        jobPostingUrl,
        applicationMethod,
        notes,
        category,
        tags,
        priority
      } = state;

      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
        applicationDate,
        applicationDeadline,
        salary: {
          min: salaryMin,
          max: salaryMax,
          currency: salaryCurrency
        },
        jobDescription,
        companyWebsite,
        jobPostingUrl,
        applicationMethod,
        notes,
        category,
        tags: tagsArray,
        priority
      });

      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // ======== STATISTICS & ANALYTICS ========
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  // ======== SEARCH & FILTERING FUNCTIONS ========
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  // ======== PHASE 3: ACTIVITY MANAGEMENT FUNCTIONS ========

  /**
   * Get all activities for the user with optional filtering
   */
  const getActivities = async (jobId = null) => {
    dispatch({ type: GET_ACTIVITIES_BEGIN });
    try {
      const { activitiesPage, activityType, activityStatus } = state;

      let url = `/activities?page=${activitiesPage}&limit=20`;

      if (jobId) {
        url += `&jobId=${jobId}`;
      }
      if (activityType && activityType !== 'all') {
        url += `&type=${activityType}`;
      }
      if (activityStatus && activityStatus !== 'all') {
        url += `&isCompleted=${activityStatus === 'completed'}`;
      }

      const { data } = await authFetch(url);

      dispatch({
        type: GET_ACTIVITIES_SUCCESS,
        payload: {
          activities: data.activities,
          totalActivities: data.totalActivities,
          activitiesNumOfPages: data.numOfPages,
        },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: GET_ACTIVITIES_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  /**
   * Get timeline activities for visualization
   */
  const getTimelineActivities = async (jobId = null) => {
    dispatch({ type: GET_TIMELINE_ACTIVITIES_BEGIN });
    try {
      let url = jobId ? `/activities/job/${jobId}/timeline` : '/activities?limit=100&sort=createdAt';

      const { data } = await authFetch(url);

      dispatch({
        type: GET_TIMELINE_ACTIVITIES_SUCCESS,
        payload: {
          timelineActivities: jobId ? data.activities : data.activities,
        },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: GET_TIMELINE_ACTIVITIES_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  /**
   * Create new activity
   */
  const createActivity = async (activityData) => {
    dispatch({ type: CREATE_ACTIVITY_BEGIN });
    try {
      const { data } = await authFetch.post('/activities', activityData);

      dispatch({
        type: CREATE_ACTIVITY_SUCCESS,
        payload: { activity: data.activity },
      });

      // Refresh activities list
      getActivities();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_ACTIVITY_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  /**
   * Mark activity as complete
   */
  const markActivityComplete = async (activityId) => {
    dispatch({ type: MARK_ACTIVITY_COMPLETE_BEGIN });
    try {
      await authFetch.patch(`/activities/${activityId}/complete`);

      dispatch({
        type: MARK_ACTIVITY_COMPLETE_SUCCESS,
      });

      // Reset filter to 'all' to ensure completed activity remains visible
      dispatch({
        type: HANDLE_ACTIVITY_CHANGE,
        payload: { name: 'activityStatus', value: 'all' }
      });

      // Refresh activities list
      getActivities();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: MARK_ACTIVITY_COMPLETE_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  /**
   * Mark activity as incomplete (pending)
   */
  const markActivityIncomplete = async (activityId) => {
    dispatch({ type: MARK_ACTIVITY_INCOMPLETE_BEGIN });
    try {
      await authFetch.patch(`/activities/${activityId}/incomplete`);

      dispatch({
        type: MARK_ACTIVITY_INCOMPLETE_SUCCESS,
      });

      // Reset filter to 'all' to ensure activity remains visible
      dispatch({
        type: HANDLE_ACTIVITY_CHANGE,
        payload: { name: 'activityStatus', value: 'all' }
      });

      // Refresh activities list
      getActivities();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: MARK_ACTIVITY_INCOMPLETE_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  /**
   * Delete activity
   */
  const deleteActivity = async (activityId) => {
    dispatch({ type: DELETE_ACTIVITY_BEGIN });
    try {
      await authFetch.delete(`/activities/${activityId}`);

      dispatch({
        type: DELETE_ACTIVITY_SUCCESS,
      });

      // Refresh activities list
      getActivities();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_ACTIVITY_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  /**
   * Handle activity-related form changes
   */
  const handleActivityChange = ({ name, value }) => {
    dispatch({ type: HANDLE_ACTIVITY_CHANGE, payload: { name, value } });
  };

  /**
   * Clear activity filters
   */
  const clearActivityFilters = () => {
    dispatch({ type: CLEAR_ACTIVITY_FILTERS });
  };

  /**
   * Set selected job for timeline view
   */
  const setSelectedJobForTimeline = (jobId) => {
    dispatch({ type: SET_SELECTED_JOB_FOR_TIMELINE, payload: { jobId } });
  };

  // ======== ENHANCED ACTIVITY MANAGEMENT FUNCTIONS ========

  /**
   * Update existing activity
   */
  const updateActivity = async (activityId, activityData) => {
    dispatch({ type: UPDATE_ACTIVITY_BEGIN });
    try {
      const { data } = await authFetch.patch(`/activities/${activityId}`, activityData);

      dispatch({
        type: UPDATE_ACTIVITY_SUCCESS,
        payload: { activity: data.activity },
      });

      // Refresh activities list and clear form
      getActivities();
      clearActivityValues();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: UPDATE_ACTIVITY_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  /**
   * Set activity for editing
   */
  const setEditActivity = (id) => {
    dispatch({ type: SET_EDIT_ACTIVITY, payload: { id } });
  };

  /**
   * Clear activity form values
   */
  const clearActivityValues = () => {
    dispatch({ type: CLEAR_ACTIVITY_VALUES });
  };

  /**
   * Get single activity details
   */
  const getActivityDetails = async (activityId) => {
    dispatch({ type: GET_ACTIVITY_DETAILS_BEGIN });
    try {
      const { data } = await authFetch(`/activities/${activityId}`);

      dispatch({
        type: GET_ACTIVITY_DETAILS_SUCCESS,
        payload: { activity: data.activity },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      // Handle error silently or show notification
    }
    clearAlert();
  };

  /**
   * Search activities by text
   */
  const searchActivities = async (searchTerm) => {
    dispatch({ type: SEARCH_ACTIVITIES_BEGIN });
    try {
      const { activitiesPage, activityType, activityStatus } = state;

      let url = `/activities?page=${activitiesPage}&limit=20`;

      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      if (activityType && activityType !== 'all') {
        url += `&type=${activityType}`;
      }
      if (activityStatus && activityStatus !== 'all') {
        url += `&isCompleted=${activityStatus === 'completed'}`;
      }

      const { data } = await authFetch(url);

      dispatch({
        type: SEARCH_ACTIVITIES_SUCCESS,
        payload: {
          activities: data.activities,
          totalActivities: data.totalActivities,
          activitiesNumOfPages: data.numOfPages,
        },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      // Handle error silently
    }
    clearAlert();
  };

  /**
   * Change activity page for pagination
   */
  const changeActivityPage = (page) => {
    dispatch({ type: CHANGE_ACTIVITY_PAGE, payload: { page } });
  };

  // ======== USER INITIALIZATION =
  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      logoutUser();
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // ======== CONTEXT PROVIDER RENDER ========
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
        // Phase 3: Activity Management Functions
        getActivities,
        getTimelineActivities,
        createActivity,
        markActivityComplete,
        markActivityIncomplete,
        deleteActivity,
        handleActivityChange,
        clearActivityFilters,
        setSelectedJobForTimeline,
        // Enhanced Activity Functions
        updateActivity,
        setEditActivity,
        clearActivityValues,
        getActivityDetails,
        searchActivities,
        changeActivityPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * CUSTOM HOOK FOR CONTEXT ACCESS
 */
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
