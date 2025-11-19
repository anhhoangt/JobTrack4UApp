import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormRow, FormRowSelect, Alert, Loading } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import axios from 'axios';

const AddTemplate = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get('id');
    const isEditing = Boolean(templateId);

    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [alertType, setAlertType] = useState('success');

    // Form state
    const [name, setName] = useState('');
    const [type, setType] = useState('email');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');

    const templateTypes = [
        'cover-letter',
        'email',
        'follow-up',
        'thank-you',
        'networking',
        'referral-request',
        'resignation',
        'acceptance',
        'decline',
        'other',
    ];

    // Common variables that can be used in templates
    const commonVariables = [
        '{{yourName}}',
        '{{yourEmail}}',
        '{{yourPhone}}',
        '{{yourLocation}}',
        '{{companyName}}',
        '{{position}}',
        '{{hiringManager}}',
        '{{date}}',
        '{{currentDate}}',
    ];

    useEffect(() => {
        if (isEditing) {
            fetchTemplate();
        }
        // eslint-disable-next-line
    }, [templateId]);

    const fetchTemplate = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/v1/templates/${templateId}`);
            const template = response.data.template;

            setName(template.name);
            setType(template.type);
            setSubject(template.subject || '');
            setContent(template.content);
            setDescription(template.description || '');
        } catch (error) {
            console.error('Error fetching template:', error);
            displayAlert('Failed to load template', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    const displayAlert = (text = 'Success!', type = 'success') => {
        setAlertText(text);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !content) {
            displayAlert('Please provide template name and content', 'danger');
            return;
        }

        setIsLoading(true);

        try {
            const templateData = {
                name,
                type,
                subject,
                content,
                description,
            };

            if (isEditing) {
                await axios.patch(`/api/v1/templates/${templateId}`, templateData);
                displayAlert('Template updated successfully');
            } else {
                await axios.post('/api/v1/templates', templateData);
                displayAlert('Template created successfully');
            }

            setTimeout(() => {
                navigate('/templates');
            }, 1500);
        } catch (error) {
            console.error('Error saving template:', error);
            displayAlert(
                error.response?.data?.msg || 'Failed to save template',
                'danger'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const insertVariable = (variable) => {
        setContent(content + variable);
    };

    if (isLoading && isEditing) {
        return <Loading center />;
    }

    return (
        <Wrapper>
            <form className="form" onSubmit={handleSubmit}>
                <h3>{isEditing ? 'Edit Template' : 'Create Template'}</h3>
                {showAlert && <Alert alertText={alertText} alertType={alertType} />}

                <div className="form-center">
                    <FormRow
                        type="text"
                        name="name"
                        labelText="Template Name"
                        value={name}
                        handleChange={(e) => setName(e.target.value)}
                    />

                    <FormRowSelect
                        labelText="Template Type"
                        name="type"
                        value={type}
                        handleChange={(e) => setType(e.target.value)}
                        list={templateTypes}
                    />

                    {(type !== 'cover-letter') && (
                        <FormRow
                            type="text"
                            name="subject"
                            labelText="Email Subject (Optional)"
                            value={subject}
                            handleChange={(e) => setSubject(e.target.value)}
                        />
                    )}

                    <FormRow
                        type="text"
                        name="description"
                        labelText="Description (Optional)"
                        value={description}
                        handleChange={(e) => setDescription(e.target.value)}
                    />

                    {/* Variables Help */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Available Variables</label>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginBottom: '1rem',
                            padding: '1rem',
                            background: 'var(--grey-50)',
                            borderRadius: 'var(--borderRadius)',
                        }}>
                            {commonVariables.map((variable, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => insertVariable(variable + ' ')}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        background: 'var(--primary-100)',
                                        color: 'var(--primary-700)',
                                        border: '1px solid var(--primary-300)',
                                        borderRadius: '4px',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {variable}
                                </button>
                            ))}
                        </div>
                        <small style={{ color: 'var(--grey-500)' }}>
                            Click any variable to insert it into your template content below
                        </small>
                    </div>

                    {/* Content Textarea */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="content" className="form-label">
                            Template Content *
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="15"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--grey-300)',
                                borderRadius: 'var(--borderRadius)',
                                fontFamily: 'inherit',
                                fontSize: '0.875rem',
                                lineHeight: '1.6',
                                resize: 'vertical',
                            }}
                            placeholder="Enter your template content here. Use variables like {{companyName}} and {{position}} for dynamic content..."
                        />
                        <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--grey-500)' }}>
                            Character count: {content.length}/5000
                        </small>
                    </div>

                    <div className="btn-container" style={{ gridColumn: '1 / -1' }}>
                        <button
                            type="submit"
                            className="btn btn-block"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : isEditing ? 'Update Template' : 'Create Template'}
                        </button>
                        <button
                            type="button"
                            className="btn clear-btn btn-block"
                            onClick={() => navigate('/templates')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </Wrapper>
    );
};

export default AddTemplate;
