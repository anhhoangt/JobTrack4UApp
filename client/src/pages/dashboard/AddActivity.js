import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/appContext';
import { Loading, Alert, FormRow, FormRowSelect } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useNavigate } from 'react-router-dom';

/**
 * =====================================================
 * ADD/EDIT ACTIVITY PAGE (Phase 3 Enhanced)
 * =====================================================
 *
 * Comprehensive form for creating and editing activities.
 * Features include:
 * - All activity fields (type, title, description, dates, etc.)
 * - Job selection dropdown
 * - Contact person information
 * - Priority levels and reminders
 * - Activity templates for quick creation
 * - Form validation and error handling
 */

const AddActivity = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    showAlert,
    jobs,
    // Activity form state
    activityTitle,
    activityType,
    activityDescription,
    activityJobId,
    activityScheduledDate,
    activityReminderDate,
    activityPriority,
    activityContactName,
    activityContactEmail,
    activityContactPhone,
    activityContactRole,
    // Activity management
    isEditingActivity,
    editActivityId,
    handleChange,
    createActivity,
    updateActivity,
    clearActivityValues,
    getJobs,
    setEditActivity,
  } = useAppContext();

  const [showContactFields, setShowContactFields] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Activity type options
  const activityTypeOptions = [
    'application-sent',
    'email-sent',
    'email-received',
    'phone-call-made',
    'phone-call-received',
    'interview-scheduled',
    'interview-completed',
    'follow-up-sent',
    'offer-received',
    'rejection-received',
    'note-added',
    'other'
  ];

  const priorityOptions = ['low', 'medium', 'high'];

  // Activity templates for quick creation
  const activityTemplates = {
    'application-sent': {
      title: 'Application Submitted',
      description: 'Successfully submitted job application',
      type: 'application-sent',
      priority: 'medium'
    },
    'follow-up-email': {
      title: 'Follow-up Email',
      description: 'Send follow-up email to check application status',
      type: 'email-sent',
      priority: 'medium'
    },
    'interview-prep': {
      title: 'Interview Preparation',
      description: 'Research company and prepare for interview questions',
      type: 'other',
      priority: 'high'
    },
    'thank-you-note': {
      title: 'Thank You Email',
      description: 'Send thank you email after interview',
      type: 'email-sent',
      priority: 'medium'
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    getJobs();
  }, []);

  const handleJobInput = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleTemplateSelect = (templateKey) => {
    const template = activityTemplates[templateKey];
    if (template) {
      handleChange({ name: 'activityTitle', value: template.title });
      handleChange({ name: 'activityDescription', value: template.description });
      handleChange({ name: 'activityType', value: template.type });
      handleChange({ name: 'activityPriority', value: template.priority });
      setSelectedTemplate(templateKey);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!activityTitle || !activityType || !activityJobId) {
      return;
    }

    const activityData = {
      title: activityTitle,
      type: activityType,
      description: activityDescription,
      jobId: activityJobId,
      scheduledDate: activityScheduledDate || undefined,
      reminderDate: activityReminderDate || undefined,
      priority: activityPriority || 'medium',
      contactPerson: showContactFields ? {
        name: activityContactName || undefined,
        email: activityContactEmail || undefined,
        phone: activityContactPhone || undefined,
        role: activityContactRole || undefined,
      } : undefined,
    };

    if (isEditingActivity) {
      updateActivity(editActivityId, activityData);
    } else {
      createActivity(activityData);
    }
  };

  const handleClear = () => {
    clearActivityValues();
    setShowContactFields(false);
    setSelectedTemplate('');
  };

  const formatActivityType = (type) => {
    return type.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Wrapper>
      <form className='form' onSubmit={onSubmit}>
        <h3>{isEditingActivity ? 'Edit Activity' : 'Add Activity'}</h3>
        {showAlert && <Alert />}

        {/* Activity Templates Section */}
        {!isEditingActivity && (
          <div className='form-center'>
            <h5>Quick Templates</h5>
            <div className='template-buttons'>
              {Object.keys(activityTemplates).map((templateKey) => (
                <button
                  key={templateKey}
                  type='button'
                  className={`btn template-btn ${selectedTemplate === templateKey ? 'active' : ''}`}
                  onClick={() => handleTemplateSelect(templateKey)}
                >
                  {activityTemplates[templateKey].title}
                </button>
              ))}
              <button
                type='button'
                className='btn template-btn clear-template'
                onClick={() => {
                  setSelectedTemplate('');
                  handleClear();
                }}
              >
                Clear Template
              </button>
            </div>
          </div>
        )}

        <div className='form-center'>
          {/* Job Selection */}
          <div className='form-row'>
            <label htmlFor='activityJobId' className='form-label'>
              Select Job *
            </label>
            <select
              name='activityJobId'
              value={activityJobId || ''}
              onChange={handleJobInput}
              className='form-select'
              required
            >
              <option value=''>Choose a job...</option>
              {jobs?.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.position} at {job.company}
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type */}
          <FormRowSelect
            labelText='Activity Type *'
            name='activityType'
            value={activityType}
            handleChange={handleJobInput}
            list={activityTypeOptions}
            formatOption={formatActivityType}
          />

          {/* Activity Title */}
          <FormRow
            type='text'
            labelText='Title *'
            name='activityTitle'
            value={activityTitle}
            handleChange={handleJobInput}
            placeholder='Brief title for this activity'
          />

          {/* Activity Description */}
          <div className='form-row'>
            <label htmlFor='activityDescription' className='form-label'>
              Description
            </label>
            <textarea
              name='activityDescription'
              value={activityDescription || ''}
              onChange={handleJobInput}
              className='form-textarea'
              rows='4'
              placeholder='Detailed description of the activity...'
              maxLength='500'
            />
            <small className='char-counter'>
              {(activityDescription || '').length}/500 characters
            </small>
          </div>

          {/* Priority */}
          <FormRowSelect
            labelText='Priority'
            name='activityPriority'
            value={activityPriority || 'medium'}
            handleChange={handleJobInput}
            list={priorityOptions}
          />

          {/* Scheduled Date */}
          <FormRow
            type='datetime-local'
            labelText='Scheduled Date'
            name='activityScheduledDate'
            value={activityScheduledDate}
            handleChange={handleJobInput}
          />

          {/* Reminder Date */}
          <FormRow
            type='datetime-local'
            labelText='Reminder Date'
            name='activityReminderDate'
            value={activityReminderDate}
            handleChange={handleJobInput}
          />

          {/* Contact Person Toggle */}
          <div className='form-row'>
            <label className='form-label'>
              <input
                type='checkbox'
                checked={showContactFields}
                onChange={(e) => setShowContactFields(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Add Contact Person Information
            </label>
          </div>

          {/* Contact Person Fields */}
          {showContactFields && (
            <div className='contact-fields'>
              <h5>Contact Information</h5>
              <FormRow
                type='text'
                labelText='Contact Name'
                name='activityContactName'
                value={activityContactName}
                handleChange={handleJobInput}
                placeholder='Full name'
              />
              <FormRow
                type='email'
                labelText='Contact Email'
                name='activityContactEmail'
                value={activityContactEmail}
                handleChange={handleJobInput}
                placeholder='email@company.com'
              />
              <FormRow
                type='tel'
                labelText='Contact Phone'
                name='activityContactPhone'
                value={activityContactPhone}
                handleChange={handleJobInput}
                placeholder='+1 (555) 123-4567'
              />
              <FormRow
                type='text'
                labelText='Contact Role'
                name='activityContactRole'
                value={activityContactRole}
                handleChange={handleJobInput}
                placeholder='HR Manager, Recruiter, etc.'
              />
            </div>
          )}

          {/* Form Actions */}
          <div className='btn-container'>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isEditingActivity ? 'Update Activity' : 'Create Activity')}
            </button>
            <button
              type='button'
              className='btn btn-block clear-btn'
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear Form
            </button>
            <button
              type='button'
              className='btn btn-block cancel-btn'
              onClick={() => navigate('/activities')}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddActivity;
