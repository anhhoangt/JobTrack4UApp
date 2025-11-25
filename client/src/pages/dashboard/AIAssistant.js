import { useState } from 'react';
import Wrapper from '../../assets/wrappers/AIAssistant';
import { Alert, Loading } from '../../components';
import axios from 'axios';
import { FaRobot, FaFileAlt, FaEnvelope, FaQuestionCircle, FaClipboard, FaDownload } from 'react-icons/fa';

const AIAssistant = () => {
    const [activeTab, setActiveTab] = useState('resume-tailor');
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('success');

    // Resume Tailor State.
    const [resumeText, setResumeText] = useState('');
    const [resumeInputMethod, setResumeInputMethod] = useState('text'); // 'text' or 'file'
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [jobDescInputMethod, setJobDescInputMethod] = useState('text'); // 'text' or 'url'
    const [jobDescUrl, setJobDescUrl] = useState('');
    const [tailoredResume, setTailoredResume] = useState('');

    // Email Assistant State
    const [emailContent, setEmailContent] = useState('');
    const [emailContext, setEmailContext] = useState('');
    const [emailResponse, setEmailResponse] = useState('');

    // Interview Prep State
    const [interviewJobDesc, setInterviewJobDesc] = useState('');
    const [interviewResume, setInterviewResume] = useState('');
    const [interviewPrep, setInterviewPrep] = useState('');

    // Resume Analysis State
    const [analysisResume, setAnalysisResume] = useState('');
    const [resumeAnalysis, setResumeAnalysis] = useState('');

    // Cover Letter State
    const [coverLetterResume, setCoverLetterResume] = useState('');
    const [coverLetterJobDesc, setCoverLetterJobDesc] = useState('');
    const [coverLetterCompany, setCoverLetterCompany] = useState('');
    const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');

    const displayAlert = (text, type = 'success') => {
        setAlertText(text);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        displayAlert('Copied to clipboard!');
    };

    const downloadText = (text, filename) => {
        const element = document.createElement('a');
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        displayAlert(`Downloaded ${filename}!`);
    };

    // Handle resume file upload
    const handleResumeFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
        if (!validTypes.includes(file.type)) {
            displayAlert('Please upload a PDF, DOCX, DOC, or TXT file', 'danger');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await axios.post('/api/v1/ai/parse-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResumeText(response.data.resumeText);
            setResumeFile(file);
            displayAlert('Resume uploaded and parsed successfully!');
        } catch (error) {
            displayAlert(error.response?.data?.msg || 'Failed to parse resume file', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle job description URL fetch
    const handleFetchJobDescription = async () => {
        if (!jobDescUrl) {
            displayAlert('Please enter a URL', 'danger');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/api/v1/ai/fetch-job-description', {
                url: jobDescUrl,
            });

            setJobDescription(response.data.jobDescription);
            displayAlert('Job description fetched successfully!');
        } catch (error) {
            displayAlert(error.response?.data?.msg || 'Failed to fetch job description', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    // Resume Tailor Handler
    const handleTailorResume = async () => {
        if (!resumeText || !jobDescription) {
            displayAlert('Please provide both resume and job description', 'danger');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/api/v1/ai/tailor-resume', {
                resumeText,
                jobDescription,
            });
            setTailoredResume(response.data.tailoredResume);
            displayAlert('Resume tailored successfully!');
        } catch (error) {
            displayAlert(error.response?.data?.msg || 'Failed to tailor resume', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    // Email Response Handler
    const handleGenerateEmail = async () => {
        if (!emailContent) {
            displayAlert('Please provide email content', 'danger');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/api/v1/ai/email-response', {
                emailContent,
                context: emailContext,
            });
            setEmailResponse(response.data.emailResponse);
            displayAlert('Email response generated!');
        } catch (error) {
            displayAlert(error.response?.data?.msg || 'Failed to generate email', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    // Interview Prep Handler
    const handleGenerateInterviewPrep = async () => {
        if (!interviewJobDesc) {
            displayAlert('Please provide job description', 'danger');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/api/v1/ai/interview-prep', {
                jobDescription: interviewJobDesc,
                resumeText: interviewResume,
            });
            setInterviewPrep(response.data.interviewPrep);
            displayAlert('Interview prep generated!');
        } catch (error) {
            displayAlert(error.response?.data?.msg || 'Failed to generate prep', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    // Resume Analysis Handler
    const handleAnalyzeResume = async () => {
        if (!analysisResume) {
            displayAlert('Please provide resume text', 'danger');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/api/v1/ai/analyze-resume', {
                resumeText: analysisResume,
            });
            setResumeAnalysis(response.data.analysis);
            displayAlert('Resume analyzed!');
        } catch (error) {
            displayAlert(error.response?.data?.msg || 'Failed to analyze resume', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    // Cover Letter Handler
    const handleGenerateCoverLetter = async () => {
        if (!coverLetterResume || !coverLetterJobDesc) {
            displayAlert('Please provide resume and job description', 'danger');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('/api/v1/ai/cover-letter', {
                resumeText: coverLetterResume,
                jobDescription: coverLetterJobDesc,
                companyName: coverLetterCompany,
            });
            setGeneratedCoverLetter(response.data.coverLetter);
            displayAlert('Cover letter generated!');
        } catch (error) {
            displayAlert(error.response?.data?.msg || 'Failed to generate cover letter', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'resume-tailor', label: 'Resume Tailor', icon: <FaFileAlt /> },
        { id: 'email-assistant', label: 'Email Assistant', icon: <FaEnvelope /> },
        { id: 'interview-prep', label: 'Interview Prep', icon: <FaQuestionCircle /> },
        { id: 'resume-analysis', label: 'Resume Analysis', icon: <FaClipboard /> },
        { id: 'cover-letter', label: 'Cover Letter', icon: <FaFileAlt /> },
    ];

    return (
        <Wrapper>
            {showAlert && <Alert alertText={alertText} alertType={alertType} />}

            <div className="ai-header">
                <div className="header-content">
                    <h2><FaRobot /> AI Assistant</h2>
                    <p>Powered by ChatGPT - Your intelligent job search companion</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Resume Tailor */}
                {activeTab === 'resume-tailor' && (
                    <div className="feature-section">
                        <h3>🎯 ATS-Optimized Resume Tailoring</h3>
                        <p className="feature-description">
                            Transform your resume to perfectly match any job description while passing ATS systems
                        </p>

                        {/* Resume Input Section */}
                        <div className="input-group">
                            <label>Your Resume *</label>
                            <div className="input-method-selector">
                                <button
                                    type="button"
                                    className={`method-btn ${resumeInputMethod === 'text' ? 'active' : ''}`}
                                    onClick={() => setResumeInputMethod('text')}
                                >
                                    📝 Paste Text
                                </button>
                                <button
                                    type="button"
                                    className={`method-btn ${resumeInputMethod === 'file' ? 'active' : ''}`}
                                    onClick={() => setResumeInputMethod('file')}
                                >
                                    📎 Upload File
                                </button>
                            </div>

                            {resumeInputMethod === 'text' ? (
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste your resume text here..."
                                    rows="10"
                                />
                            ) : (
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        accept=".pdf,.docx,.doc,.txt"
                                        onChange={handleResumeFileUpload}
                                        id="resume-file-input"
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="resume-file-input" className="file-upload-btn">
                                        📁 Choose File (PDF, DOCX, DOC, TXT)
                                    </label>
                                    {resumeFile && (
                                        <p className="file-selected">✅ {resumeFile.name} uploaded</p>
                                    )}
                                    {resumeText && (
                                        <textarea
                                            value={resumeText}
                                            onChange={(e) => setResumeText(e.target.value)}
                                            placeholder="Extracted resume text (you can edit)..."
                                            rows="8"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Job Description Input Section */}
                        <div className="input-group">
                            <label>Job Description *</label>
                            <div className="input-method-selector">
                                <button
                                    type="button"
                                    className={`method-btn ${jobDescInputMethod === 'text' ? 'active' : ''}`}
                                    onClick={() => setJobDescInputMethod('text')}
                                >
                                    📝 Paste Text
                                </button>
                                <button
                                    type="button"
                                    className={`method-btn ${jobDescInputMethod === 'url' ? 'active' : ''}`}
                                    onClick={() => setJobDescInputMethod('url')}
                                >
                                    🔗 From URL
                                </button>
                            </div>

                            {jobDescInputMethod === 'text' ? (
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description here..."
                                    rows="10"
                                />
                            ) : (
                                <div className="url-input-container">
                                    <div className="url-input-group">
                                        <input
                                            type="url"
                                            value={jobDescUrl}
                                            onChange={(e) => setJobDescUrl(e.target.value)}
                                            placeholder="https://www.linkedin.com/jobs/view/..."
                                            className="url-input"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleFetchJobDescription}
                                            className="fetch-btn"
                                            disabled={isLoading || !jobDescUrl}
                                        >
                                            {isLoading ? 'Fetching...' : '🔍 Fetch'}
                                        </button>
                                    </div>
                                    <small className="url-hint">
                                        Supported: LinkedIn, Indeed, Glassdoor, and most job boards
                                    </small>
                                    {jobDescription && (
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            placeholder="Fetched job description (you can edit)..."
                                            rows="8"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleTailorResume}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Tailoring Resume...' : '✨ Tailor My Resume'}
                        </button>

                        {isLoading && <Loading />}

                        {tailoredResume && (
                            <div className="result-section">
                                <div className="result-header">
                                    <h4>✅ Tailored Resume</h4>
                                    <div className="result-actions">
                                        <button
                                            className="btn-icon"
                                            onClick={() => copyToClipboard(tailoredResume)}
                                        >
                                            <FaClipboard /> Copy
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => downloadText(tailoredResume, 'tailored-resume.txt')}
                                        >
                                            <FaDownload /> Download
                                        </button>
                                    </div>
                                </div>
                                <div className="result-content">{tailoredResume}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Email Assistant */}
                {activeTab === 'email-assistant' && (
                    <div className="feature-section">
                        <h3>📧 Professional Email Response Generator</h3>
                        <p className="feature-description">
                            Generate professional, courteous responses to job-related emails
                        </p>

                        <div className="input-group">
                            <label>Email to Respond To *</label>
                            <textarea
                                value={emailContent}
                                onChange={(e) => setEmailContent(e.target.value)}
                                placeholder="Paste the email you received..."
                                rows="8"
                            />
                        </div>

                        <div className="input-group">
                            <label>Additional Context (Optional)</label>
                            <textarea
                                value={emailContext}
                                onChange={(e) => setEmailContext(e.target.value)}
                                placeholder="Any additional context or specific points to address..."
                                rows="4"
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleGenerateEmail}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Generating...' : '✨ Generate Response'}
                        </button>

                        {isLoading && <Loading />}

                        {emailResponse && (
                            <div className="result-section">
                                <div className="result-header">
                                    <h4>✅ Generated Email Response</h4>
                                    <div className="result-actions">
                                        <button
                                            className="btn-icon"
                                            onClick={() => copyToClipboard(emailResponse)}
                                        >
                                            <FaClipboard /> Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="result-content">{emailResponse}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Interview Prep */}
                {activeTab === 'interview-prep' && (
                    <div className="feature-section">
                        <h3>💼 Interview Preparation Generator</h3>
                        <p className="feature-description">
                            Get comprehensive interview questions, answers, and preparation tips
                        </p>

                        <div className="input-group">
                            <label>Job Description *</label>
                            <textarea
                                value={interviewJobDesc}
                                onChange={(e) => setInterviewJobDesc(e.target.value)}
                                placeholder="Paste the job description..."
                                rows="8"
                            />
                        </div>

                        <div className="input-group">
                            <label>Your Resume (Optional - for personalized answers)</label>
                            <textarea
                                value={interviewResume}
                                onChange={(e) => setInterviewResume(e.target.value)}
                                placeholder="Paste your resume for personalized answers..."
                                rows="6"
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleGenerateInterviewPrep}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Preparing Interview Guide...' : '✨ Generate Interview Prep'}
                        </button>

                        {isLoading && <Loading />}

                        {interviewPrep && (
                            <div className="result-section">
                                <div className="result-header">
                                    <h4>✅ Interview Preparation Guide</h4>
                                    <div className="result-actions">
                                        <button
                                            className="btn-icon"
                                            onClick={() => copyToClipboard(interviewPrep)}
                                        >
                                            <FaClipboard /> Copy
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => downloadText(interviewPrep, 'interview-prep.txt')}
                                        >
                                            <FaDownload /> Download
                                        </button>
                                    </div>
                                </div>
                                <div className="result-content markdown">{interviewPrep}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Resume Analysis */}
                {activeTab === 'resume-analysis' && (
                    <div className="feature-section">
                        <h3>📊 Resume Analysis & Feedback</h3>
                        <p className="feature-description">
                            Get detailed feedback, ATS compatibility check, and improvement suggestions
                        </p>

                        <div className="input-group">
                            <label>Your Resume *</label>
                            <textarea
                                value={analysisResume}
                                onChange={(e) => setAnalysisResume(e.target.value)}
                                placeholder="Paste your resume text here..."
                                rows="12"
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleAnalyzeResume}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Analyzing...' : '✨ Analyze My Resume'}
                        </button>

                        {isLoading && <Loading />}

                        {resumeAnalysis && (
                            <div className="result-section">
                                <div className="result-header">
                                    <h4>✅ Resume Analysis</h4>
                                    <div className="result-actions">
                                        <button
                                            className="btn-icon"
                                            onClick={() => copyToClipboard(resumeAnalysis)}
                                        >
                                            <FaClipboard /> Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="result-content">{resumeAnalysis}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Cover Letter */}
                {activeTab === 'cover-letter' && (
                    <div className="feature-section">
                        <h3>📝 Personalized Cover Letter Generator</h3>
                        <p className="feature-description">
                            Create compelling, tailored cover letters that get interviews
                        </p>

                        <div className="input-group">
                            <label>Your Resume *</label>
                            <textarea
                                value={coverLetterResume}
                                onChange={(e) => setCoverLetterResume(e.target.value)}
                                placeholder="Paste your resume text here..."
                                rows="8"
                            />
                        </div>

                        <div className="input-group">
                            <label>Job Description *</label>
                            <textarea
                                value={coverLetterJobDesc}
                                onChange={(e) => setCoverLetterJobDesc(e.target.value)}
                                placeholder="Paste the job description..."
                                rows="8"
                            />
                        </div>

                        <div className="input-group">
                            <label>Company Name (Optional)</label>
                            <input
                                type="text"
                                value={coverLetterCompany}
                                onChange={(e) => setCoverLetterCompany(e.target.value)}
                                placeholder="e.g., Google, Microsoft..."
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleGenerateCoverLetter}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Writing Cover Letter...' : '✨ Generate Cover Letter'}
                        </button>

                        {isLoading && <Loading />}

                        {generatedCoverLetter && (
                            <div className="result-section">
                                <div className="result-header">
                                    <h4>✅ Your Cover Letter</h4>
                                    <div className="result-actions">
                                        <button
                                            className="btn-icon"
                                            onClick={() => copyToClipboard(generatedCoverLetter)}
                                        >
                                            <FaClipboard /> Copy
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => downloadText(generatedCoverLetter, 'cover-letter.txt')}
                                        >
                                            <FaDownload /> Download
                                        </button>
                                    </div>
                                </div>
                                <div className="result-content">{generatedCoverLetter}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default AIAssistant;
