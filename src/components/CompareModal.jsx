import React, { useState } from 'react';
import { compareCandidates } from '../services/recruiterApi';
import { useToast } from '../context/ToastContext';
import ComparisonResults from './ComparisonResults';
import '../css/CompareModal.css';

/**
 * CompareModal - Modal for comparing selected candidates
 * @param {boolean} isOpen - Whether modal is open
 * @param {Array} selectedCandidates - Array of candidate data with userEmail
 * @param {string} jobDescription - Job description for comparison
 * @param {function} onClose - Callback to close modal
 */
const CompareModal = ({ isOpen, selectedCandidates = [], jobDescription = '', onClose }) => {
    const [loading, setLoading] = useState(false);
    const [comparisonResult, setComparisonResult] = useState(null);
    const { addToast } = useToast();

    if (!isOpen) return null;

    const handleRunComparison = async () => {
        if (!jobDescription.trim()) {
            addToast('Please enter a job description', 'error');
            return;
        }

        if (selectedCandidates.length < 2) {
            addToast('Select at least 2 candidates to compare', 'error');
            return;
        }

        setLoading(true);
        try {
            const result = await compareCandidates(jobDescription, selectedCandidates);
            setComparisonResult(result);
            addToast('Comparison completed successfully!', 'success');
        } catch (err) {
            console.error('Comparison error:', err);
            const errorMsg = err?.response?.data?.message || 'Failed to compare candidates';
            addToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setComparisonResult(null);
        onClose?.();
    };

    const candidateEmails = selectedCandidates.map(c => c.userEmail || c.email);

    return (
        <div className="compare-modal-overlay" onClick={handleClose}>
            <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="compare-modal-close" onClick={handleClose} aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>

                {!comparisonResult ? (
                    <>
                        {/* Header */}
                        <div className="compare-modal-header">
                            <h2>Compare Candidates</h2>
                            <p>Review and compare your selected candidates</p>
                        </div>

                        {/* Selected Candidates List */}
                        <div className="compare-modal-section">
                            <h3 className="compare-section-title">Selected Candidates</h3>
                            <div className="compare-candidates-list">
                                {candidateEmails.map((email, idx) => (
                                    <div key={email} className="compare-candidate-item">
                                        <div className="compare-candidate-index">{idx + 1}</div>
                                        <h4 className="compare-candidate-name">
                                            {email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </h4>
                                        <p className="compare-candidate-email">{email}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Job Description Section */}
                        <div className="compare-modal-section">
                            <h3 className="compare-section-title">Job Description</h3>
                            <p className="compare-job-description-text" style={{ marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                                {jobDescription.substring(0, 150)}
                                {jobDescription.length > 150 ? '...' : ''}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="compare-modal-footer">
                            <button
                                className="compare-modal-btn compare-modal-btn-cancel"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="compare-modal-btn compare-modal-btn-primary"
                                onClick={handleRunComparison}
                                disabled={loading || selectedCandidates.length < 2}
                            >
                                {loading ? (
                                    <>
                                        <span className="btn-spinner" style={{ marginRight: '8px' }} />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }}>
                                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                            <path d="M21 3v5h-5" />
                                        </svg>
                                        Run Comparison
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Results View */}
                        <ComparisonResults
                            data={comparisonResult}
                            selectedCandidates={selectedCandidates}
                            onNewComparison={() => setComparisonResult(null)}
                            onClose={handleClose}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CompareModal;
