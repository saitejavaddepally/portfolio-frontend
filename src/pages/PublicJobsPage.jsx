import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import SharedLayout from '../components/SharedLayout';
import HiringNavbar from '../components/hiring/HiringNavbar';
import JobCard from '../components/hiring/JobCard';
import { mockJobs } from '../data/mockJobs';
import '../css/Jobs.css';

// Success modal component
const ApplicationModal = ({ job, onClose }) => {
    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-box"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal-icon-circle">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h3 id="modal-title">Application Submitted!</h3>
                <p>
                    Your application for <strong>{job.role}</strong> has been submitted successfully.
                    The recruiter will reach out to you soon.
                </p>
                <button
                    id="modal-close-btn"
                    className="modal-close-btn"
                    onClick={onClose}
                >
                    Done
                </button>
            </div>
        </div>,
        document.body
    );
};

const PublicJobsPage = ({ theme, toggleTheme }) => {
    const [selectedJob, setSelectedJob] = useState(null);

    const openJobs = mockJobs.filter(j => j.status === 'Open');

    return (
        <SharedLayout theme={theme} toggleTheme={toggleTheme}>
            <HiringNavbar />
            <div className="public-jobs-page page-enter">
                {/* Hero Banner */}
                <div className="public-jobs-hero">
                    <h1>Find Your Next Opportunity</h1>
                    <p>
                        Browse open roles from top companies. Apply in one click — no sign-up required.
                    </p>
                </div>

                {/* Jobs list */}
                <div className="public-jobs-body">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <span className="jobs-count-chip">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg>
                            {openJobs.length} open role{openJobs.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {openJobs.length === 0 ? (
                        <div className="jobs-empty-state">
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg>
                            <h3>No open positions right now</h3>
                            <p>Check back soon — new roles are posted frequently.</p>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {openJobs.map((job, idx) => (
                                <div
                                    key={job.jobId}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${idx * 0.07}s` }}
                                >
                                    <JobCard
                                        job={job}
                                        mode="public"
                                        onApply={setSelectedJob}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Application success modal */}
            {selectedJob && (
                <ApplicationModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </SharedLayout>
    );
};

export default PublicJobsPage;
