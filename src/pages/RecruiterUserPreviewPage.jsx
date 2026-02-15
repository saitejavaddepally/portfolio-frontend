import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Loader from '../components/Loader';
import MediumTemplate from '../templates/Medium';
import ModernTemplate from '../templates/Modern';
import { initialData } from '../data/initialData';

const RecruiterUserPreviewPage = ({ theme, toggleTheme }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPortfolio = async () => {
            // ...

            try {
                const response = await apiClient.get(`/recruiter/professionals/${id}`);
                // Extract portfolio data from the user object
                const userObject = response.data || {};
                const fetchedData = userObject.portfolio?.data || {};

                // Deep merge or ensure essential sections exist
                const mergedData = {
                    ...initialData,
                    ...fetchedData,
                    hero: { ...initialData.hero, ...(fetchedData.hero || {}) },
                    // Ensure header is null if no data exists, so template falls back to hero.name
                    header: (fetchedData.header || initialData.header)
                        ? { ...(initialData.header || {}), ...(fetchedData.header || {}) }
                        : null,
                    experience: fetchedData.experience || [],
                    education: fetchedData.education || [],
                    projects: fetchedData.projects || [],
                    skills: fetchedData.skills || [],
                    achievements: { ...initialData.achievements, ...(fetchedData.achievements || {}) },
                    socials: fetchedData.socials || initialData.socials,
                    footer: { ...initialData.footer, ...(fetchedData.footer || {}) }
                };

                setUserData(mergedData);
                console.log("Recruiter Preview Debug:");
                console.log("API Response:", response.data);
                console.log("Fetched Portfolio Data:", fetchedData);
                console.log("Merged Data for Template:", mergedData);
            } catch (err) {
                console.error("Failed to fetch user portfolio:", err);
                setError("Failed to load portfolio. User might not exist or you don't have permission.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserPortfolio();
        }
    }, [id]);

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
        <div className="recruiter-preview-wrapper" style={{ position: 'relative' }}>
            {/* Recruiter Navigation Bar Overlay */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
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
            </div>

            {/* Reuse existing templates just like public view */}
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
    );
};

export default RecruiterUserPreviewPage;
