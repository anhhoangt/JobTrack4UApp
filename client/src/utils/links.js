import { IoBarChartSharp } from 'react-icons/io5'
import { MdQueryStats, MdTimeline } from 'react-icons/md'
import { FaWpforms, FaTasks } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'

/**
 * NAVIGATION LINKS CONFIGURATION
 *
 * This array defines all the navigation links for the dashboard sidebar.
 * Each link represents a major feature/page in the application.
 *
 * Phase 1: Basic job tracking (stats, jobs, add job, profile)
 * Phase 3: Added activity management (activities, timeline)
 */
const links = [
  { id: 1, text: 'stats', path: '/', icon: <IoBarChartSharp /> },
  { id: 2, text: 'all jobs', path: 'all-jobs', icon: <MdQueryStats /> },
  { id: 3, text: 'add job', path: 'add-job', icon: <FaWpforms /> },
  // Phase 3: Activity Management Links
  { id: 4, text: 'activities', path: 'activities', icon: <FaTasks /> },
  { id: 5, text: 'timeline', path: 'timeline', icon: <MdTimeline /> },
  { id: 6, text: 'profile', path: 'profile', icon: <ImProfile /> },
]

export default links
