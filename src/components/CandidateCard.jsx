import React, { useEffect, useState } from 'react';
import '../css/Recruiter.css';

/** Returns color tokens based on match score */
const scoreTheme = (pct) => {
    if (pct >= 80) return { accent: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: 'Excellent' };
    if (pct >= 60) return { accent: '#f97316', bg: 'rgba(249,115,22,0.12)', label: 'Good' };
    if (pct >= 40) return { accent: '#eab308', bg: 'rgba(234,179,8,0.12)', label: 'Fair' };
    return { accent: '#94a3b8', bg: 'rgba(148,163,184,0.12)', label: 'Low' };
};

const CandidateCard = ({ userEmail, score, onViewProfile, rank }) => {
    const handleCardClick = () => onViewProfile?.();
    const pct = Math.round((score || 0) * 100);
    const theme = scoreTheme(pct);
    const [barWidth, setBarWidth] = useState(0);

    // Derive display name from email
    const nameFromEmail = userEmail
        ? userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Candidate';
    const initial = nameFromEmail.charAt(0).toUpperCase();

    // Animate progress bar on mount
    useEffect(() => {
        const timer = setTimeout(() => setBarWidth(pct), 80);
        return () => clearTimeout(timer);
    }, [pct]);

    return (
        <div className="candidate-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            {/* Rank badge */}
            {rank !== undefined && (
                <div className="candidate-rank">#{rank + 1}</div>
            )}

            {/* Header */}
            <div className="candidate-card-header">
                <div
                    className="candidate-avatar"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}99, #818cf8)` }}
                >
                    {initial}
                </div>
                <div className="candidate-info">
                    <h3 className="candidate-name">{nameFromEmail}</h3>
                    <p className="candidate-email">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle', flexShrink: 0 }}>
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M2 7l10 7 10-7" />
                        </svg>
                        {userEmail}
                    </p>
                </div>

                {/* Score badge */}
                <div
                    className="candidate-score-badge"
                    style={{ background: theme.bg, color: theme.accent, borderColor: `${theme.accent}33` }}
                >
                    <span className="score-number">{pct}%</span>
                    <span className="score-label">{theme.label}</span>
                </div>
            </div>

            {/* Match Progress Bar */}
            <div className="candidate-progress-section">
                <div className="candidate-progress-label">
                    <span>Match Score</span>
                    <span style={{ fontWeight: 700, color: theme.accent }}>{pct}%</span>
                </div>
                <div className="candidate-progress-track">
                    <div
                        className="candidate-progress-fill"
                        style={{
                            width: `${barWidth}%`,
                            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}bb)`,
                        }}
                    />
                </div>
            </div>

        </div>
    );
};

export default CandidateCard;
