import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import SharedLayout from '../components/SharedLayout';
import Loader from '../components/Loader';
import '../css/Dashboard.css';
import '../css/Recruiter.css';
import '../css/Jobs.css';
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
                    <button onClick={() => navigate('/professional/dashboard')} className="back-btn">
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

                        {/* Quick links */}
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                                id="go-to-jobs-btn"
                                onClick={() => navigate('/recruiter/jobs')}
                                className="recruiter-search-nav-btn"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                </svg>
                                My Job Postings
                            </button>
                        </div>

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

                <main className="recruiter-content">
                    <div className="jobs-container" style={{ paddingTop: '1.5rem' }}>
                        {professionals.length === 0 ? (
                            <div className="current-empty-state" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                <p>No professionals found at the moment.</p>
                            </div>
                        ) : (
                            /* ── List View ────────────────────────────────── */
                            <div className="jobs-list-wrapper" style={{ margin: '0 0 2rem' }}>
                                {/* Table Header */}
                                <div className="jobs-list-header" style={{ gridTemplateColumns: '2.5fr 2.5fr 2fr 1.5fr' }}>
                                    <div className="jl-col">Professional</div>
                                    <div className="jl-col">Skills</div>
                                    <div className="jl-col">Contact</div>
                                    <div className="jl-col">Action</div>
                                </div>

                                {/* Rows */}
                                <div className="jobs-list-body">
                                    {professionals.map((user, idx) => {
                                        const nameFromEmail = user.email
                                            ? user.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                                            : 'Professional';
                                        const displayName = user.name || nameFromEmail;
                                        const initial = displayName.charAt(0).toUpperCase();
                                        const skills = Array.isArray(user.skills) ? user.skills : [];
                                        const topSkills = skills.slice(0, 4);
                                        const remaining = skills.length - topSkills.length;
                                        const matchScore = typeof user.matchScore === 'number' ? user.matchScore : null;

                                        const scoreColor = matchScore >= 80
                                            ? { bg: 'rgba(34,197,94,0.12)', color: '#16a34a', dot: '#22c55e' }
                                            : matchScore >= 60
                                                ? { bg: 'rgba(249,115,22,0.12)', color: '#ea580c', dot: '#f97316' }
                                                : { bg: 'rgba(148,163,184,0.12)', color: '#64748b', dot: '#94a3b8' };

                                        return (
                                            <div
                                                key={user._id || user.id}
                                                className="jobs-list-row animate-slide-up"
                                                style={{
                                                    gridTemplateColumns: '2.5fr 2.5fr 2fr 1.5fr',
                                                    animationDelay: `${idx * 0.06}s`,
                                                }}
                                            >
                                                {/* Professional name + avatar */}
                                                <div className="jl-col jl-col-role">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: 40, height: 40, borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: '#fff', fontWeight: 800, fontSize: '1rem', flexShrink: 0,
                                                        }}>
                                                            {initial}
                                                        </div>
                                                        <div>
                                                            <div className="jl-role-name">{displayName}</div>
                                                            {matchScore !== null && (
                                                                <span style={{
                                                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                                                    fontSize: '0.7rem', fontWeight: 700,
                                                                    padding: '2px 8px', borderRadius: 100,
                                                                    background: scoreColor.bg, color: scoreColor.color, marginTop: 2,
                                                                }}>
                                                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: scoreColor.dot, display: 'inline-block' }} />
                                                                    {matchScore}% match
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Skills */}
                                                <div className="jl-col">
                                                    <div className="jl-skills-wrap">
                                                        {topSkills.map((s, i) => (
                                                            <span key={i} className="skill-badge">{s}</span>
                                                        ))}
                                                        {remaining > 0 && (
                                                            <span className="jl-skills-more">+{remaining}</span>
                                                        )}
                                                        {skills.length === 0 && (
                                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No skills listed</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Contact / email */}
                                                <div className="jl-col">
                                                    <div className="jl-meta-item">
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                            <polyline points="22,6 12,13 2,6" />
                                                        </svg>
                                                        <span style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {user.email || '—'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                <div className="jl-col jl-col-actions">
                                                    <button
                                                        id={`view-portfolio-${user._id || user.id}`}
                                                        className="btn-primary jl-action-btn"
                                                        onClick={() => navigate(`/recruiter/user/${user._id || user.id}`)}
                                                    >
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                        View Portfolio
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </SharedLayout>
    );
};

export default RecruiterDashboardPage;
