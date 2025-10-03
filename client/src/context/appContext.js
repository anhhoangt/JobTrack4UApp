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
} from './actions';

/**
 * =====================================================
 * GLOBAL APPLICATION STATE MANAGEMENT
 * =====================================================
 *
 * This file implements the main state management system for the JobTrack4U application
 * using React Context API with useReducer hook. It provides centralized state management
 * for user authentication, job data, UI state, and application settings.
 *
 * ARCHITECTURE PATTERN:
 * - Context API for global state distribution
 * - useReducer for predictable state updates
 * - Custom hooks for easy state access
 * - Axios interceptors for automatic authentication handling
 *
 * STATE ORGANIZATION:
 * 1. User Authentication & Profile
 * 2. UI State (loading, alerts, sidebar)
 * 3. Job Form Data (create/edit job forms)
 * 4. Job List Data (search, filter, pagination)
 * 5. Application Statistics
 */

/**
 * INITIAL APPLICATION STATE
 *
 * This object defines the default state structure for the entire application.
 * It's organized into logical sections for better maintainability:
 */
const initialState = {
  // ======== USER AUTHENTICATION & LOADING ========

  /**
   * Controls the initial app loading state while checking authentication
   * Prevents flash of login screen for authenticated users
   */
  userLoading: true,

  /**
   * General loading state for async operations
   * Used throughout the app for showing loading indicators
   */
  isLoading: false,

  /**
   * Currently authenticated user object
   * Contains user profile information and authentication status
   */
  user: null,

  /**
   * User's default location for job applications
   * Used as default value in job location field
   */
  userLocation: '',

  // ======== UI STATE MANAGEMENT ========

  /**
   * Controls whether alert messages are displayed
   * Works with alertText and alertType for user feedback
   */
  showAlert: false,

  /**
   * Text content of alert messages
   * Displays success, error, or informational messages to users
   */
  alertText: '',

  /**
   * Type of alert for styling purposes
   * Values: 'success', 'error', 'danger' for different color schemes
   */
  alertType: '',

  /**
   * Mobile sidebar visibility state
   * Controls responsive navigation drawer on mobile devices
   */
  showSidebar: false,

  // ======== JOB FORM STATE (Create/Edit) ========

  /**
   * Form editing mode flag
   * true = editing existing job, false = creating new job
   */
  isEditing: false,

  /**
   * ID of the job being edited
   * Used to identify which job to update when in edit mode
   */
  editJobId: '',

  // Basic Job Information Fields
  position: '',              // Job title/position name
  company: '',               // Company name
  jobLocation: '',           // Job location (city, state, remote, etc.)

  /**
   * Job type with predefined options
   * Helps categorize jobs by employment type
   */
  jobType: 'full-time',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],

  /**
   * Application status with predefined options
   * Tracks progress through the application process
   */
  status: 'pending',
  statusOptions: ['interview', 'declined', 'pending'],

  // ======== ENHANCED FIELDS (Phase 1) ========

  /**
   * Application and deadline dates
   * Helps users track timing of their applications
   */
  applicationDate: '',       // When application was submitted
  applicationDeadline: '',   // Application deadline (if any)

  /**
   * Salary range tracking
   * Allows users to track compensation expectations
   */
  salaryMin: '',            // Minimum salary offered
  salaryMax: '',            // Maximum salary offered
  salaryCurrency: 'USD',    // Currency for salary values

  /**
   * Additional job details for comprehensive tracking
   */
  jobDescription: '',        // Detailed job description
  companyWebsite: '',        // Company's official website
  jobPostingUrl: '',         // Direct link to job posting
  notes: '',                 // Personal notes about the job

  /**
   * Application method tracking
   * Helps identify most effective application channels
   */
  applicationMethod: 'website',
  applicationMethodOptions: ['email', 'website', 'linkedin', 'recruiter', 'other'],

  // ======== PHASE 2: CATEGORIZATION & TAGGING ========

  /**
   * Job category classification system
   * Helps organize jobs by industry or function
   */
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

  /**
   * Custom tags for flexible job categorization
   * Comma-separated string that gets converted to array on submission
   */
  tags: '',

  /**
   * Priority level for job applications
   * Helps users focus on most important opportunities
   */
  priority: 'medium',
  priorityOptions: ['low', 'medium', 'high'],

  // ======== JOB LISTING & SEARCH STATE ========

  /**
   * Array of job objects retrieved from the API
   * Populated by getJobs() function with paginated results
   */
  jobs: [],

  /**
   * Total number of jobs in the database (for pagination)
   * Used to calculate pagination controls
   */
  totalJobs: 0,

  /**
   * Total number of pages available (for pagination)
   * Calculated by backend based on limit and total jobs
   */
  numOfPages: 1,

  /**
   * Current page number for pagination
   * Used in API requests to fetch specific page of results
   */
  page: 1,

  // ======== SEARCH & FILTERING STATE ========

  /**
   * Text search query for job positions and companies
   * Enables users to search through their job applications
   */
  search: '',

  /**
   * Status filter for job list
   * Allows filtering jobs by application status
   */
  searchStatus: 'all',

  /**
   * Job type filter for job list
   * Allows filtering jobs by employment type
   */
  searchType: 'all',

  /**
   * Sorting options for job list
   * Controls how jobs are ordered in the list view
   */
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],

  // Phase 2: Advanced Search Filters
  searchCategory: 'all',     // Filter by job category
  searchPriority: 'all',     // Filter by priority level

  // ======== STATISTICS & ANALYTICS ========

  /**
   * Application statistics object
   * Contains counts of jobs by status (pending, interview, declined)
   */
  stats: {},

  /**
   * Monthly application data for charts
   * Array of objects with month and application count data
   */
  monthlyApplications: [],
};

