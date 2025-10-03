// React Router imports for client-side navigation
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public pages (accessible without authentication)
import { Register, Landing, Error, ProtectedRoute } from './pages'

// Dashboard pages (protected - require authentication)
import {
  AllJobs,      // Job listing and management page
  Profile,      // User profile and settings page
  SharedLayout, // Common layout for all dashboard pages
  Stats,        // Analytics and statistics dashboard
  AddJob,       // Job creation and editing form
  Activities,   // Activity management page (Phase 3)
  Timeline,     // Timeline view page (Phase 3)
} from './pages/dashboard'

/**
 * =======================================
 * MAIN APPLICATION COMPONENT
 * =======================================
 *
 * This is the root component of the JobTrack4U application.
 * It sets up the routing structure using React Router and defines
 * the application's navigation hierarchy.
 *
 * ROUTING ARCHITECTURE:
 *
 * 1. PUBLIC ROUTES (No authentication required):
 *    - /landing - Marketing/welcome page
 *    - /register - User registration and login
 *    - /* (404) - Error page for invalid routes
 *
 * 2. PROTECTED ROUTES (Authentication required):
 *    - / - Dashboard home (Stats page)
 *    - /all-jobs - Job listings with search and filtering
 *    - /add-job - Create new job or edit existing job
 *    - /profile - User account management
 *
 * PROTECTION MECHANISM:
 * - All dashboard routes are wrapped in <ProtectedRoute>
 * - ProtectedRoute checks authentication status before rendering
 * - Unauthenticated users are redirected to registration
 *
 * NESTED ROUTING:
 * - Dashboard routes use SharedLayout as parent component
 * - SharedLayout provides common UI elements (navbar, sidebar)
 * - Child routes render in SharedLayout's <Outlet />
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*
          PROTECTED DASHBOARD ROUTES

          These routes require user authentication and share a common layout.
          The SharedLayout component provides:
          - Navigation sidebar with quick access to all dashboard features
          - Top navigation bar with user info and logout
          - Responsive design for mobile and desktop
          - Consistent styling across all dashboard pages
        */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          {/*
            DEFAULT DASHBOARD PAGE (/)
            Shows statistics and overview of user's job applications
          */}
          <Route index element={<Stats />} />

          {/*
            ALL JOBS PAGE (/all-jobs)
            Displays paginated list of all job applications with:
            - Search functionality (by company/position)
            - Filtering (by status, type, category, priority)
            - Sorting options (date, alphabetical)
            - Individual job cards with quick actions (edit/delete)
          */}
          <Route path='all-jobs' element={<AllJobs />} />

          {/*
            ADD/EDIT JOB PAGE (/add-job)
            Comprehensive form for creating new jobs or editing existing ones.
            Features include:
            - Basic job info (company, position, location, type, status)
            - Enhanced fields (salary range, application dates, URLs)
            - Categorization (job category, custom tags, priority)
            - Rich text areas for job description and personal notes
          */}
          <Route path='add-job' element={<AddJob />} />

          {/*
            ACTIVITIES PAGE (/activities) - Phase 3
            Activity management interface with:
            - List of all activities across jobs
            - Filter by activity type and completion status
            - Mark activities as complete
            - Create, edit, and delete activities
          */}
          <Route path='activities' element={<Activities />} />

          {/*
            TIMELINE PAGE (/timeline) - Phase 3
            Chronological timeline view featuring:
            - Visual timeline of all activities
            - Filter by specific job or view all
            - Activity type indicators and priority levels
            - Upcoming activity highlights
          */}
          <Route path='timeline' element={<Timeline />} />

          {/*
            USER PROFILE PAGE (/profile)
            User account management including:
            - Personal information updates
            - Password changes
            - Account preferences
            - Data export/import options
          */}
          <Route path='profile' element={<Profile />} />
        </Route>

        {/*
          PUBLIC ROUTES

          These routes are accessible without authentication and handle
          user onboarding, marketing, and error scenarios.
        */}

        {/*
          REGISTRATION/LOGIN PAGE (/register)
          Dual-purpose page that handles both user registration and login.
          Features:
          - Toggle between register and login modes
          - Form validation and error handling
          - Automatic redirect to dashboard after successful auth
          - Responsive design with modern UI components
        */}
        <Route path='/register' element={<Register />} />

        {/*
          LANDING PAGE (/landing)
          Marketing page for the application featuring:
          - Product overview and value proposition
          - Feature highlights and benefits
          - Call-to-action to register/login
          - Responsive marketing design
        */}
        <Route path='/landing' element={<Landing />} />

        {/*
          404 ERROR PAGE (catch-all route)
          Handles all invalid URLs and provides user-friendly error messaging
          with navigation back to valid pages.
        */}
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
