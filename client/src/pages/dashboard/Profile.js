import { useState, useEffect } from 'react';
import { FormRow, FormRowSelect, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { FaFileUpload } from 'react-icons/fa';
import ResumeList from '../../components/ResumeList';
import axios from 'axios';

const Profile = () => {
    const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext();

    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [lastName, setLastName] = useState(user?.lastName);
    const [location, setLocation] = useState(user?.location);

    // Resume state
    const [resumes, setResumes] = useState([]);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeCategory, setResumeCategory] = useState('general');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [resumeError, setResumeError] = useState('');

    // Edit category modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingResume, setEditingResume] = useState(null);
    const [newCategory, setNewCategory] = useState('');

    // Resume categories (matching job categories)
    const resumeCategories = [
        { value: 'general', label: 'General' },
        { value: 'software-engineering', label: 'Software Engineering' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'product-management', label: 'Product Management' },
        { value: 'design', label: 'Design' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
        { value: 'operations', label: 'Operations' },
        { value: 'finance', label: 'Finance' },
        { value: 'hr', label: 'Human Resources' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'other', label: 'Other' },
    ];

    // Create axios instance with auth token
    const getAuthHeaders = () => {
        return {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
    };

    // Fetch all resumes on component mount
    useEffect(() => {
        fetchResumes();
    }, []);

    /**
     * Fetch all resumes from server
     */
    const fetchResumes = async () => {
        try {
            const response = await axios.get('/api/v1/resume', {
                headers: getAuthHeaders(),
            });
            setResumes(response.data.resumes || []);
        } catch (error) {
            console.error('Error fetching resumes:', error);
            setResumeError('Failed to load resumes');
        }
    };

    /**
     * Handle file selection with validation
     */
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setResumeError('');

        if (!file) return;

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(file.type)) {
            setResumeError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setResumeError('File size too large. Maximum size is 5MB.');
            return;
        }

        setResumeFile(file);
    };

    /**
     * Upload new resume to server
     */
    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setResumeError('Please select a file first');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setResumeError('');

        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);
            formData.append('category', resumeCategory);

            await axios.post('/api/v1/resume/upload', formData, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            // Refresh resume list
            fetchResumes();

            // Reset form
            setResumeFile(null);
            setResumeCategory('general');
            setUploadProgress(0);

            // Clear file input
            document.getElementById('resume-input').value = '';

            displayAlert();
        } catch (error) {
            console.error('Upload error:', error);
            setResumeError(
                error.response?.data?.msg || 'Failed to upload resume. Please try again.'
            );
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Delete a specific resume
     */
    const handleResumeDelete = async (resumeId, fileName) => {
        if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
            return;
        }

        try {
            await axios.delete(`/api/v1/resume/${resumeId}`, {
                headers: getAuthHeaders(),
            });

            // Refresh resume list
            fetchResumes();
            displayAlert();
        } catch (error) {
            console.error('Delete error:', error);
            setResumeError(
                error.response?.data?.msg || 'Failed to delete resume. Please try again.'
            );
        }
    };

    /**
     * Set a resume as default
     */
    const handleSetDefaultResume = async (resumeId) => {
        try {
            await axios.patch(`/api/v1/resume/${resumeId}/default`, {}, {
                headers: getAuthHeaders(),
            });

            // Refresh resume list
            fetchResumes();
            displayAlert();
        } catch (error) {
            console.error('Set default error:', error);
            setResumeError(
                error.response?.data?.msg || 'Failed to set default resume. Please try again.'
            );
        }
    };

    /**
     * Open edit category modal
     */
    const handleEditCategoryClick = (resume) => {
        setEditingResume(resume);
        setNewCategory(resume.category || 'general');
        setShowEditModal(true);
    };

    /**
     * Update resume category
     */
    const handleUpdateCategory = async () => {
        if (!editingResume) return;

        try {
            await axios.patch(
                `/api/v1/resume/${editingResume._id}`,
                { category: newCategory },
                { headers: getAuthHeaders() }
            );

            // Refresh resume list
            fetchResumes();

            // Close modal
            setShowEditModal(false);
            setEditingResume(null);

            displayAlert();
        } catch (error) {
            console.error('Update error:', error);
            setResumeError(
                error.response?.data?.msg || 'Failed to update resume category. Please try again.'
            );
        }
    };

    /**
     * Format file size for display
     */
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !lastName || !location) {
            displayAlert();
            return;
        }
        updateUser({ name, email, lastName, location });
    };

    return (
        <Wrapper>
            {/* Profile Information Form */}
            <form className="form" onSubmit={handleSubmit}>
                <h3>profile</h3>
                {showAlert && <Alert />}
                <div className="form-center">
                    <FormRow
                        type="text"
                        name="name"
                        value={name}
                        handleChange={(e) => setName(e.target.value)}
                    />
                    <FormRow
                        type="text"
                        labelText="last name"
                        name="lastName"
                        value={lastName}
                        handleChange={(e) => setLastName(e.target.value)}
                    />
                    <FormRow
                        type="email"
                        name="email"
                        value={email}
                        handleChange={(e) => setEmail(e.target.value)}
                        disabled
                    />
                    <small style={{ display: 'block', marginTop: '-0.5rem', marginBottom: '1rem', color: 'var(--grey-500)', fontStyle: 'italic' }}>
                        Email cannot be changed as it is your login ID
                    </small>
                    <FormRow
                        type="text"
                        name="location"
                        value={location}
                        handleChange={(e) => setLocation(e.target.value)}
                    />
                    <button className="btn btn-block" type="submit" disabled={isLoading}>
                        {isLoading ? 'Please Wait...' : 'save changes'}
                    </button>
                </div>
            </form>

            {/* Resume Management Section */}
            <div className="form" style={{ marginTop: '2rem' }}>
                <h3>Resume Management</h3>
                <p style={{ color: 'var(--grey-600)', marginBottom: '1.5rem' }}>
                    Upload multiple resumes for different job categories. Mark one as default for quick access.
                </p>

                {/* Upload New Resume Form */}
                <div className="form-center" style={{ marginBottom: '2rem' }}>
                    <div className="form-row">
                        <label htmlFor="resume-input" className="form-label">
                            Upload New Resume
                        </label>
                        <input
                            type="file"
                            id="resume-input"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileSelect}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--grey-300)',
                                borderRadius: 'var(--borderRadius)',
                                background: 'var(--white)',
                                cursor: 'pointer',
                            }}
                        />
                        <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--grey-500)' }}>
                            Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                        </small>
                    </div>

                    {/* Category Selection */}
                    <FormRowSelect
                        labelText="Resume Category"
                        name="resumeCategory"
                        value={resumeCategory}
                        handleChange={(e) => setResumeCategory(e.target.value)}
                        list={resumeCategories.map((cat) => cat.value)}
                    />

                    {/* Selected File Info */}
                    {resumeFile && (
                        <div
                            style={{
                                background: 'var(--primary-100)',
                                border: '1px solid var(--primary-300)',
                                borderRadius: 'var(--borderRadius)',
                                padding: '1rem',
                            }}
                        >
                            <p style={{ margin: 0, color: 'var(--primary-700)', fontWeight: '600' }}>
                                Selected: {resumeFile.name}
                            </p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--primary-600)' }}>
                                Size: {formatFileSize(resumeFile.size)} | Category: {
                                    resumeCategories.find((c) => c.value === resumeCategory)?.label
                                }
                            </p>
                        </div>
                    )}

                    {/* Upload Progress Bar */}
                    {isUploading && uploadProgress > 0 && (
                        <div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'var(--grey-200)',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: `${uploadProgress}%`,
                                        height: '100%',
                                        background: 'var(--primary-500)',
                                        transition: 'width 0.3s ease',
                                    }}
                                />
                            </div>
                            <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--primary-600)' }}>
                                Uploading: {uploadProgress}%
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {resumeError && (
                        <div
                            style={{
                                background: 'var(--red-light)',
                                border: '1px solid var(--red-dark)',
                                borderRadius: 'var(--borderRadius)',
                                padding: '1rem',
                                color: 'var(--red-dark)',
                            }}
                        >
                            {resumeError}
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        type="button"
                        className="btn btn-block"
                        onClick={handleResumeUpload}
                        disabled={!resumeFile || isUploading}
                        style={{
                            background: resumeFile && !isUploading ? 'var(--primary-500)' : 'var(--grey-400)',
                            cursor: resumeFile && !isUploading ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <FaFileUpload />
                        {isUploading ? 'Uploading...' : 'Upload Resume'}
                    </button>
                </div>

                {/* Resume List */}
                <h4 style={{ marginBottom: '1rem' }}>My Resumes ({resumes.length})</h4>
                <ResumeList
                    resumes={resumes}
                    onDelete={handleResumeDelete}
                    onSetDefault={handleSetDefaultResume}
                    onUpdateCategory={handleEditCategoryClick}
                />
            </div>

            {/* Edit Category Modal */}
            {showEditModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        style={{
                            background: 'var(--white)',
                            padding: '2rem',
                            borderRadius: 'var(--borderRadius)',
                            maxWidth: '500px',
                            width: '90%',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 style={{ marginTop: 0 }}>Edit Resume Category</h4>
                        <p style={{ color: 'var(--grey-600)', marginBottom: '1.5rem' }}>
                            {editingResume?.fileName}
                        </p>

                        <FormRowSelect
                            labelText="Category"
                            name="newCategory"
                            value={newCategory}
                            handleChange={(e) => setNewCategory(e.target.value)}
                            list={resumeCategories.map((cat) => cat.value)}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                className="btn"
                                onClick={handleUpdateCategory}
                                style={{ flex: 1, background: 'var(--primary-500)', color: 'var(--white)' }}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setShowEditModal(false)}
                                style={{ flex: 1, background: 'var(--grey-200)', color: 'var(--grey-700)' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Wrapper>
    );
};

export default Profile;
