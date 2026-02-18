import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import UserCard from '../components/UserCard';
import SharedLayout from '../components/SharedLayout';
import Loader from '../components/Loader';
import '../css/Dashboard.css';
import '../css/Recruiter.css';
import portfolioSvg from '../assets/undraw_portfolio_btd8.svg';

const RecruiterDashboardPage = ({ theme, toggleTheme }) => {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const response = await apiClient.get('/recruiter/professionals');
                const data = Array.isArray(response.data) ? response.data : (response.data.data || []);

                console.log("RecruiterDashboard: Fetched professionals:", data);

                // Filter only published profiles
                const publishedPros = data.filter(user => {
                    // Check deeply nested published flag based on DB structure
                    const isPublished = user.isPublished ||
                        user.slug ||
                        user.userData?.isPublished ||
                        user.userData?.slug ||
                        user.userData?.portfolio?.published ||
                        user.portfolio?.published ||
                        !!user.userData?.portfolio?.publicSlug ||
                        !!user.userData?.data; // Handle structure where data is directly under userData

                    return !!isPublished;
                });

                console.log("RecruiterDashboard: Published professionals after filter:", publishedPros);

                setProfessionals(publishedPros);
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
        <SharedLayout showUserInfo={true} theme={theme} toggleTheme={toggleTheme}>
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div className="dashboard-header-content">
                        <h1 className="dashboard-title">
                            Recruiter Dashboard
                        </h1>
                        <p className="dashboard-subtitle">
                            Discover top talent for your open roles.
                        </p>
                    </div>
                    <div className="dashboard-header-image-container">
                        <img src={portfolioSvg} alt="Recruiting" className="dashboard-header-image" style={{ maxHeight: '200px', width: 'auto' }} />
                    </div>
                </header>

                <main className="recruiter-content" style={{ padding: 0 }}>
                    {professionals.length === 0 ? (
                        <div className="current-empty-state" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                            <p>No professionals found at the moment.</p>
                        </div>
                    ) : (
                        <div className="dashboard-grid">
                            {professionals.map(user => (
                                <UserCard
                                    key={user._id || user.id}
                                    user={user}
                                    onClick={() => {
                                        const slug = user.slug || user.userData?.slug || user.userData?.portfolio?.publicSlug;
                                        // Pass the nested data if it exists, otherwise pass the user object itself
                                        // This ensures the target page gets the actual portfolio data structure it expects
                                        let stateData = user.userData?.data || user.userData || user;

                                        // Ensure we don't lose the email if we drilled down
                                        if (user.email && !stateData.email) {
                                            stateData = { ...stateData, email: user.email };
                                        }

                                        if (slug) {
                                            navigate(`/p/${slug}`, { state: { userData: stateData } });
                                        } else {
                                            navigate(`/recruiter/user/${user._id || user.id}`, { state: { userData: stateData } });
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </SharedLayout>
    );
};

export default RecruiterDashboardPage;
