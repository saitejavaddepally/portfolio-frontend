import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Landing.css';
import '../css/Components.css';

// undraw SVGs already in the assets folder
import heroImg from '../assets/undraw_portfolio-website_838t.svg';
import featureImg1 from '../assets/undraw_portfolio_btd8.svg';
import featureImg2 from '../assets/undraw_web-design-showcase_6t2l.svg';
import featureImg3 from '../assets/undraw_portfolio-update_6bro.svg';

const LandingPage = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [clickedBtn, setClickedBtn] = useState(null); // 'login' | 'signup'

    const handleNavClick = (to, btn) => {
        setClickedBtn(btn);
        // Let the ripple animation play (250ms) then navigate
        setTimeout(() => navigate(to), 280);
    };

    return (
        <div className="landing-root">

            {/* ── Header — reuses exact same shared-header classes ─── */}
            <header className="shared-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                {/* Left spacer keeps logo centered on desktop */}
                <div className="header-spacer landing-header-left">
                    <span
                        className="landing-hero-eyebrow"
                        style={{ fontSize: '0.62rem', padding: '4px 12px', margin: 0 }}
                    >
                        ✦ AI-Powered
                    </span>
                </div>

                {/* Centered logo */}
                <Link to="/" className="header-logo-container">
                    <div className="header-logo-text">PortHire</div>
                </Link>

                {/* Right actions */}
                <div className="header-actions">
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        )}
                    </button>

                    <button
                        id="topbar-login"
                        className={`landing-topbar-link${clickedBtn === 'login' ? ' btn-ripple' : ''}`}
                        onClick={() => handleNavClick('/login', 'login')}
                    >
                        Sign In
                    </button>

                    <button
                        id="topbar-signup"
                        className={`landing-topbar-cta${clickedBtn === 'signup' ? ' btn-ripple' : ''}`}
                        onClick={() => handleNavClick('/register', 'signup')}
                    >
                        Get Started Free
                    </button>
                </div>
            </header>

            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="landing-hero">
                <div className="landing-hero-content">
                    <div className="landing-hero-eyebrow">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        AI-Powered Hiring Platform
                    </div>
                    <h1 className="landing-hero-title">
                        Build your portfolio.<br />
                        <span className="gradient-text">Get hired faster.</span>
                    </h1>
                    <p className="landing-hero-sub">
                        PortHire connects professionals with recruiters through stunning portfolios and AI-powered semantic matching. Showcase your work and let the right opportunities find you.
                    </p>
                    <div className="landing-hero-btns">
                        <button
                            id="hero-cta-signup"
                            className={`landing-btn-primary${clickedBtn === 'hero-signup' ? ' btn-ripple' : ''}`}
                            onClick={() => handleNavClick('/register', 'hero-signup')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                            Start for Free
                        </button>
                        <Link to="/jobs" className="landing-btn-secondary" id="hero-cta-jobs">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
                            Browse Jobs
                        </Link>
                    </div>
                </div>

                <div className="landing-hero-img">
                    <div className="hero-glow" />
                    <img src={heroImg} alt="Portfolio website illustration" />
                </div>
            </section>

            {/* ── Stats ──────────────────────────────────────────── */}
            <div className="landing-stats">
                <div className="landing-stats-inner">
                    {[
                        { num: '2,400+', label: 'Professionals onboarded' },
                        { num: '340+', label: 'Recruiters actively hiring' },
                        { num: '89%', label: 'Candidates matched in 48hrs' },
                    ].map(stat => (
                        <div key={stat.label} className="landing-stat">
                            <div className="landing-stat-num">{stat.num}</div>
                            <div className="landing-stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Features ───────────────────────────────────────── */}
            <section className="landing-features">
                <div className="landing-section-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                    What we offer
                </div>
                <h2 className="landing-section-title">Everything you need to get hired</h2>
                <p className="landing-section-sub">
                    From portfolio creation to AI-matched interviews — one platform for your entire career journey.
                </p>

                <div className="landing-features-grid">
                    {[
                        {
                            img: featureImg1, alt: 'Portfolio Builder',
                            icon: { bg: 'rgba(56,189,248,0.12)', stroke: '#38bdf8', path: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></> },
                            title: 'Portfolio Builder',
                            desc: 'Create a stunning portfolio with 5 professional templates — Medium, Modern, Google, Instagram, and Terminal styles. Publish in minutes.',
                        },
                        {
                            img: featureImg2, alt: 'AI Semantic Matching',
                            icon: { bg: 'rgba(129,140,248,0.12)', stroke: '#818cf8', path: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></> },
                            title: 'AI Semantic Matching',
                            desc: 'Recruiters find the perfect candidates using natural language search and AI-powered semantic skill matching — not just keyword filtering.',
                        },
                        {
                            img: featureImg3, alt: 'Recruiter Dashboard',
                            icon: { bg: 'rgba(52,211,153,0.12)', stroke: '#34d399', path: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></> },
                            title: 'Recruiter Dashboard',
                            desc: 'Post jobs, manage applicants, and browse a rich talent pool of verified professionals — all from one powerful recruiter workspace.',
                        },
                    ].map(f => (
                        <div key={f.title} className="landing-feature-card">
                            <img src={f.img} alt={f.alt} className="landing-feature-img" />
                            <div className="landing-feature-icon" style={{ background: f.icon.bg }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={f.icon.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.icon.path}</svg>
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ────────────────────────────────────── */}
            <section className="landing-how">
                <div className="landing-how-inner">
                    <div className="landing-section-label">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        How it works
                    </div>
                    <h2 className="landing-section-title">Up and running in 3 steps</h2>
                    <p className="landing-section-sub">No complicated setup. Just sign up, build your profile, and start getting discovered.</p>

                    <div className="landing-steps">
                        {[
                            { n: '1', title: 'Create your account', desc: 'Sign up as a Professional or Recruiter. Takes less than 60 seconds — no credit card needed.' },
                            { n: '2', title: 'Build your portfolio', desc: 'Add your experience, projects, and skills. Choose from 5 beautiful templates and publish with one click.' },
                            { n: '3', title: 'Get matched & hired', desc: 'Recruiters using AI search will find you instantly. Apply to open roles or wait for opportunities to reach you.' },
                        ].map(step => (
                            <div key={step.n} className="landing-step">
                                <div className="landing-step-num">{step.n}</div>
                                <h4>{step.title}</h4>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <section className="landing-cta">
                <div className="landing-cta-box">
                    <h2>Ready to stand out?</h2>
                    <p>Join thousands of professionals who are landing their dream jobs through PortHire's AI-powered platform.</p>
                    <div className="landing-cta-btns">
                        <button
                            id="cta-signup"
                            className={`landing-btn-primary${clickedBtn === 'cta-signup' ? ' btn-ripple' : ''}`}
                            onClick={() => handleNavClick('/register', 'cta-signup')}
                        >
                            Create Free Account
                        </button>
                        <button
                            id="cta-login"
                            className={`landing-btn-secondary${clickedBtn === 'cta-login' ? ' btn-ripple' : ''}`}
                            onClick={() => handleNavClick('/login', 'cta-login')}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────────── */}
            <footer className="shared-footer">
                © {new Date().getFullYear()} PortHire — Built for professionals, powered by AI.
            </footer>
        </div>
    );
};

export default LandingPage;
