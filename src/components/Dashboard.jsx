import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../css/Components.css';
import '../css/Dashboard.css';
import { useToast } from '../context/ToastContext';
import ResumeAutoFill from './resume/ResumeAutoFill';

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
    },
    {
        id: 'google',
        name: 'Search Engine',
        description: 'Familiar, trust-worthy search results layout.',
        image: '/assets/google-preview.png',
        tags: ['Clean', 'Professional']
    },
    {
        id: 'instagram',
        name: 'Social Profile',
        description: 'Visual-first design for creators and influencers.',
        image: '/assets/insta-preview.png',
        tags: ['Visual', 'Modern']
    },
    {
        id: 'terminal',
        name: 'Dev Terminal',
        description: 'Retro command line interface for developers.',
        image: '/assets/terminal-preview.png',
        tags: ['Hacker', 'Retro']
    }
];

const Dashboard = ({ activeTemplate, onSelectTemplate, isPublished, publicUrl, onPublishUpdate, onPublish, onDeployTemplate, userData, setUserData }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [deployingId, setDeployingId] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [showResumeModal, setShowResumeModal] = useState(false);

    const handleResumeParsed = (parsedData) => {
        if (!setUserData) {
            console.error("setUserData not provided");
            return;
        }

        const newSkills = parsedData.skills || [];
        const existingSkills = Array.isArray(userData?.skills) ? userData.skills : [];
        const mergedSkills = Array.from(new Set([...existingSkills, ...newSkills]));

        const updatedData = {
            ...userData,
            personalInfo: {
                ...(userData?.personalInfo || {}),
                ...(parsedData.personalInfo || {}),
                location: parsedData.personalInfo?.location || userData?.personalInfo?.location || ''
            },
            hero: {
                ...(userData?.hero || {}),
                name: parsedData.personalInfo?.fullName || userData?.hero?.name || ''
            },
            skills: mergedSkills,
            experience: parsedData.experience?.length > 0 ? parsedData.experience : (userData?.experience || []),
            education: parsedData.education?.length > 0 ? parsedData.education : (userData?.education || []),
            projects: parsedData.projects?.length > 0 ? parsedData.projects : (userData?.projects || []),
            achievements: parsedData.achievements || userData?.achievements,
            codingProfiles: parsedData.codingProfiles?.length > 0 ? parsedData.codingProfiles : (userData?.codingProfiles || [])
        };

        if (!updatedData.hero.contacts) updatedData.hero.contacts = [];
        const emails = updatedData.hero.contacts.filter(c => c.type === 'email').map(c => c.value);
        if (parsedData.personalInfo?.email && !emails.includes(parsedData.personalInfo.email)) {
            updatedData.hero.contacts.push({ type: 'email', value: parsedData.personalInfo.email, label: 'Email' });
        }
        const phones = updatedData.hero.contacts.filter(c => c.type === 'phone').map(c => c.value);
        if (parsedData.personalInfo?.phone && !phones.includes(parsedData.personalInfo.phone)) {
            updatedData.hero.contacts.push({ type: 'phone', value: parsedData.personalInfo.phone, label: 'Phone' });
        }

        const existingSocials = [...(updatedData.socials || [])];
        if (parsedData.personalInfo?.linkedin) {
            const li = existingSocials.find(s => s.name.toLowerCase() === 'linkedin');
            if (li) li.url = parsedData.personalInfo.linkedin;
            else existingSocials.push({ name: 'LinkedIn', icon: 'fab fa-linkedin', url: parsedData.personalInfo.linkedin });
        }
        if (parsedData.personalInfo?.github) {
            const gh = existingSocials.find(s => s.name.toLowerCase() === 'github');
            if (gh) gh.url = parsedData.personalInfo.github;
            else existingSocials.push({ name: 'GitHub', icon: 'fab fa-github', url: parsedData.personalInfo.github });
        }
        updatedData.socials = existingSocials;

        setUserData(updatedData);
        setShowResumeModal(false);
        addToast("Redirecting to editor to review parsed data...", "info", 3000);
        setTimeout(() => navigate(`/? portfolioStyle = medium & edit=true`), 800);
    };

    // Derived data for previews
    const userName = userData?.hero?.name || userData?.header?.name || 'Your Name';
    const userTitle = userData?.hero?.headline || (userData?.hero?.roles && userData.hero.roles[0]) || 'Creative Professional';
    const userDesc = userData?.hero?.description || userData?.hero?.intro?.text || 'Passionate about building scalable applications...';

    const handleDeploy = async (templateId) => {
        if (onDeployTemplate) {
            try {
                setDeployingId(templateId);
                await onDeployTemplate(templateId);
                addToast(`"${templateId}" look is now live!`, 'success');
            } catch (error) {
                console.error("Deploy error:", error);
                const msg = error.response?.data?.message || error.message || "Unknown error";
                addToast(`Could not publish your portfolio: ${msg} `, 'error');
            } finally {
                setDeployingId(null);
            }
        } else {
            onSelectTemplate(templateId);
        }
    };

    const copyToClipboard = () => {
        if (!publicUrl) return;

        const fullUrl = publicUrl.startsWith('http') ? publicUrl : `${window.location.origin}${publicUrl} `;

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
                        Pick a style and share your portfolio with the world.
                    </p>

                    {/* Global Publish Status/Action */}
                    <div className="publish-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                        <button
                            className="dashboard-primary-btn"
                            style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            onClick={() => setShowResumeModal(true)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Auto-fill with Resume
                        </button>

                        {publicUrl && (
                            <div className="public-link-container">
                                <span className="status-dot live"></span>
                                <span className="live-text">Live</span>
                                <div className="link-wrapper">
                                    <input
                                        type="text"
                                        readOnly
                                        value={publicUrl.startsWith('http') ? publicUrl : `${window.location.origin}${publicUrl} `}
                                        className="public-link-input"
                                    />
                                    <button onClick={copyToClipboard} className="copy-btn">
                                        {copySuccess || 'Copy'}
                                    </button>
                                </div>
                                <a
                                    href={publicUrl.startsWith('http') ? publicUrl : `${window.location.origin}${publicUrl} `}
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

            {showResumeModal && createPortal(
                <div className="modal-overlay" onClick={() => setShowResumeModal(false)}>
                    <div
                        className="modal-box"
                        style={{ padding: 0, maxWidth: '650px', background: 'transparent', border: 'none', boxShadow: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowResumeModal(false)}
                                style={{ position: 'absolute', top: '2rem', right: '2.5rem', background: 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', zIndex: 10, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}
                                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <ResumeAutoFill onParsed={handleResumeParsed} />
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <div className="dashboard-grid">
                {templates.map(template => {
                    const isDeployed = activeTemplate === template.id && isPublished;
                    const isDeploying = deployingId === template.id;

                    return (
                        <div
                            key={template.id}
                            className={`template - card ${isDeployed ? 'deployed' : 'not-deployed'} `}
                            onClick={() => {
                                // Card click → preview
                                navigate(`/? portfolioStyle = ${template.id} `);
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
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>{userName}</div>
                                        <div style={{ fontSize: '0.7rem', lineHeight: '1.4', color: '#444' }}>{userDesc ? userDesc.substring(0, 60) + '...' : ''}</div>
                                        <div style={{ marginTop: '1rem', width: '25px', height: '2px', background: '#000' }}></div>
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
                                ) : template.id === 'google' ? (
                                    <div style={{ background: '#fff', padding: '15px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ border: '1px solid #dfe1e5', borderRadius: '20px', padding: '4px 10px', fontSize: '0.6rem', color: '#5f6368' }}>🔍 {userName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#1a0dab' }}>{userTitle || 'Portfolio'}</div>
                                        <div style={{ fontSize: '0.6rem', color: '#545454' }}>About 1,300,000 results...</div>
                                    </div>
                                ) : template.id === 'instagram' ? (
                                    <div style={{ background: '#fff', padding: '15px', height: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#dbdbdb' }}></div>
                                            <div style={{ flex: 1, height: '4px', background: '#dbdbdb' }}></div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                                            <div style={{ height: '30px', background: '#efefef' }}></div>
                                            <div style={{ height: '30px', background: '#efefef' }}></div>
                                            <div style={{ height: '30px', background: '#efefef' }}></div>
                                            <div style={{ height: '30px', background: '#efefef' }}></div>
                                            <div style={{ height: '30px', background: '#efefef' }}></div>
                                            <div style={{ height: '30px', background: '#efefef' }}></div>
                                        </div>
                                    </div>
                                ) : template.id === 'terminal' ? (
                                    <div style={{ background: '#0d1117', padding: '15px', height: '100%', color: '#7ee787', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                        <div>visitor@portfolio:~$</div>
                                        <div style={{ color: '#c9d1d9' }}>whoami</div>
                                        <div style={{ color: '#79c0ff', marginTop: '4px' }}>{userName || 'user'}</div>
                                        <div style={{ marginTop: '8px' }}>_</div>
                                    </div>
                                ) : null}
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
                                            View My Page ↗
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
                                            {isDeploying ? 'Publishing…' : 'Publish & Go Live'}
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
