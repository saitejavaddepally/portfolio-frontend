import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SharedLayout from '../components/SharedLayout';
import CandidateCard from '../components/CandidateCard';
import { searchCandidates } from '../services/recruiterApi';
import '../css/Recruiter.css';

/* ── Inline spinner ──────────────────────────────────────────── */
const SearchSpinner = () => (
    <div className="search-spinner-wrapper">
        <div className="search-spinner" />
        <p className="search-spinner-text">Looking for the best matches…</p>
    </div>
);

/* ── Empty state ─────────────────────────────────────────────── */
const EmptyState = ({ query }) => (
    <div className="search-empty-state">
        <div className="search-empty-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M11 8v6M8 11h6" />
            </svg>
        </div>
        <h3>No candidates found</h3>
        <p>No matches for <strong>"{query}"</strong>. Try different words or a broader description.</p>
    </div>
);

/* ═══════════════════════════════════════════════════════════════ */

const RecruiterSearch = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const debounceRef = useRef(null);
    const inputRef = useRef(null);
    const didAutoSearch = useRef(false);

    /* Core search handler */
    const runSearch = useCallback(async (q) => {
        if (!q.trim()) return;
        setLoading(true);
        setError(null);
        setSearched(false);
        try {
            const data = await searchCandidates(q);
            setResults(data);
            setSearched(true);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401) { navigate('/login'); return; }
            if (status === 403) {
                setError('This feature is only available to Recruiters.');
            } else {
                setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
            }
            setResults([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    /* Read ?q= param from URL and auto-search on mount */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        if (q && !didAutoSearch.current) {
            didAutoSearch.current = true;
            setQuery(q);
            runSearch(q);
        } else {
            inputRef.current?.focus();
        }
    }, [location.search, runSearch]);

    /* Debounce on subsequent typing (after initial mount auto-search) */
    useEffect(() => {
        if (!didAutoSearch.current) return; // let the URL-param effect handle first run
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            setError(null);
            return;
        }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runSearch(query), 300);
        return () => clearTimeout(debounceRef.current);
    }, [query, runSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        clearTimeout(debounceRef.current);
        didAutoSearch.current = true;
        runSearch(query);
    };

    return (
        <SharedLayout showUserInfo={true} theme={theme} toggleTheme={toggleTheme}>
            <div className="page-enter">
                <div className="dashboard-container">

                    {/* ── Page Header ─────────────────────────────────────── */}
                    <header className="dashboard-header search-page-header">
                        <div className="dashboard-header-content">
                            <div className="search-header-eyebrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z" />
                                    <circle cx="12" cy="10" r="2.5" />
                                </svg>
                                <span>Smart Matching</span>
                            </div>
                            <h1 className="dashboard-title">Find Candidates</h1>
                            <p className="dashboard-subtitle">
                                Describe the person you're looking for in plain English — we'll surface the best matches instantly.
                            </p>
                        </div>
                        <div className="search-header-illustration">
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#38bdf8" />
                                        <stop offset="100%" stopColor="#818cf8" />
                                    </linearGradient>
                                </defs>
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                                <path d="M8 11h6M11 8v6" />
                            </svg>
                        </div>
                    </header>

                    {/* ── Search Bar ──────────────────────────────────────── */}
                    <div className="search-bar-section">
                        <form className="search-form" onSubmit={handleSubmit}>
                            <div className="search-input-wrapper">
                                <svg className="search-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>

                                <input
                                    ref={inputRef}
                                    id="candidate-search-input"
                                    type="text"
                                    className="search-input"
                                    placeholder="e.g. Java Spring Boot developer, React expert, DevOps engineer…"
                                    value={query}
                                    onChange={(e) => { didAutoSearch.current = true; setQuery(e.target.value); }}
                                    autoComplete="off"
                                    spellCheck="false"
                                />

                                {query && (
                                    <button
                                        type="button"
                                        className="search-clear-btn"
                                        onClick={() => { setQuery(''); setResults([]); setSearched(false); setError(null); inputRef.current?.focus(); }}
                                        aria-label="Clear"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 6 6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <button
                                id="candidate-search-btn"
                                type="submit"
                                className="search-submit-btn"
                                disabled={!query.trim() || loading}
                            >
                                {loading ? <span className="btn-spinner" /> : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                )}
                                {loading ? 'Searching…' : 'Search'}
                            </button>
                        </form>

                        {/* Quick-suggest pills */}
                        <div className="search-suggestions">
                            {['React developer', 'Java Spring Boot', 'Machine learning', 'Cloud & AWS', 'Full stack Node.js'].map((s) => (
                                <button
                                    key={s}
                                    className="suggestion-pill"
                                    type="button"
                                    onClick={() => { didAutoSearch.current = true; setQuery(s); }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Results Area ─────────────────────────────────────── */}
                    <div className="search-results-area">

                        {loading && <SearchSpinner />}

                        {!loading && error && (
                            <div className="search-error-state">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                                <p>{error}</p>
                                <button className="back-btn" onClick={() => navigate('/recruiter/dashboard')}>
                                    ← Back to Dashboard
                                </button>
                            </div>
                        )}

                        {!loading && !error && searched && results.length === 0 && (
                            <EmptyState query={query} />
                        )}

                        {!loading && !error && results.length > 0 && (
                            <>
                                <div className="search-results-meta">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                    <span>
                                        <strong>{results.length}</strong> candidate{results.length !== 1 ? 's' : ''} matched · ranked by best fit
                                    </span>
                                </div>

                                <div className="candidate-grid">
                                    {results.map((r, idx) => (
                                        <div
                                            key={r.userEmail || r.userId}
                                            className="animate-slide-up"
                                            style={{ animationDelay: `${idx * 0.07}s` }}
                                        >
                                            <CandidateCard
                                                userEmail={r.userEmail}
                                                score={r.score}
                                                rank={idx}
                                                onViewProfile={() => navigate(`/recruiter/user/${r.userId}`)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {!loading && !error && !searched && (
                            <div className="search-idle-state">
                                <div className="search-idle-icon">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#idleGrad)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                                        <defs>
                                            <linearGradient id="idleGrad" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#38bdf8" />
                                                <stop offset="100%" stopColor="#818cf8" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                </div>
                                <h3>Find your ideal candidate</h3>
                                <p>Type a skill, role, or any description — we'll instantly surface the best people from your talent pool.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </SharedLayout>
    );
};

export default RecruiterSearch;
