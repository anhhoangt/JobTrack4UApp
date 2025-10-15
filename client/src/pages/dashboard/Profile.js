import { useState, useEffect } from 'react'
import { FormRow, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { FaFileUpload, FaFileDownload, FaTrash, FaFilePdf } from 'react-icons/fa'
import axios from 'axios'

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext()

  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [lastName, setLastName] = useState(user?.lastName)
  const [location, setLocation] = useState(user?.location)

  // Resume state
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeInfo, setResumeInfo] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [resumeError, setResumeError] = useState('')

  // Create axios instance with auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    console.log('Token:', token)
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  // Fetch resume info on component mount
  useEffect(() => {
    fetchResumeInfo()
  }, [])

  /**
   * Fetch current resume information from server
   */
  const fetchResumeInfo = async () => {
    try {
      const response = await axios.get('/api/v1/resume', {
        headers: getAuthHeaders(),
      })
      setResumeInfo(response.data.resume)
    } catch (error) {
      console.error('Error fetching resume info:', error)
    }
  }

  /**
   * Handle file selection
   * Validates file type and size before setting
   */
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    setResumeError('')

    if (!file) return

    console.log('Selected file:', file)
    console.log('File type:', file.type)
    console.log('File size:', file.size)

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setResumeError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File size too large. Maximum size is 5MB.')
      return
    }

    setResumeFile(file)
  }

  /**
   * Upload resume to server
   */
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setResumeError('Please select a file first')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setResumeError('')

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)

      const response = await axios.post('/api/v1/resume/upload', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(percentCompleted)
        },
      })

      // Update resume info after successful upload
      setResumeInfo(response.data.resume)
      setResumeFile(null)
      setUploadProgress(0)
      displayAlert()

      // Clear file input
      document.getElementById('resume-input').value = ''
    } catch (error) {
      console.error('Upload error:', error)
      setResumeError(
        error.response?.data?.msg || 'Failed to upload resume. Please try again.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Delete resume from server
   */
  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return
    }

    try {
      await axios.delete('/api/v1/resume', {
        headers: getAuthHeaders(),
      })
      setResumeInfo(null)
      displayAlert()
    } catch (error) {
      console.error('Delete error:', error)
      setResumeError(
        error.response?.data?.msg || 'Failed to delete resume. Please try again.'
      )
    }
  }

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !lastName || !location) {
      displayAlert()
      return
    }
    updateUser({ name, email, lastName, location })
  }

  return (
    <Wrapper>
      {/* Profile Information Form */}
      <form className='form' onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow
            type='text'
            name='name'
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <FormRow
            type='text'
            labelText='last name'
            name='lastName'
            value={lastName}
            handleChange={(e) => setLastName(e.target.value)}
          />
          <FormRow
            type='email'
            name='email'
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <FormRow
            type='text'
            name='location'
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
          />
          <button className='btn btn-block' type='submit' disabled={isLoading}>
            {isLoading ? 'Please Wait...' : 'save changes'}
          </button>
        </div>
      </form>

      {/* Resume Upload Section */}
      <div className='form' style={{ marginTop: '2rem' }}>
        <h3>Resume Management</h3>

        {/* Current Resume Display */}
        {resumeInfo ? (
          <div style={{
            background: 'var(--grey-50)',
            border: '2px solid var(--grey-200)',
            borderRadius: 'var(--border-radius)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <FaFilePdf style={{ fontSize: '2.5rem', color: 'var(--red-dark)' }} />
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: 0, color: 'var(--grey-700)' }}>{resumeInfo.fileName}</h5>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: 'var(--grey-500)' }}>
                  Uploaded: {formatDate(resumeInfo.uploadDate)}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={resumeInfo.url}
                target='_blank'
                rel='noopener noreferrer'
                className='btn'
                style={{
                  background: 'var(--primary-500)',
                  color: 'var(--white)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FaFileDownload /> View/Download Resume
              </a>
              <button
                type='button'
                className='btn'
                onClick={handleResumeDelete}
                style={{
                  background: 'var(--red-light)',
                  color: 'var(--red-dark)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FaTrash /> Delete Resume
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--grey-50)',
            border: '2px dashed var(--grey-300)',
            borderRadius: 'var(--border-radius)',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            <FaFileUpload style={{ fontSize: '3rem', color: 'var(--grey-400)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--grey-600)', margin: 0 }}>
              No resume uploaded yet. Upload your resume to keep it handy for job applications.
            </p>
          </div>
        )}

        {/* File Upload Interface */}
        <div className='form-center'>
          <div className='form-row'>
            <label htmlFor='resume-input' className='form-label'>
              {resumeInfo ? 'Replace Resume' : 'Upload Resume'}
            </label>
            <input
              type='file'
              id='resume-input'
              accept='.pdf,.doc,.docx'
              onChange={handleFileSelect}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--grey-300)',
                borderRadius: 'var(--border-radius)',
                background: 'var(--white)',
                cursor: 'pointer',
              }}
            />
            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--grey-500)' }}>
              Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
            </small>
          </div>

          {/* Selected File Info */}
          {resumeFile && (
            <div style={{
              background: 'var(--primary-100)',
              border: '1px solid var(--primary-300)',
              borderRadius: 'var(--border-radius)',
              padding: '1rem',
              marginTop: '1rem',
            }}>
              <p style={{ margin: 0, color: 'var(--primary-700)', fontWeight: '600' }}>
                Selected: {resumeFile.name}
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--primary-600)' }}>
                Size: {formatFileSize(resumeFile.size)}
              </p>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && uploadProgress > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--grey-200)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: 'var(--primary-500)',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--primary-600)' }}>
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}

          {/* Error Message */}
          {resumeError && (
            <div style={{
              background: 'var(--red-light)',
              border: '1px solid var(--red-dark)',
              borderRadius: 'var(--border-radius)',
              padding: '1rem',
              marginTop: '1rem',
              color: 'var(--red-dark)',
            }}>
              {resumeError}
            </div>
          )}

          {/* Upload Button */}
          <button
            type='button'
            className='btn btn-block'
            onClick={handleResumeUpload}
            disabled={!resumeFile || isUploading}
            style={{
              marginTop: '1rem',
              background: resumeFile && !isUploading ? 'var(--primary-500)' : 'var(--grey-400)',
              cursor: resumeFile && !isUploading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <FaFileUpload />
            {isUploading ? 'Uploading...' : resumeInfo ? 'Replace Resume' : 'Upload Resume'}
          </button>
        </div>
      </div>
    </Wrapper>
  )
}

export default Profile
