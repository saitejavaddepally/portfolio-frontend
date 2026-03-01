import React from 'react';
import SkillTag from './SkillTag';
import '../../css/Jobs.css';

/**
 * CandidateResultCard — displays a semantic search match
 * @param {object} candidate — candidate from mockCandidates
 * @param {number} rank — position index (0-based)
 * @param {function} onViewProfile — callback
 */
const CandidateResultCard = ({ candidate, rank, onViewProfile }) => {
    const score = candidate.score;
    const scorePct = Math.round(score * 100);
    const initials = candidate.name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const scoreClass = score >= 0.8 ? 'score-high' : score >= 0.65 ? 'score-mid' : 'score-low';

    return (
        <div className="candidate-result-card">
            {/* Header */}
            <div className="candidate-result-header">
                <div className="candidate-result-avatar">{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="candidate-result-name">{candidate.name}</h3>
                    <p className="candidate-result-exp">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        </svg>
                        {candidate.experience}
                        {candidate.location && (
                            <>
                                <span style={{ opacity: 0.4 }}>·</span>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z" />
                                    <circle cx="12" cy="10" r="2.5" />
                                </svg>
                                {candidate.location}
                            </>
                        )}
                    </p>
                </div>
                {/* Score badge */}
                <div className={`candidate-score-pill ${scoreClass}`}>
                    <span className="score-val">{scorePct}%</span>
                    <span className="score-lbl">Match</span>
                </div>
            </div>

            {/* Compatibility bar */}
            <div>
                <div className="compat-bar-label">
                    <span>Compatibility</span>
                    <span>#{rank + 1} ranked</span>
                </div>
                <div className="compat-bar-track">
                    <div
                        className="compat-bar-fill"
                        style={{ width: `${scorePct}%` }}
                    />
                </div>
            </div>

            {/* Skills */}
            <div className="candidate-result-skills">
                {candidate.skills.map(skill => (
                    <SkillTag key={skill} skill={skill} variant="neutral" />
                ))}
            </div>

            {/* Footer */}
            <div className="candidate-result-footer">
                <button
                    id={`view-profile-${candidate.userId}`}
                    className="btn-primary"
                    onClick={() => onViewProfile && onViewProfile(candidate)}
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    View Profile
                </button>
            </div>
        </div>
    );
};

export default CandidateResultCard;
