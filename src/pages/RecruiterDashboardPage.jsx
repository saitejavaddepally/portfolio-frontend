import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const debounceRef = useRef(null);

    const navigateToSearch = useCallback((q) => {
        if (q.trim()) {
            navigate(`/recruiter/search?q=${encodeURIComponent(q.trim())}`);
        }
    }, [navigate]);

    const handleSearchInput = (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        clearTimeout(debounceRef.current);
        if (q.trim()) {
            debounceRef.current = setTimeout(() => navigateToSearch(q), 400);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        clearTimeout(debounceRef.current);
        navigateToSearch(searchQuery);
    };

    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const response = await apiClient.get('/recruiter/professionals');
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
        <SharedLayout showUserInfo={true} theme={theme} toggleTheme={toggleTheme}>
            <div className="dashboard-container">
                <header className="dashboard-header recruiter-dashboard-header">
                    <div className="dashboard-header-content">
                        <h1 className="dashboard-title">Recruiter Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Discover top talent for your open roles.
                        </p>

                        {/* Inline Candidate Search */}
                        <form className="dashboard-search-form" onSubmit={handleSearchSubmit}>
                            <div className="dashboard-search-wrapper">
                                <svg
                                    className="dashboard-search-icon"
                                    width="18" height="18"
                                    viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.2"
                                    strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                                <input
                                    id="dashboard-candidate-search"
                                    type="text"
                                    className="dashboard-search-input"
                                    placeholder="Find candidates — e.g. React developer, Java expert…"
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="dashboard-search-clear"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Clear"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 6 6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="dashboard-search-btn"
                                disabled={!searchQuery.trim()}
                            >
                                Search
                            </button>
                        </form>
                    </div>
                    <div className="dashboard-header-image-container">
                        <img
                            src={portfolioSvg}
                            alt="Recruiting"
                            className="dashboard-header-image"
                            style={{ maxHeight: '200px', width: 'auto' }}
                        />
                    </div>
                </header>

                <main className="recruiter-content" style={{ padding: 0 }}>
                    {professionals.length === 0 ? (
                        <div className="current-empty-state" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                            <p>No professionals found at the moment.</p>
                        </div>
                    ) : (
                        <div className="dashboard-grid">
                            {professionals.map((user, index) => (
                                <div
                                    key={user._id || user.id}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <UserCard
                                        user={user}
                                        onClick={() => navigate(`/recruiter/user/${user._id || user.id}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </SharedLayout>
    );
};

export default RecruiterDashboardPage;
