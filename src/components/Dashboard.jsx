import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Components.css';
import '../css/Dashboard.css'; // Import the new CSS
import { publishPortfolio } from '../services/portfolioService';

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

const Dashboard = ({ activeTemplate, onSelectTemplate, isPublished, publicUrl, onPublishUpdate, onPublish, onDeployTemplate }) => {
    const navigate = useNavigate();
    const [deployingId, setDeployingId] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');

    // activeTemplate is the DEPLOYED template (at root)

    const handleDeploy = async (templateId) => {
        if (onDeployTemplate) {
            try {
                setDeployingId(templateId);
                await onDeployTemplate(templateId);
                alert(`Successfully deployed ${templateId} template live!`);
            } catch (error) {
                console.error("Deploy error:", error);
                const msg = error.response?.data?.message || error.message || "Unknown error";
                alert(`Failed to deploy template: ${msg}`);
            } finally {
                setDeployingId(null);
            }
        } else {
            // Fallback for older usage if any
            onSelectTemplate(templateId);
        }
    };

    const copyToClipboard = () => {
        if (!publicUrl) return;

        // Ensure we copy the absolute URL
        // If publicUrl is relative path from backend (e.g., /p/slug), prepend origin
        // If it's absolute, use as is.
        const fullUrl = publicUrl.startsWith('http') ? publicUrl : `${window.location.origin}${publicUrl}`;

        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h1 className="dashboard-title">Portfolio Builder</h1>
                        <p className="dashboard-subtitle">Select and deploy a template for your portfolio</p>
                    </div>

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
            </header>

            <div className="dashboard-grid">
                {templates.map(template => {
                    const isDeployed = activeTemplate === template.id && isPublished;
                    const isDeploying = deployingId === template.id;

                    return (
                        <div key={template.id} className={`template-card ${isDeployed ? 'deployed' : 'not-deployed'}`}>
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
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Saiteja V.</div>
                                        <div style={{ fontSize: '0.8rem', lineHeight: '1.4', color: '#444' }}>Passionate about building scalable applications...</div>
                                        <div style={{ marginTop: '1.5rem', width: '30px', height: '2px', background: '#000' }}></div>
                                    </div>
                                ) : template.id === 'modern' ? (
                                    <div className="preview-modern">
                                        <div className="preview-modern-title">Saiteja V.</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AI Engineer & Full Stack Dev</div>
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
                                            onClick={() => navigate(`/?portfolioStyle=${template.id}`)}
                                            className="outline-btn"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => navigate(`/?portfolioStyle=${template.id}&edit=true`)}
                                            className="outline-btn"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    {/* Row 2: Select/Active */}
                                    {isDeployed ? (
                                        <button
                                            onClick={() => {
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
                                            onClick={() => handleDeploy(template.id)}
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
        </div>
    );
};
export default Dashboard;
