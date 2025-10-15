import moment from 'moment'
import {
  FaLocationArrow,
  FaBriefcase,
  FaCalendarAlt,
  FaDollarSign,
  FaExternalLinkAlt,
  FaClock,
  FaStickyNote,
  FaTag,
  FaFolderOpen,
  FaFlag
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
  category,
  tags,
  priority,
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

  // Format category
  const formatCategory = (cat) => {
    if (!cat) return '';
    return cat.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Ensure URL has proper protocol
  const formatUrl = (url) => {
    if (!url) return '';
    // Check if URL already has a protocol
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Add https:// by default
    return `https://${url}`;
  };

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
          {/* Priority indicator */}
          {priority && (
            <div className={`priority-badge priority-${priority}`}>
              <FaFlag /> {priority.toUpperCase()}
            </div>
          )}
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />

          {/* Phase 2: Category */}
          {category && category !== 'other' && (
            <JobInfo
              icon={<FaFolderOpen />}
              text={formatCategory(category)}
            />
          )}

          {/* Enhanced fields */}
          {salaryText && (
            <JobInfo icon={<FaDollarSign />} text={salaryText} />
          )}
          {deadlineText && (
            <JobInfo
              icon={<FaClock />}
              text={`Deadline: ${deadlineText}`}
              className={isOverdue ? 'overdue' : ''}
            />
          )}
          {jobPostingUrl && (
            <JobInfo
              icon={<FaExternalLinkAlt />}
              text={
                <a
                  href={formatUrl(jobPostingUrl)}
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

          {/* Phase 2: Tags */}
          {tags && tags.length > 0 && (
            <div className='tags-container'>
              <FaTag className='tag-icon' />
              <div className='tags'>
                {tags.map((tag, index) => (
                  <span key={index} className='tag'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
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
