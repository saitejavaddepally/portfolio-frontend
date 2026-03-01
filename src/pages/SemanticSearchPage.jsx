import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SharedLayout from '../components/SharedLayout';
import HiringNavbar from '../components/hiring/HiringNavbar';
import CandidateResultCard from '../components/hiring/CandidateResultCard';
import SkillTag from '../components/hiring/SkillTag';
import { mockCandidates } from '../data/mockJobs';
import '../css/Jobs.css';

const SemanticSearchPage = ({ theme, toggleTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Skills are passed via navigation state from "Find Candidates" button
    const passedSkills = location.state?.skills || [];
    const [skills] = useState(passedSkills);

    // Filter mock candidates that have at least one matching skill
    const matchedCandidates = mockCandidates
        .filter(c => {
            if (skills.length === 0) return true;
            return c.skills.some(s =>
                skills.some(sk => sk.toLowerCase() === s.toLowerCase())
            );
        })
        .sort((a, b) => b.score - a.score);

    // If no skills passed, show all candidates sorted by score
    const displayCandidates = skills.length > 0 ? matchedCandidates : [...mockCandidates].sort((a, b) => b.score - a.score);

    const handleViewProfile = (candidate) => {
        navigate(`/recruiter/user/${candidate.userId}`);
    };

    return (
        <SharedLayout showUserInfo={true} theme={theme} toggleTheme={toggleTheme}>
            <HiringNavbar />
            <div className="semantic-search-page page-enter">
                <div className="semantic-search-container">
                    {/* Header */}
                    <div className="semantic-search-header">
                        <div className="semantic-search-eyebrow">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                            AI Semantic Search
                        </div>
                        <h1 className="semantic-search-title">Searching candidates for:</h1>
                        <p className="semantic-search-subtitle">
                            Ranked by compatibility score using semantic skill matching.
                        </p>
                    </div>

                    {/* Skills strip */}
                    {skills.length > 0 && (
                        <div className="semantic-search-skills-strip">
                            <span className="semantic-search-skills-label">Required skills:</span>
                            {skills.map(skill => (
                                <SkillTag key={skill} skill={skill} variant="required" />
                            ))}
                        </div>
                    )}

                    {/* Results meta */}
                    <div className="semantic-results-meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        <span>
                            <strong>{displayCandidates.length}</strong> candidate{displayCandidates.length !== 1 ? 's' : ''} matched · ranked by best fit
                        </span>
                    </div>

                    {/* Candidates Grid */}
                    {displayCandidates.length === 0 ? (
                        <div className="jobs-empty-state">
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <h3>No candidates found</h3>
                            <p>No matches for selected skills. Try a different job or broaden your search.</p>
                        </div>
                    ) : (
                        <div className="semantic-results-grid">
                            {displayCandidates.map((candidate, idx) => (
                                <div
                                    key={candidate.userId}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${idx * 0.07}s` }}
                                >
                                    <CandidateResultCard
                                        candidate={candidate}
                                        rank={idx}
                                        onViewProfile={handleViewProfile}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SharedLayout>
    );
};

export default SemanticSearchPage;
