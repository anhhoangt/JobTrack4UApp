import { FormRow, FormRowSelect, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
    // Enhanced fields
    applicationDate,
    applicationDeadline,
    salaryMin,
    salaryMax,
    salaryCurrency,
    jobDescription,
    companyWebsite,
    jobPostingUrl,
    applicationMethod,
    applicationMethodOptions,
    notes,
    // Phase 2 fields
    category,
    categoryOptions,
    tags,
    priority,
    priorityOptions,
  } = useAppContext()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!position || !company || !jobLocation) {
      displayAlert()
      return
    }
    if (isEditing) {
      editJob()
      return
    }
    createJob()
  }
  const handleJobInput = (e) => {
    const name = e.target.name
    const value = e.target.value
    handleChange({ name, value })
  }

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit job' : 'add job'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          {/* position */}
          <FormRow
            type='text'
            name='position'
            value={position}
            handleChange={handleJobInput}
          />
          {/* company */}
          <FormRow
            type='text'
            name='company'
            value={company}
            handleChange={handleJobInput}
          />
          {/* location */}
          <FormRow
            type='text'
            labelText='job location'
            name='jobLocation'
            value={jobLocation}
            handleChange={handleJobInput}
          />
          {/* job status */}
          <FormRowSelect
            name='status'
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
          {/* job type */}
          <FormRowSelect
            name='jobType'
            labelText='job type'
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />

          {/* Enhanced Fields */}
          {/* application date */}
          <FormRow
            type='date'
            labelText='application date'
            name='applicationDate'
            value={applicationDate}
            handleChange={handleJobInput}
          />
          {/* application deadline */}
          <FormRow
            type='date'
            labelText='application deadline'
            name='applicationDeadline'
            value={applicationDeadline}
            handleChange={handleJobInput}
          />
          {/* salary min */}
          <FormRow
            type='number'
            labelText='salary min'
            name='salaryMin'
            value={salaryMin}
            handleChange={handleJobInput}
          />
          {/* salary max */}
          <FormRow
            type='number'
            labelText='salary max'
            name='salaryMax'
            value={salaryMax}
            handleChange={handleJobInput}
          />
          {/* salary currency */}
          <FormRowSelect
            name='salaryCurrency'
            labelText='currency'
            value={salaryCurrency}
            handleChange={handleJobInput}
            list={['USD', 'EUR', 'GBP', 'CAD', 'AUD']}
          />
          {/* company website */}
          <FormRow
            type='url'
            labelText='company website'
            name='companyWebsite'
            value={companyWebsite}
            handleChange={handleJobInput}
          />
          {/* job posting url */}
          <FormRow
            type='url'
            labelText='job posting URL'
            name='jobPostingUrl'
            value={jobPostingUrl}
            handleChange={handleJobInput}
          />
          {/* application method */}
          <FormRowSelect
            name='applicationMethod'
            labelText='application method'
            value={applicationMethod}
            handleChange={handleJobInput}
            list={applicationMethodOptions}
          />
          {/* job description */}
          <div className='form-row'>
            <label htmlFor='jobDescription' className='form-label'>
              job description
            </label>
            <textarea
              name='jobDescription'
              value={jobDescription}
              onChange={handleJobInput}
              className='form-textarea'
              rows='4'
              maxLength='1000'
            />
          </div>
          {/* notes */}
          <div className='form-row'>
            <label htmlFor='notes' className='form-label'>
              notes
            </label>
            <textarea
              name='notes'
              value={notes}
              onChange={handleJobInput}
              className='form-textarea'
              rows='3'
              maxLength='500'
            />
          </div>

          {/* Phase 2 Fields */}
          {/* category */}
          <FormRowSelect
            name='category'
            labelText='job category'
            value={category}
            handleChange={handleJobInput}
            list={categoryOptions}
          />
          {/* tags */}
          <FormRow
            type='text'
            labelText='tags (comma separated)'
            name='tags'
            value={tags}
            handleChange={handleJobInput}
          />
          {/* priority */}
          <FormRowSelect
            name='priority'
            labelText='priority'
            value={priority}
            handleChange={handleJobInput}
            list={priorityOptions}
          />

          {/* btn container */}
          <div className='btn-container'>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className='btn btn-block clear-btn'
              onClick={(e) => {
                e.preventDefault()
                clearValues()
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddJob
