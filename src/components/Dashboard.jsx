import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Components.css';
import '../css/Dashboard.css';
import Loader from './Loader';
import { useToast } from '../context/ToastContext';

const templates = [
    {
        id: 'medium',
        name: 'Medium Aesthetic',
        description: 'Clean, editorial style with heavy focus on typography and whitespace.',
        image: '/assets/medium-preview.png',
        tags: ['Minimalist', 'Editorial']
    },
    {
        id: 'modern',
        name: 'Modern Dev',
        description: 'Dark mode friendly, colorful, and card-based design.',
        image: '/assets/modern-preview.png',
        tags: ['Dark Mode', 'Vibrant']
    }
];

const Dashboard = ({ activeTemplate, onSelectTemplate, isPublished, publicUrl, onPublishUpdate, onPublish, onDeployTemplate, userData }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [deployingId, setDeployingId] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');

    // Derived data for previews
    const userName = userData?.hero?.name || userData?.header?.name || 'Your Name';
    const userTitle = userData?.hero?.headline || (userData?.hero?.roles && userData.hero.roles[0]) || 'Creative Professional';
    const userDesc = userData?.hero?.description || userData?.hero?.intro?.text || 'Passionate about building scalable applications...';

    const handleDeploy = async (templateId) => {
        if (onDeployTemplate) {
            try {
                setDeployingId(templateId);
                await onDeployTemplate(templateId);
                addToast(`Successfully deployed ${templateId} template live!`, 'success');
            } catch (error) {
                console.error("Deploy error:", error);
                const msg = error.response?.data?.message || error.message || "Unknown error";
                addToast(`Failed to deploy template: ${msg}`, 'error');
            } finally {
                setDeployingId(null);
            }
        } else {
            onSelectTemplate(templateId);
        }
    };

    const copyToClipboard = () => {
        if (!publicUrl) return;

        const fullUrl = publicUrl.startsWith('http') ? publicUrl : `${window.location.origin}${publicUrl}`;

        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopySuccess('Copied!');
            addToast('Link copied to clipboard', 'info', 2000);
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="dashboard-container">

            <header className="dashboard-header">
                <div className="dashboard-header-content">
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Select a professional template and deploy your portfolio in seconds.
                    </p>

                    {/* Global Publish Status/Action */}
                    <div className="publish-actions">
                        {publicUrl && (
                            <div className="public-link-container">
                                <span className="status-dot live"></span>
                                <span className="live-text">Live</span>
                                <div className="link-wrapper">
                                    <input
                                        type="text"
                                        readOnly
                                        value={publicUrl.startsWith('http') ? publicUrl : `${window.location.origin}${publicUrl}`}
                                        className="public-link-input"
                                    />
                                    <button onClick={copyToClipboard} className="copy-btn">
                                        {copySuccess || 'Copy'}
                                    </button>
                                </div>
                                <a
                                    href={publicUrl.startsWith('http') ? publicUrl : `${window.location.origin}${publicUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="open-link-icon"
                                    title="Open Public Page"
                                >
                                    ↗
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-header-image-container">
                    <img
                        src="/assets/projects.svg"
                        alt="Dashboard Hero"
                        className="dashboard-header-image"
                    />
                </div>
            </header>

            <div className="dashboard-grid">
                {templates.map(template => {
                    const isDeployed = activeTemplate === template.id && isPublished;
                    const isDeploying = deployingId === template.id;

                    return (
                        <div
                            key={template.id}
                            className={`template-card ${isDeployed ? 'deployed' : 'not-deployed'}`}
                            onClick={() => {
                                if (template.id !== 'medium') {
                                    addToast(`✏️ Editing ${template.name} — redirecting to the Medium editor. Your changes apply to all templates.`, 'info', 4000);
                                    navigate(`/?portfolioStyle=medium&edit=true`);
                                } else {
                                    navigate(`/?portfolioStyle=medium&edit=true`);
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Deployed Badge */}
                            {isDeployed && (
                                <div className="deployed-badge">
                                    Live
                                </div>
                            )}

                            {/* Preview Area */}
                            <div className="preview-area">
                                {template.id === 'medium' ? (
                                    <div className="preview-medium">
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{userName}</div>
                                        <div style={{ fontSize: '0.8rem', lineHeight: '1.4', color: '#444' }}>{userDesc}</div>
                                        <div style={{ marginTop: '1.5rem', width: '30px', height: '2px', background: '#000' }}></div>
                                    </div>
                                ) : template.id === 'modern' ? (
                                    <div className="preview-modern">
                                        <div className="preview-modern-title">{userName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{userTitle}</div>
                                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }}></div>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8' }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="preview-default">
                                        No Preview
                                    </div>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="content-area">
                                <h3 className="template-name">{template.name}</h3>
                                <p className="template-desc">
                                    {template.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="action-buttons">

                                    {/* Row 1: Preview & Edit */}
                                    <div className="button-row">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/?portfolioStyle=${template.id}`);
                                            }}
                                            className="outline-btn"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (template.id !== 'medium') {
                                                    addToast(`✏️ All edits happen in the Medium Editor — your data powers every template. Redirecting now.`, 'info', 4000);
                                                }
                                                navigate(`/?portfolioStyle=medium&edit=true`);
                                            }}
                                            className="outline-btn"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    {/* Row 2: Select/Active */}
                                    {isDeployed ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (publicUrl) {
                                                    const url = publicUrl.startsWith('http') ? publicUrl : `${window.location.origin}${publicUrl}`;
                                                    window.open(url, '_blank');
                                                }
                                            }}
                                            className="deploy-btn active"
                                        >
                                            View Live Site ↗
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeploy(template.id);
                                            }}
                                            disabled={isDeploying}
                                            className="deploy-btn inactive"
                                        >
                                            {isDeploying ? 'Deploying...' : 'Deploy Live'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
};
export default Dashboard;
