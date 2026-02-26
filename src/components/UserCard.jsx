import React from 'react';
import '../css/Recruiter.css';

/** Returns badge color based on match score */
const matchColor = (score) => {
    if (score >= 80) return { bg: 'rgba(34,197,94,0.15)', color: '#16a34a', dot: '#22c55e' };
    if (score >= 60) return { bg: 'rgba(249,115,22,0.15)', color: '#ea580c', dot: '#f97316' };
    return { bg: 'rgba(148,163,184,0.15)', color: '#64748b', dot: '#94a3b8' };
};

const UserCard = ({ user, onClick }) => {
    // New API: skills[] and optional matchScore are top-level
    const skills = Array.isArray(user.skills) ? user.skills : [];
    const matchScore = typeof user.matchScore === 'number' ? user.matchScore : null;

    // Derive display name from email (e.g. "john.doe@..." → "John Doe")
    const nameFromEmail = user.email
        ? user.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : 'Professional';
    const displayName = user.name || nameFromEmail;
    const initial = displayName.charAt(0).toUpperCase();

    const topSkills = skills.slice(0, 4);
    const remaining = skills.length - topSkills.length;

    const badge = matchScore !== null ? matchColor(matchScore) : null;

    return (
        <div className="recruiter-user-card" onClick={onClick} style={{ position: 'relative' }}>
            {/* Match Score Badge */}
            {badge && (
                <div className="match-score-badge" style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: badge.bg,
                    color: badge.color,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    letterSpacing: '0.02em',
                }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: badge.dot, display: 'inline-block' }} />
                    {matchScore}% Match
                </div>
            )}

            <div className="user-card-header">
                <div className="user-avatar-placeholder">{initial}</div>
                <div className="user-info">
                    <h3 className="user-name">{displayName}</h3>
                    <p className="user-role" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {user.email}
                    </p>
                </div>
            </div>

            <div className="user-card-skills">
                {topSkills.map((skill, i) => (
                    <span key={i} className="skill-badge">{skill}</span>
                ))}
                {remaining > 0 && (
                    <span className="skill-badge more">+{remaining}</span>
                )}
                {skills.length === 0 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No skills listed</span>
                )}
            </div>

            <div className="user-card-footer">
                <span className="view-profile-link">View Portfolio →</span>
            </div>
        </div>
    );
};

export default UserCard;

