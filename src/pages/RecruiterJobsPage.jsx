import React, { useState } from 'react';
import SharedLayout from '../components/SharedLayout';
import HiringNavbar from '../components/hiring/HiringNavbar';
import SkillTag from '../components/hiring/SkillTag';
import { mockJobs } from '../data/mockJobs';
import { useNavigate } from 'react-router-dom';
import '../css/Jobs.css';

const RecruiterJobsPage = ({ theme, toggleTheme }) => {
    const [jobs, setJobs] = useState(mockJobs);
    const navigate = useNavigate();

    const openCount = jobs.filter(j => j.status === 'Open').length;

    const handleFindCandidates = (job) => {
        // Format: Role | Skills | Experience | Location
        const skillsString = job.requiredSkills.join(', ');
        const q = `${job.role} | ${skillsString} | ${job.experienceRequired} | ${job.location}`;
        navigate(`/recruiter/search?q=${encodeURIComponent(q)}`);
    };

    return (
        <SharedLayout showUserInfo={true} theme={theme} toggleTheme={toggleTheme}>
            <HiringNavbar />
            <div className="jobs-page-wrapper page-enter">
                <div className="jobs-container">
                    {/* Header */}
                    <div className="jobs-page-header">
                        <div>
                            <div className="jobs-count-chip">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                </svg>
                                {openCount} open position{openCount !== 1 ? 's' : ''}
                            </div>
                            <h1 className="jobs-page-title">My Job Postings</h1>
                            <p className="jobs-page-subtitle">
                                Manage your open roles and discover candidates using AI.
                            </p>
                        </div>
                        <button
                            id="post-new-job-btn"
                            className="btn-primary"
                            onClick={() => navigate('/recruiter/post-job')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Post New Job
                        </button>
                    </div>

                    {/* List View Table */}
                    {jobs.length === 0 ? (
                        <div className="jobs-empty-state">
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg>
                            <h3>No jobs posted yet</h3>
                            <p>Click "Post New Job" to create your first job posting.</p>
                        </div>
                    ) : (
                        <div className="jobs-list-wrapper">
                            {/* Table Header */}
                            <div className="jobs-list-header">
                                <div className="jl-col jl-col-role">Role</div>
                                <div className="jl-col jl-col-exp">Experience</div>
                                <div className="jl-col jl-col-location">Location</div>
                                <div className="jl-col jl-col-skills">Skills</div>
                                <div className="jl-col jl-col-actions">Actions</div>
                            </div>

                            {/* Table Rows */}
                            <div className="jobs-list-body">
                                {jobs.map((job, idx) => (
                                    <div
                                        key={job.jobId}
                                        className="jobs-list-row animate-slide-up"
                                        style={{ animationDelay: `${idx * 0.06}s` }}
                                    >
                                        {/* Role + Status */}
                                        <div className="jl-col jl-col-role">
                                            {job.companyName && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.1rem', fontWeight: 600 }}>{job.companyName}</div>
                                            )}
                                            <div className="jl-role-name">{job.role}</div>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.3rem' }}>
                                                <span className={`job-status-badge ${job.status.toLowerCase()}`}>
                                                    {job.status}
                                                </span>
                                                {job.jobType && (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                                        {job.jobType}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Experience & Salary */}
                                        <div className="jl-col jl-col-exp">
                                            <div className="jl-meta-item">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                                </svg>
                                                {job.experienceRequired}
                                            </div>
                                            {job.salaryRange && (
                                                <div className="jl-meta-item" style={{ marginTop: '0.4rem' }}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="12" y1="1" x2="12" y2="23" />
                                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                                    </svg>
                                                    {job.salaryRange}
                                                </div>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div className="jl-col jl-col-location">
                                            <div className="jl-meta-item">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 13-8 13S4 15.25 4 10a8 8 0 0 1 8-8z" />
                                                    <circle cx="12" cy="10" r="2.5" />
                                                </svg>
                                                {job.location}
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="jl-col jl-col-skills">
                                            <div className="jl-skills-wrap">
                                                {job.requiredSkills.slice(0, 3).map(skill => (
                                                    <SkillTag key={skill} skill={skill} variant="required" />
                                                ))}
                                                {job.requiredSkills.length > 3 && (
                                                    <span className="jl-skills-more">
                                                        +{job.requiredSkills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="jl-col jl-col-actions">
                                            <button
                                                id={`find-candidates-${job.jobId}`}
                                                className="btn-primary jl-action-btn"
                                                onClick={() => handleFindCandidates(job)}
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="M21 21l-4.35-4.35" />
                                                </svg>
                                                Find Candidates
                                            </button>
                                            <button
                                                id={`view-applicants-${job.jobId}`}
                                                className="btn-secondary jl-action-btn"
                                                onClick={() => navigate(`/recruiter/jobs/${job.jobId}/applicants`)}
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                Applicants
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SharedLayout>
    );
};

export default RecruiterJobsPage;
