import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/appContext';
import { Loading, Alert } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import '../../assets/css/activities.css';
import {
  FaPaperPlane,
  FaEnvelope,
  FaPhone,
  FaCalendarCheck,
  FaCheckCircle,
  FaHandshake,
  FaTimesCircle,
  FaStickyNote,
  FaEllipsisH,
} from 'react-icons/fa';

/**
 * =====================================================
 * TIMELINE PAGE (Phase 3)
 * =====================================================
 *
 * Visual timeline display of all job application activities.
 * Provides chronological view with date grouping and job filtering.
 *
 * Features:
 * - View all activities or filter by specific job
 * - Chronological display with date grouping (Today, Yesterday, etc.)
 * - Visual activity type icons and color coding
 * - Quick access to activity details
 * - Upcoming activities highlight
 */

const Timeline = () => {
  const {
    isLoading,
    showAlert,
    jobs,
    timelineActivities,
    getTimelineActivities,
    getJobs,
  } = useAppContext();

  const [selectedJob, setSelectedJob] = useState('');
  const [viewMode, setViewMode] = useState('all');

  // Fetch jobs list on component mount (needed for job selector dropdown)
  useEffect(() => {
    getJobs();
  }, []);

  // Fetch timeline activities whenever view mode or selected job changes
  useEffect(() => {
    if (viewMode === 'all') {
      // Fetch all activities across all jobs
      getTimelineActivities();
    } else if (viewMode === 'job-specific' && selectedJob) {
      // Fetch activities only for the selected job
      getTimelineActivities(selectedJob);
    }
  }, [viewMode, selectedJob]);

  /**
   * GROUP ACTIVITIES BY DATE
   *
   * Takes activities array and groups them into categories like:
   * "Today", "Yesterday", "This Week", etc.
   *
   * Why: Makes the timeline more readable and organized
   */
  const groupActivitiesByDate = (activities) => {
    if (!activities || activities.length === 0) return {};

    const groups = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    activities.forEach((activity) => {
      const activityDate = new Date(activity.createdAt);
      const activityDay = new Date(
        activityDate.getFullYear(),
        activityDate.getMonth(),
        activityDate.getDate()
      );

      let groupKey;

      // Calculate difference in days
      const diffTime = today - activityDay;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        groupKey = 'Today';
      } else if (diffDays === 1) {
        groupKey = 'Yesterday';
      } else if (diffDays <= 7) {
        groupKey = 'This Week';
      } else if (diffDays <= 14) {
        groupKey = 'Last Week';
      } else if (diffDays <= 30) {
        groupKey = 'This Month';
      } else {
        // Format as "Month Year" for older activities
        groupKey = activityDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });

    return groups;
  };

  /**
   * FORMAT TIME FOR DISPLAY
   *
   * Shows relative time like "2 hours ago" or absolute time
   *
   * Why: Helps users quickly understand when activities happened
   */
  const formatActivityTime = (date) => {
    const activityDate = new Date(date);
    const now = new Date();
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday at ' + activityDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else {
      return activityDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: activityDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  /**
   * GET ICON FOR ACTIVITY TYPE
   *
   * Returns the appropriate icon component based on activity type
   *
   * Why: Visual consistency and quick recognition of activity types
   */
  const getActivityIcon = (type) => {
    const iconMap = {
      'application-sent': <FaPaperPlane />,
      'email-sent': <FaEnvelope />,
      'email-received': <FaEnvelope />,
      'phone-call-made': <FaPhone />,
      'phone-call-received': <FaPhone />,
      'interview-scheduled': <FaCalendarCheck />,
      'interview-completed': <FaCheckCircle />,
      'follow-up-sent': <FaEnvelope />,
      'offer-received': <FaHandshake />,
      'rejection-received': <FaTimesCircle />,
      'note-added': <FaStickyNote />,
      'other': <FaEllipsisH />,
    };
    return iconMap[type] || <FaEllipsisH />;
  };

  /**
   * GET COLOR FOR ACTIVITY TYPE
   *
   * Returns color coding for visual differentiation
   *
   * Why: Color helps users quickly identify activity categories
   */
  const getActivityColor = (type) => {
    const colorMap = {
      'application-sent': '#3b82f6', // Blue - informational
      'email-sent': '#8b5cf6', // Purple - communication
      'email-received': '#8b5cf6',
      'phone-call-made': '#06b6d4', // Cyan - communication
      'phone-call-received': '#06b6d4',
      'interview-scheduled': '#f59e0b', // Orange - important upcoming
      'interview-completed': '#10b981', // Green - positive progress
      'follow-up-sent': '#8b5cf6',
      'offer-received': '#22c55e', // Bright green - success!
      'rejection-received': '#ef4444', // Red - negative
      'note-added': '#6b7280', // Gray - neutral
      'other': '#6b7280',
    };
    return colorMap[type] || '#6b7280';
  };

  /**
   * FORMAT ACTIVITY TYPE FOR DISPLAY
   *
   * Converts kebab-case to Title Case
   */
  const formatActivityType = (type) => {
    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Group the activities by date for timeline display
  const groupedActivities = groupActivitiesByDate(timelineActivities);

  if (isLoading && !timelineActivities?.length) {
    return <Loading center />;
  }

  return (
    <Wrapper>
      <div className='timeline-page'>
        {/* Header with view mode toggle */}
        <header className='timeline-header'>
          <h3>Activity Timeline</h3>
          {showAlert && <Alert />}

          {/* View Mode Toggle: All Activities vs By Job */}
          <div className='form-center' style={{ marginTop: '1.5rem' }}>
            <div className='view-mode-toggle' style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                type='button'
                className={`btn ${viewMode === 'all' ? '' : 'btn-outline'}`}
                onClick={() => {
                  setViewMode('all');
                  setSelectedJob('');
                }}
                style={{
                  background: viewMode === 'all' ? 'var(--primary-500)' : 'transparent',
                  color: viewMode === 'all' ? 'var(--white)' : 'var(--primary-500)',
                  border: '2px solid var(--primary-500)',
                }}
              >
                All Activities
              </button>
              <button
                type='button'
                className={`btn ${viewMode === 'job-specific' ? '' : 'btn-outline'}`}
                onClick={() => setViewMode('job-specific')}
                style={{
                  background: viewMode === 'job-specific' ? 'var(--primary-500)' : 'transparent',
                  color: viewMode === 'job-specific' ? 'var(--white)' : 'var(--primary-500)',
                  border: '2px solid var(--primary-500)',
                }}
              >
                By Job
              </button>
            </div>

            {/* Job Selector - only shown when "By Job" mode is selected */}
            {viewMode === 'job-specific' && (
              <div className='form-row'>
                <label htmlFor='jobSelect' className='form-label'>
                  Select Job:
                </label>
                <select
                  id='jobSelect'
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className='form-select'
                >
                  <option value=''>Select a job to view its timeline...</option>
                  {jobs?.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.position} at {job.company}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>

        {/* Timeline Content */}
        <div className='timeline-container' style={{ marginTop: '2rem' }}>
          {/* Empty State - No activities exist */}
          {!timelineActivities || timelineActivities.length === 0 ? (
            <div className='no-activities' style={{ textAlign: 'center', padding: '3rem', background: 'var(--background-secondary-color)', borderRadius: 'var(--border-radius)' }}>
              <h4>No activities found</h4>
              {viewMode === 'job-specific' && !selectedJob ? (
                <p>Please select a job to view its activity timeline</p>
              ) : (
                <p>Start tracking your job search by creating activities!</p>
              )}
            </div>
          ) : (
            /* Render Timeline Groups */
            Object.keys(groupedActivities).map((dateGroup) => (
              <div key={dateGroup} className='timeline-group' style={{ marginBottom: '2.5rem' }}>
                {/* Date Group Header */}
                <h4 className='timeline-date-header' style={{
                  color: 'var(--primary-600)',
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid var(--primary-200)',
                }}>
                  {dateGroup}
                </h4>

                {/* Activities in this date group */}
                <div className='timeline-items'>
                  {groupedActivities[dateGroup].map((activity) => (
                    <div
                      key={activity._id}
                      className='timeline-item'
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        background: 'var(--white)',
                        borderRadius: 'var(--border-radius)',
                        boxShadow: 'var(--shadow-2)',
                        borderLeft: `4px solid ${getActivityColor(activity.type)}`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Activity Icon */}
                      <div
                        className='timeline-icon'
                        style={{
                          minWidth: '48px',
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: getActivityColor(activity.type),
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          flexShrink: 0,
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      {/* Activity Content */}
                      <div className='timeline-content' style={{ flex: 1 }}>
                        {/* Activity Type and Priority */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: getActivityColor(activity.type),
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>
                            {formatActivityType(activity.type)}
                          </span>
                          {activity.priority && (
                            <span
                              className={`priority-badge priority-${activity.priority}`}
                              style={{
                                padding: '0.25rem 0.625rem',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                              }}
                            >
                              {activity.priority}
                            </span>
                          )}
                        </div>

                        {/* Activity Title */}
                        <h5 style={{ margin: '0.25rem 0', fontSize: '1.1rem', color: 'var(--grey-900)' }}>
                          {activity.title}
                        </h5>

                        {/* Activity Description */}
                        {activity.description && (
                          <p style={{ margin: '0.5rem 0', color: 'var(--grey-600)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            {activity.description}
                          </p>
                        )}

                        {/* Job Reference */}
                        {activity.jobId && (
                          <p style={{ margin: '0.5rem 0', color: 'var(--grey-500)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                            <strong>Job:</strong> {activity.jobId.position} at {activity.jobId.company}
                          </p>
                        )}

                        {/* Activity Metadata - Time and Status */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--grey-500)' }}>
                            {formatActivityTime(activity.createdAt)}
                          </span>
                          {activity.isCompleted && (
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              background: '#d1fae5',
                              color: '#065f46',
                              borderRadius: '12px',
                              fontWeight: '600',
                            }}>
                              COMPLETED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Timeline;
