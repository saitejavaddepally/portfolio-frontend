import React from 'react';
import { useNavigate } from 'react-router-dom';
import SkillTag from './SkillTag';
import '../../css/Jobs.css';

/**
 * JobCard — displays a single job posting.
 * @param {object} job — job object from mockJobs
 * @param {"recruiter"|"public"} mode — recruiter shows actions; public shows Apply btn
 * @param {function} onApply — called in public mode
 */
const JobCard = ({ job, mode = 'recruiter', onApply }) => {
    const navigate = useNavigate();

    const handleFindCandidates = () => {
        // Use the existing /recruiter/search page with skills as the search query
        const q = job.requiredSkills.join(' ');
        navigate(`/recruiter/search?q=${encodeURIComponent(q)}`);
    };

    const handleViewApplicants = () => {
        // Mock — in production this would link to applicants page
        navigate(`/recruiter/jobs/${job.jobId}/applicants`);
    };

    return (
        <div className="job-card animate-slide-up">
            {/* Header */}
            <div className="job-card-header">
                <div>
                    <h3 className="job-card-title">{job.role}</h3>
                    <div className="job-card-meta">
                        <span className="job-card-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg>
                            {job.experienceRequired}
                        </span>
                        <span className="job-card-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z" />
                                <circle cx="12" cy="10" r="2.5" />
                            </svg>
                            {job.location}
                        </span>
                    </div>
                </div>
                <span className={`job-status-badge ${job.status.toLowerCase()}`}>
                    {job.status}
                </span>
            </div>

            {/* Skills */}
            <div className="job-card-skills">
                {job.requiredSkills.map(skill => (
                    <SkillTag key={skill} skill={skill} variant="required" />
                ))}
                {job.niceToHave?.map(skill => (
                    <SkillTag key={skill} skill={skill} variant="nice" />
                ))}
            </div>

            <div className="job-card-divider" />

            {/* Actions */}
            <div className="job-card-actions">
                {mode === 'recruiter' ? (
                    <>
                        <button
                            id={`find-candidates-${job.jobId}`}
                            className="btn-primary"
                            onClick={handleFindCandidates}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                            Find Candidates
                        </button>
                        <button
                            id={`view-applicants-${job.jobId}`}
                            className="btn-secondary"
                            onClick={handleViewApplicants}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            View Applicants
                        </button>
                    </>
                ) : (
                    <button
                        id={`apply-${job.jobId}`}
                        className="btn-primary"
                        onClick={() => onApply && onApply(job)}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        Apply Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobCard;
