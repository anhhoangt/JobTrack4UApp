import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/appContext';
import { Loading, Alert } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

/**
 * =====================================================
 * TIMELINE PAGE (Phase 3)
 * =====================================================
 *
 * This is a simplified initial version of the Timeline page.
 * It provides a preview of what the timeline feature will offer
 * while the full functionality is being developed.
 */

const Timeline = () => {
  const { isLoading, showAlert, jobs } = useAppContext();
  const [selectedJob, setSelectedJob] = useState('');
  const [viewMode, setViewMode] = useState('all');

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <Wrapper>
      <div className='timeline-page'>
        <header className='timeline-header'>
          <h3>Activity Timeline</h3>
          {showAlert && <Alert />}

          <div className='form-center'>
            <div className='info-message'>
              <h4>📅 Timeline View Coming Soon</h4>
              <p>
                The Timeline feature is currently under development.
                Once complete, it will provide:
              </p>
              <ul>
                <li>Chronological view of all your job application activities</li>
                <li>Visual timeline with activity types and priorities</li>
                <li>Filter by specific jobs or view all activities</li>
                <li>Upcoming activity highlights and reminders</li>
                <li>Interactive timeline with quick actions</li>
              </ul>

              {/* Preview Controls */}
              <div className='preview-controls' style={{ marginTop: '2rem' }}>
                <h5>Preview: Timeline Controls</h5>
                <div className='timeline-controls-preview'>
                  <div className='view-mode-toggle'>
                    <button
                      type='button'
                      className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setViewMode('all')}
                    >
                      All Activities
                    </button>
                    <button
                      type='button'
                      className={`btn ${viewMode === 'job-specific' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setViewMode('job-specific')}
                    >
                      By Job
                    </button>
                  </div>

                  {viewMode === 'job-specific' && (
                    <div className='job-selector' style={{ marginTop: '1rem' }}>
                      <label htmlFor='jobSelect' className='form-label'>
                        Select Job:
                      </label>
                      <select
                        id='jobSelect'
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className='form-select'
                      >
                        <option value=''>Select a job...</option>
                        {jobs?.map((job) => (
                          <option key={job._id} value={job._id}>
                            {job.position} at {job.company}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Preview Timeline */}
        <div className='timeline-preview'>
          <h5>Timeline Preview:</h5>
          <div className='preview-timeline-item'>
            <div className='preview-icon' style={{ backgroundColor: '#3b82f6' }}>
              📤
            </div>
            <div className='preview-content'>
              <h6>Application Sent</h6>
              <p>Submitted application for Software Engineer position</p>
              <small>2 days ago</small>
            </div>
          </div>

          <div className='preview-timeline-item'>
            <div className='preview-icon' style={{ backgroundColor: '#10b981' }}>
              📧
            </div>
            <div className='preview-content'>
              <h6>Email Received</h6>
              <p>Received acknowledgment email from HR</p>
              <small>1 day ago</small>
            </div>
          </div>

          <div className='preview-timeline-item'>
            <div className='preview-icon' style={{ backgroundColor: '#f59e0b' }}>
              📅
            </div>
            <div className='preview-content'>
              <h6>Interview Scheduled</h6>
              <p>Phone interview scheduled for next week</p>
              <small>Coming up</small>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Timeline;
