import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import UserCard from '../components/UserCard';
import Loader from '../components/Loader';
import '../css/Recruiter.css';

const RecruiterDashboardPage = ({ theme, toggleTheme }) => {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const response = await apiClient.get('/recruiter/professionals');
                // Assuming response.data is the array of users, or response.data.data
                const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
                setProfessionals(data);
            } catch (err) {
                console.error("Failed to fetch professionals:", err);
                if (err.response && err.response.status === 403) {
                    setError("Access Denied. This area is for Recruiters only.");
                } else if (err.response) {
                    setError(`Error ${err.response.status}: ${err.response.data?.message || err.message}`);
                } else {
                    setError("Failed to load professionals. Server unreachable.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfessionals();
    }, []);

    if (loading) return <Loader fullScreen={true} />;

    if (error) {
        return (
            <div className="recruiter-error-container">
                <div className="error-card">
                    <h2>⚠️ Authorization Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="back-btn">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="recruiter-dashboard">
            <header className="recruiter-header">
                <div className="header-content">
                    <h1>Recruiter Dashboard</h1>
                    <p>Discover top talent for your open roles.</p>
                </div>
                <div className="header-actions">
                    <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="secondary-btn">
                        My Portfolio
                    </button>
                </div>
            </header>

            <main className="recruiter-content">
                {professionals.length === 0 ? (
                    <div className="current-empty-state">
                        <p>No professionals found at the moment.</p>
                    </div>
                ) : (
                    <div className="professionals-grid">
                        {professionals.map(user => (
                            <UserCard
                                key={user._id || user.id}
                                user={user}
                                onClick={() => {
                                    if (user.slug) {
                                        // Open public portfolio page in new tab or same tab? 
                                        // User said "directly show", let's do same tab navigation for now, 
                                        // consistent with single-page app flow, or use window.open if it's external-ish.
                                        // Since it's internal route /p/:slug, navigate is fine.
                                        navigate(`/p/${user.slug}`);
                                    } else {
                                        // Fallback to internal preview if not published/no slug
                                        navigate(`/recruiter/user/${user._id || user.id}`);
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default RecruiterDashboardPage;
