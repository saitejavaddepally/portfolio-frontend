import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SharedLayout from '../components/SharedLayout';
import HiringNavbar from '../components/hiring/HiringNavbar';
import JobForm from '../components/hiring/JobForm';
import '../css/Jobs.css';

// We need a module-level store for jobs that persists between route changes
// In a real app this would be context or Redux; here we use a simple module-level array
import { mockJobs as initialJobs } from '../data/mockJobs';

// Module-level mutable ref so jobs persist across renders within the session
let sessionJobs = [...initialJobs];

export const getSessionJobs = () => sessionJobs;
export const addSessionJob = (job) => { sessionJobs = [job, ...sessionJobs]; };

const PostJobPage = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (newJob) => {
        addSessionJob(newJob);
        setSubmitted(true);
        // Redirect after short delay so user sees the success state
        setTimeout(() => {
            navigate('/recruiter/jobs');
        }, 1200);
    };

    return (
        <SharedLayout showUserInfo={true} theme={theme} toggleTheme={toggleTheme}>
            <HiringNavbar />
            <div className="job-form-page page-enter">
                <div className="job-form-container">
                    <div className="job-form-header">
                        <h1>Post a New Job</h1>
                        <p>Fill in the details below to create a new job posting. It will appear immediately on your jobs dashboard.</p>
                    </div>

                    {submitted ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            animation: 'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1) both'
                        }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                background: 'linear-gradient(135deg,rgba(52,211,153,.15),rgba(56,189,248,.15))',
                                border: '1.5px solid rgba(52,211,153,.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.25rem'
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 style={{ margin: '0 0 0.4rem', fontWeight: 800, fontSize: '1.25rem' }}>
                                Job Posted!
                            </h3>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Redirecting to your jobs dashboard…
                            </p>
                        </div>
                    ) : (
                        <JobForm onSubmit={handleSubmit} />
                    )}
                </div>
            </div>
        </SharedLayout>
    );
};

export default PostJobPage;
