import { FaFilePdf, FaFileWord, FaFileDownload, FaTrash, FaStar, FaRegStar, FaEdit } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/ResumeList';

const ResumeList = ({
    resumes,
    onDelete,
    onSetDefault,
    onUpdateCategory
}) => {
    if (!resumes || resumes.length === 0) {
        return (
            <Wrapper>
                <div className="no-resumes">
                    <p>No resumes uploaded yet. Upload your first resume to get started!</p>
                </div>
            </Wrapper>
        );
    }

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') {
            return <FaFilePdf className="file-icon pdf" />;
        }
        return <FaFileWord className="file-icon word" />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCategory = (category) => {
        if (!category) return 'General';
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <Wrapper>
            <div className="resumes-grid">
                {resumes.map((resume) => (
                    <div key={resume._id} className={`resume-card ${resume.isDefault ? 'default' : ''}`}>
                        {/* Default badge */}
                        {resume.isDefault && (
                            <div className="default-badge">
                                <FaStar /> Default
                            </div>
                        )}

                        {/* Resume header */}
                        <div className="resume-header">
                            {getFileIcon(resume.fileName)}
                            <div className="resume-info">
                                <h4 className="resume-filename">{resume.fileName}</h4>
                                <span className="resume-category">{formatCategory(resume.category)}</span>
                            </div>
                        </div>

                        {/* Resume meta */}
                        <div className="resume-meta">
                            <span className="upload-date">
                                Uploaded: {formatDate(resume.uploadDate)}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="resume-actions">
                            <a
                                href={resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn download"
                                title="View/Download"
                            >
                                <FaFileDownload /> Download
                            </a>

                            {!resume.isDefault && (
                                <button
                                    type="button"
                                    className="action-btn set-default"
                                    onClick={() => onSetDefault(resume._id)}
                                    title="Set as default"
                                >
                                    <FaRegStar /> Set Default
                                </button>
                            )}

                            <button
                                type="button"
                                className="action-btn edit"
                                onClick={() => onUpdateCategory(resume)}
                                title="Edit category"
                            >
                                <FaEdit /> Edit
                            </button>

                            <button
                                type="button"
                                className="action-btn delete"
                                onClick={() => onDelete(resume._id, resume.fileName)}
                                title="Delete resume"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Wrapper>
    );
};

export default ResumeList;
