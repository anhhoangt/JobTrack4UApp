import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/TemplatesPage';
import { FaPlus, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { Alert, Loading } from '../../components';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('success');

    const templateTypes = [
        { value: 'all', label: 'All Templates' },
        { value: 'cover-letter', label: 'Cover Letters' },
        { value: 'email', label: 'General Emails' },
        { value: 'follow-up', label: 'Follow-up' },
        { value: 'thank-you', label: 'Thank You' },
        { value: 'networking', label: 'Networking' },
        { value: 'referral-request', label: 'Referral Request' },
        { value: 'other', label: 'Other' },
    ];

    useEffect(() => {
        fetchTemplates();
    }, [filterType]);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const url = filterType === 'all'
                ? '/api/v1/templates'
                : `/api/v1/templates?type=${filterType}`;

            const response = await axios.get(url);
            setTemplates(response.data.templates);
        } catch (error) {
            console.error('Error fetching templates:', error);
            displayAlert('Failed to load templates', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await axios.delete(`/api/v1/templates/${id}`);
            displayAlert('Template deleted successfully');
            fetchTemplates();
        } catch (error) {
            displayAlert('Failed to delete template', 'danger');
        }
    };

    const handleToggleFavorite = async (id) => {
        try {
            await axios.patch(`/api/v1/templates/${id}/favorite`);
            fetchTemplates();
        } catch (error) {
            displayAlert('Failed to update favorite status', 'danger');
        }
    };

    const handleDuplicate = async (id) => {
        try {
            await axios.post(`/api/v1/templates/${id}/duplicate`);
            displayAlert('Template duplicated successfully');
            fetchTemplates();
        } catch (error) {
            displayAlert('Failed to duplicate template', 'danger');
        }
    };

    const displayAlert = (text = 'Success!', type = 'success') => {
        setAlertText(text);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const formatType = (type) => {
        return type.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    if (isLoading) {
        return <Loading center />;
    }

    return (
        <Wrapper>
            {showAlert && <Alert alertText={alertText} alertType={alertType} />}

            <div className="templates-header">
                <div className="header-content">
                    <h2>Email & Cover Letter Templates</h2>
                    <p>Create reusable templates with variable substitution for job applications</p>
                </div>
                <Link to="/add-template" className="btn btn-primary">
                    <FaPlus /> Create Template
                </Link>
            </div>

            <div className="filter-section">
                <div className="filter-group">
                    <FaFilter />
                    <label>Filter by Type:</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        {templateTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                <span className="template-count">{templates.length} templates</span>
            </div>

            {templates.length === 0 ? (
                <div className="no-templates">
                    <p>No templates found. Create your first template to get started!</p>
                    <Link to="/add-template" className="btn">
                        <FaPlus /> Create Your First Template
                    </Link>
                </div>
            ) : (
                <div className="templates-grid">
                    {templates.map((template) => (
                        <div key={template._id} className={`template-card ${template.isFavorite ? 'favorite' : ''}`}>
                            <div className="template-header">
                                <div>
                                    <h4>{template.name}</h4>
                                    <span className="template-type">{formatType(template.type)}</span>
                                </div>
                                <button
                                    className={`favorite-btn ${template.isFavorite ? 'active' : ''}`}
                                    onClick={() => handleToggleFavorite(template._id)}
                                    title={template.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    ★
                                </button>
                            </div>

                            {template.subject && (
                                <div className="template-subject">
                                    <strong>Subject:</strong> {template.subject}
                                </div>
                            )}

                            {template.description && (
                                <p className="template-description">{template.description}</p>
                            )}

                            <div className="template-content-preview">
                                {template.content.substring(0, 150)}
                                {template.content.length > 150 && '...'}
                            </div>

                            {template.variables && template.variables.length > 0 && (
                                <div className="template-variables">
                                    <strong>Variables:</strong>
                                    <div className="variables-list">
                                        {template.variables.slice(0, 5).map((variable, index) => (
                                            <span key={index} className="variable-tag">
                                                {`{{${variable}}}`}
                                            </span>
                                        ))}
                                        {template.variables.length > 5 && (
                                            <span className="more-variables">
                                                +{template.variables.length - 5} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="template-meta">
                                <span>Used {template.usageCount || 0} times</span>
                                <span>•</span>
                                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="template-actions">
                                <Link
                                    to={`/template/${template._id}`}
                                    className="action-btn view"
                                >
                                    View
                                </Link>
                                <Link
                                    to={`/add-template?id=${template._id}`}
                                    className="action-btn edit"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDuplicate(template._id)}
                                    className="action-btn duplicate"
                                >
                                    Duplicate
                                </button>
                                <button
                                    onClick={() => handleDelete(template._id, template.name)}
                                    className="action-btn delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Wrapper>
    );
};

export default Templates;