/**
 * REACT CONTEXT CREATION
 *
 * Creates the context that will provide state and actions to all components
 * that are wrapped with the AppProvider
 */
const AppContext = React.createContext();

/**
 * =====================================================
 * APPLICATION PROVIDER COMPONENT
 * =====================================================
 *
 * This component wraps the entire application and provides global state
 * management through React Context. It contains all the business logic
 * for API calls, state updates, and user interactions.
 */
const AppProvider = ({ children }) => {
  // Initialize state management with useReducer hook
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * ======== AXIOS CONFIGURATION & INTERCEPTORS ========
   *
   * Configure axios instance with automatic authentication handling
   * and error interception for better user experience
   */

  // Create axios instance with base URL for all API calls
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  /**
   * Response interceptor for automatic authentication handling
   *
   * This interceptor automatically handles authentication errors:
   * - Allows successful responses to pass through
   * - Detects 401 (Unauthorized) responses and logs user out
   * - Prevents need for manual authentication checks in every component
   */
  authFetch.interceptors.response.use(
    (response) => {
      // Allow successful responses to pass through unchanged
      return response;
    },
    (error) => {
      // Handle authentication errors globally
      if (error.response.status === 401) {
        // Automatically log out user if token is invalid/expired
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  /**
   * ======== ALERT SYSTEM FUNCTIONS ========
   *
   * Functions for managing user feedback through alert messages
   */

  /**
   * Display alert message to user
   *
   * Triggers alert display and automatically clears it after 3 seconds
   * Used for form validation errors and general user feedback
   */
  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  /**
   * Clear alert message with delay
   *
   * Automatically hides alert messages after 3 seconds
   * Provides good UX by not requiring manual dismissal
   */
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  /**
   * ======== USER AUTHENTICATION FUNCTIONS ========
   *
   * Functions for handling user registration, login, and profile management
   */

  /**
   * Universal user setup function (Register/Login)
   *
   * Handles both user registration and login with the same function
   * by using different endpoints based on the endPoint parameter
   *
   * @param {Object} currentUser - User credentials (name, email, password)
   * @param {String} endPoint - API endpoint ('register' or 'login')
   * @param {String} alertText - Success message to display
   */
  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      // Make API call to register or login endpoint
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, location } = data;

      // Update state with user data and success message
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      // Handle registration/login errors
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  /**
   * Toggle mobile sidebar visibility
   *
   * Handles responsive navigation by showing/hiding sidebar on mobile devices
   */
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  /**
   * User logout function
   *
   * Clears user session on both client and server
   * Redirects to login page by clearing user state
   */
  const logoutUser = async () => {
    // Notify server to clear session/token
    await authFetch.get('/auth/logout');

    // Clear client-side user state
    dispatch({ type: LOGOUT_USER });
  };

  /**
   * Update user profile information
   *
   * Allows users to modify their profile data (name, email, location)
   * Updates both server data and local state
   *
   * @param {Object} currentUser - Updated user data
   */
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

  /**
   * ======== FORM HANDLING FUNCTIONS ========
   *
   * Functions for managing form state and user input
   */

  /**
   * Universal form input handler
   *
   * Updates any field in the global state based on input name and value
   * Used by all form inputs throughout the application
   *
   * @param {Object} payload - Contains name (field name) and value (new value)
   */
  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  /**
   * Clear job form values
   *
   * Resets all job form fields to their default values
   * Used after successful job creation/update or when user cancels form
   */
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  /**
   * ======== JOB MANAGEMENT FUNCTIONS ========
   *
   * Functions for CRUD operations on job applications
   */

  /**
   * Create new job application
   *
   * Submits new job data to the server and handles the response
   * Processes tags from comma-separated string to array format
   * Clears form on success and shows appropriate feedback
   */
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      // Extract all job data from current state
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

      // Process tags from comma-separated string to array
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      // Submit job data to API
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

  /**
   * Fetch jobs with filtering and pagination
   *
   * Retrieves jobs from the server based on current search/filter state
   * Builds dynamic URL with query parameters for:
   * - Pagination (page number)
   * - Search (text search in position/company)
   * - Filtering (status, job type, category, priority)
   * - Sorting (date, alphabetical)
   */
  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort, searchCategory, searchPriority } = state;

    // Build base URL with pagination and basic filters
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

    // Add optional search parameter
    if (search) {
      url = url + `&search=${search}`;
    }

    // Add Phase 2 filters if specified
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
      // If jobs fetch fails, likely authentication issue
      logoutUser();
    }
    clearAlert();
  };

  /**
   * Set job for editing
   *
   * Prepares the form for editing an existing job by:
   * - Setting edit mode flag
   * - Populating form fields with existing job data
   * - Setting the job ID for the update operation
   *
   * @param {String} id - ID of the job to edit
   */
  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  /**
   * Update existing job application
   *
   * Similar to createJob but updates existing job instead of creating new one
   * Uses editJobId from state to identify which job to update
   */
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });

    try {
      // Extract all job data from current state
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

      // Process tags from comma-separated string to array
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      // Update job via API
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

  /**
   * Delete job application
   *
   * Removes job from the database and refreshes the job list
   *
   * @param {String} jobId - ID of the job to delete
   */
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);

      // Refresh job list after successful deletion
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

  /**
   * ======== STATISTICS & ANALYTICS ========
   */

  /**
   * Fetch application statistics
   *
   * Retrieves analytics data for the dashboard including:
   * - Job counts by status (pending, interview, declined)
   * - Monthly application trends for charts
   */
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

  /**
   * ======== SEARCH & FILTERING FUNCTIONS ========
   */

  /**
   * Clear all search filters
   *
   * Resets search, filter, and sort options to default values
   * Useful for "Show All Jobs" functionality
   */
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  /**
   * Change current page for pagination
   *
   * Updates the current page number and triggers job list refresh
   *
   * @param {Number} page - New page number to navigate to
   */
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  /**
   * ======== USER INITIALIZATION ========
   */

  /**
   * Get current user information
   *
   * Checks if user is authenticated and retrieves their profile data
   * Called automatically when app loads to restore user session
   */
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

  /**
   * Initialize user session on app load
   *
   * Automatically check if user is authenticated when app starts
   * This enables persistent login sessions across browser refreshes
   */
  useEffect(() => {
    getCurrentUser();
  }, []);

  /**
   * ======== CONTEXT PROVIDER RENDER ========
   *
   * Provides all state values and functions to child components
   * Any component wrapped by AppProvider can access this data
   */
  return (
    <AppContext.Provider
      value={{
        // Spread entire state object to provide all state values
        ...state,

        // Provide all action functions for components to use
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * ======== CUSTOM HOOK FOR CONTEXT ACCESS ========
 *
 * Custom hook that provides easy access to the app context
 * Components can use this hook instead of useContext(AppContext)
 *
 * Usage: const { user, createJob, handleChange } = useAppContext();
 */
const useAppContext = () => {
  return useContext(AppContext);
};

// Export the provider, initial state, and custom hook
export { AppProvider, initialState, useAppContext };
