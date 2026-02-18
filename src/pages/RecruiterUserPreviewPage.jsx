import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';
import MediumTemplate from '../templates/Medium';
import ModernTemplate from '../templates/Modern';
import { initialData } from '../data/initialData';
import AIChatPanel from '../components/AIChatPanel';

const RecruiterUserPreviewPage = ({ theme, toggleTheme }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Helper to process and normalize user data
    const processData = (rawUserObject) => {
        let fetchedData = {};

        // Handle various data structures
        if (rawUserObject.userData?.portfolio?.data) {
            fetchedData = rawUserObject.userData.portfolio.data;
        } else if (rawUserObject.userData?.portfolio) {
            fetchedData = rawUserObject.userData.portfolio;
        } else if (rawUserObject.data && rawUserObject.data.hero) {
            fetchedData = rawUserObject.data;
        } else if (rawUserObject.portfolio && rawUserObject.portfolio.data) {
            fetchedData = rawUserObject.portfolio.data;
        } else {
            fetchedData = rawUserObject; // Fallback
        }

        // Deep merge with initialData
        return {
            ...initialData,
            ...fetchedData,
            hero: { ...initialData.hero, ...(fetchedData.hero || {}) },
            header: (fetchedData.header || initialData.header)
                ? { ...(initialData.header || {}), ...(fetchedData.header || {}) }
                : null,
            experience: fetchedData.experience || [],
            education: fetchedData.education || [],
            projects: fetchedData.projects || [],
            skills: fetchedData.skills || [],
            achievements: { ...initialData.achievements, ...(fetchedData.achievements || {}) },
            socials: fetchedData.socials || initialData.socials,
            footer: { ...initialData.footer, ...(fetchedData.footer || {}) },
            email: rawUserObject.email || rawUserObject.userData?.email || '',
            // Preserve the template preference
            activeTemplate: fetchedData.activeTemplate || rawUserObject.activeTemplate || 'medium'
        };
    };

    useEffect(() => {
        const loadPortfolio = async () => {
            // OPTION 1: Use data passed from Dashboard (Instant Load)
            if (location.state?.userData) {
                console.log("Using passed state data:", location.state.userData);
                const processed = processData(location.state.userData);
                setUserData(processed);
                setLoading(false);
                return;
            }

            // OPTION 2: Fetch from API (Fallback)
            try {
                const response = await apiClient.get(`/recruiter/professionals/${id}`);
                const userObject = response.data || {};
                const processed = processData(userObject);
                setUserData(processed);
            } catch (err) {
                console.error("Failed to fetch user portfolio:", err);
                setError("Failed to load portfolio. User might not exist or you don't have permission.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadPortfolio();
        }
    }, [id, location.state]);

    if (loading) return <Loader fullScreen={true} />;

    if (error) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
            }}>
                <h2>❌ Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/recruiter/dashboard')}
                    style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1.5rem',
                        background: '#38bdf8',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!userData) return null;

    // Determine Template
    const activeTemplate = userData.activeTemplate || 'medium';
    const Template = activeTemplate === 'modern' ? ModernTemplate : MediumTemplate;



    return (
        <div className="recruiter-preview-wrapper" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            background: 'var(--bg-primary)'
        }}>
            {/* Full Width Profile Preview */}
            <div className="profile-preview-panel" style={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                position: 'relative'
            }}>
                {/* Recruiter Navigation Bar Overlay */}
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 9998,
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    display: 'flex',
                    gap: '15px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Recruiter View</span>
                    <button
                        onClick={() => navigate('/recruiter/dashboard')}
                        style={{
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '5px 15px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Back to List
                    </button>
                    {/* Theme Toggle within Recruiter View */}
                    <button
                        onClick={toggleTheme}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>

                <GlobalStyleOverrides />

                <Template
                    data={userData}
                    isEditing={false} // Recruiter cannot edit
                    updateData={() => { }} // No-op
                    setUserData={() => { }} // No-op
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onArrayUpdate={() => { }} // No-op
                />
            </div>

            {/* Chat Floating Action Button */}
            {!isChatOpen && (
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {/* Tooltip / Prompt Bubble */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        padding: '10px 15px',
                        borderRadius: '12px',
                        borderBottomRightRadius: '2px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        maxWidth: '200px',
                        position: 'relative',
                        border: '1px solid var(--border-color)',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        Hey, ask me about this profile to know more about the candidate!
                    </div>

                    <button
                        onClick={() => setIsChatOpen(true)}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'var(--text-main)', // Use theme color
                            color: 'var(--bg-primary)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title="Open AI Assistant"
                        className="animate-scale-in"
                    >
                        ✨
                    </button>
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </div>
            )}

            {/* Chat Interface Overlay - Bubble Format */}
            {isChatOpen && (
                <div className="chat-overlay" style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    width: '380px',
                    maxWidth: 'calc(100vw - 40px)', // Responsive on mobile
                    height: '600px',
                    maxHeight: 'calc(100vh - 120px)',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    zIndex: 10000,
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <AIChatPanel
                        candidateData={userData}
                        candidateEmail={userData.email}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

// Helper to remove unwanted global scrolls on mount
const GlobalStyleOverrides = () => (
    <style>{`
        body { overflow: hidden; } /* Prevent main scrollbar */
        .medium-template .site-header { position: sticky; top: 0; } /* Keep sticky header behavior in scrollable div */
    `}</style>
);

export default RecruiterUserPreviewPage;
