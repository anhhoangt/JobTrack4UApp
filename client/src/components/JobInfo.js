import Wrapper from '../assets/wrappers/JobInfo'

const JobInfo = ({ icon, text, className = '' }) => {
  return (
    <Wrapper className={className}>
      <span className='icon'>{icon}</span>
      <span className='text'>{text}</span>
    </Wrapper>
  )
}

export default JobInfo
