import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import UserCard from '../components/UserCard';
import SharedLayout from '../components/SharedLayout';
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
                console.log("Recruiter Dashboard Professionals Data:", data);
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
        <SharedLayout showUserInfo={true} theme={theme} toggleTheme={toggleTheme}>
            <div className="recruiter-dashboard" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <div className="dashboard-header-content">
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)', fontFamily: '"Source Serif Pro", serif' }}>
                            Recruiter Dashboard
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: 0 }}>
                            Discover top talent for your open roles.
                        </p>
                    </div>
                </header>

                <main className="recruiter-content" style={{ padding: 0 }}>
                    {professionals.length === 0 ? (
                        <div className="current-empty-state" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
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
                                            navigate(`/p/${user.slug}`);
                                        } else {
                                            navigate(`/recruiter/user/${user._id || user.id}`);
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
