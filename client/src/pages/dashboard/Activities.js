import { useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import { Loading, Alert } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

/**
 * =====================================================
 * ACTIVITIES MANAGEMENT PAGE (Phase 3)
 * =====================================================
 *
 * This page provides a comprehensive view of all user activities across
 * all job applications. It allows users to:
 *
 * - View all activities in chronological order
 * - Filter activities by type (email, interview, etc.)
 * - Filter by completion status (completed/pending)
 * - Mark activities as complete
 * - Edit or delete activities
 * - Create new activities
 */

const Activities = () => {
    const {
        isLoading,
        showAlert,
        // Activity-related state
        activities,
        totalActivities,
        activitiesPage,
        activitiesNumOfPages,
        // Activity filters
        activityType,
        activityStatus,
        // Activity functions
        getActivities,
        handleActivityChange,
        clearActivityFilters,
        markActivityComplete,
        deleteActivity,
    } = useAppContext();

    // Load activities on component mount and when filters change
    useEffect(() => {
        getActivities();
    }, [activitiesPage, activityType, activityStatus]);

    const handleSubmit = (e) => {
        e.preventDefault();
        clearActivityFilters();
    };

    const handleSearch = (e) => {
        handleActivityChange({ name: e.target.name, value: e.target.value });
    };

    if (isLoading && !activities?.length) {
        return <Loading center />;
    }

    return (
        <Wrapper>
            <form className='form'>
                <h3>Activity Management</h3>
                {showAlert && <Alert />}

                {/* Activity Filters Section */}
                <div className='form-center'>
                    {/* Filter by Activity Type */}
                    <div className='form-row'>
                        <label htmlFor='activityType' className='form-label'>
                            Activity Type
                        </label>
                        <select
                            name='activityType'
                            value={activityType || 'all'}
                            onChange={handleSearch}
                            className='form-select'
                        >
                            <option value='all'>All Types</option>
                            <option value='application-sent'>Application Sent</option>
                            <option value='email-sent'>Email Sent</option>
                            <option value='email-received'>Email Received</option>
                            <option value='phone-call-made'>Phone Call Made</option>
                            <option value='phone-call-received'>Phone Call Received</option>
                            <option value='interview-scheduled'>Interview Scheduled</option>
                            <option value='interview-completed'>Interview Completed</option>
                            <option value='follow-up-sent'>Follow-up Sent</option>
                            <option value='offer-received'>Offer Received</option>
                            <option value='rejection-received'>Rejection Received</option>
                            <option value='note-added'>Note Added</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>

                    {/* Filter by Status */}
                    <div className='form-row'>
                        <label htmlFor='activityStatus' className='form-label'>
                            Status
                        </label>
                        <select
                            name='activityStatus'
                            value={activityStatus || 'all'}
                            onChange={handleSearch}
                            className='form-select'
                        >
                            <option value='all'>All Activities</option>
                            <option value='pending'>Pending</option>
                            <option value='completed'>Completed</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <button
                        type='button'
                        className='btn btn-block btn-danger'
                        onClick={handleSubmit}
                    >
                        Clear Filters
                    </button>
                </div>
            </form>

            {/* Activities List Section */}
            <div className='activities-container'>
                {!isLoading && activities?.length === 0 && (
                    <div className='no-activities'>
                        <h4>No activities found</h4>
                        <p>Start by creating your first activity or try adjusting your filters.</p>
                    </div>
                )}

                {activities?.length > 0 && (
                    <>
                        <h5 className='activities-count'>
                            {totalActivities} activit{totalActivities !== 1 ? 'ies' : 'y'} found
                        </h5>

                        <div className='activities-list'>
                            {activities.map((activity) => (
                                <ActivityCard
                                    key={activity._id}
                                    activity={activity}
                                    onMarkComplete={() => markActivityComplete(activity._id)}
                                    onDelete={() => deleteActivity(activity._id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {activitiesNumOfPages > 1 && (
                            <div className='pagination-container'>
                                <p>Page {activitiesPage} of {activitiesNumOfPages}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Wrapper>
    );
};

/**
 * ACTIVITY CARD COMPONENT
 *
 * Displays individual activity information in a card format
 * with quick action buttons for common operations.
 */
const ActivityCard = ({ activity, onMarkComplete, onDelete }) => {
    const {
        _id,
        type,
        title,
        description,
        scheduledDate,
        completedDate,
        isCompleted,
        priority,
        jobId,
        createdAt,
    } = activity;

    // Format activity type for display
    const formatActivityType = (type) => {
        return type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Format dates for display
    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <article className={`activity-card ${isCompleted ? 'completed' : 'pending'} priority-${priority}`}>
            <header className='activity-header'>
                <div className='activity-info'>
                    <h5 className='activity-title'>{title}</h5>
                    <p className='activity-type'>{formatActivityType(type)}</p>
                    {jobId && (
                        <p className='job-reference'>
                            Job: {jobId.position} at {jobId.company}
                        </p>
                    )}
                </div>
                <div className='activity-status'>
                    <span className={`status-badge ${isCompleted ? 'completed' : 'pending'}`}>
                        {isCompleted ? 'Completed' : 'Pending'}
                    </span>
                    <span className={`priority-badge priority-${priority}`}>
                        {priority.toUpperCase()}
                    </span>
                </div>
            </header>

            <div className='activity-content'>
                {description && (
                    <p className='activity-description'>{description}</p>
                )}

                <div className='activity-dates'>
                    {scheduledDate && (
                        <p className='scheduled-date'>
                            <strong>Scheduled:</strong> {formatDate(scheduledDate)}
                        </p>
                    )}
                    {completedDate && (
                        <p className='completed-date'>
                            <strong>Completed:</strong> {formatDate(completedDate)}
                        </p>
                    )}
                    <p className='created-date'>
                        <strong>Created:</strong> {formatDate(createdAt)}
                    </p>
                </div>
            </div>

            <footer className='activity-actions'>
                {!isCompleted && (
                    <button
                        type='button'
                        className='btn action-btn complete-btn'
                        onClick={onMarkComplete}
                    >
                        Mark Complete
                    </button>
                )}
                <button
                    type='button'
                    className='btn action-btn delete-btn'
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this activity?')) {
                            onDelete();
                        }
                    }}
                >
                    Delete
                </button>
            </footer>
        </article>
    );
};

export default Activities;
