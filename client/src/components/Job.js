import moment from 'moment'
import {
  FaLocationArrow,
  FaBriefcase,
  FaCalendarAlt,
  FaDollarSign,
  FaExternalLinkAlt,
  FaClock,
  FaStickyNote
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  status,
  salary,
  applicationDeadline,
  jobPostingUrl,
  notes,
}) => {
  const { setEditJob, deleteJob } = useAppContext()

  let date = moment(createdAt)
  date = date.format('MMM Do, YYYY')

  // Format application deadline
  let deadlineText = '';
  let isOverdue = false;
  if (applicationDeadline) {
    const deadline = moment(applicationDeadline);
    deadlineText = deadline.format('MMM Do, YYYY');
    isOverdue = deadline.isBefore(moment());
    deadlineText = isOverdue ? `${deadlineText} (Overdue)` : deadlineText;
  }

  // Format salary
  let salaryText = '';
  if (salary && (salary.min || salary.max)) {
    const currency = salary.currency || 'USD';
    if (salary.min && salary.max) {
      salaryText = `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${currency}`;
    } else if (salary.min) {
      salaryText = `${salary.min.toLocaleString()}+ ${currency}`;
    } else if (salary.max) {
      salaryText = `Up to ${salary.max.toLocaleString()} ${currency}`;
    }
  }

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />

          {/* Enhanced fields */}
          {salaryText && (
            <JobInfo icon={<FaDollarSign />} text={salaryText} />
          )}
          {deadlineText && (
            <JobInfo
              icon={<FaClock />}
              text={`Deadline: ${deadlineText}`}
            />
          )}
          {jobPostingUrl && (
            <JobInfo
              icon={<FaExternalLinkAlt />}
              text={
                <a
                  href={jobPostingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="job-link"
                >
                  View Job Posting
                </a>
              }
            />
          )}
          {notes && notes.trim() && (
            <JobInfo
              icon={<FaStickyNote />}
              text={`Notes: ${notes.length > 50 ? notes.substring(0, 50) + '...' : notes}`}
            />
          )}

          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className='actions'>
            <Link
              to='/add-job'
              className='btn edit-btn'
              onClick={() => setEditJob(_id)}
            >
              Edit
            </Link>
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => deleteJob(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  )
}

export default Job
