import React from 'react';
import '../css/CompareModal.css';

/**
 * ComparisonResults - Display comparison results from backend
 * @param {Object} data - Comparison data from API
 * @param {Array} selectedCandidates - Original candidate list
 * @param {Function} onNewComparison - Callback to start new comparison
 * @param {Function} onClose - Callback to close modal
 */
const ComparisonResults = ({ data, selectedCandidates, onNewComparison, onClose }) => {
    // Extract data structure (adapt based on backend response format)
    const ranking = data?.ranking || [];
    const summary = data?.summary || data?.comparisonSummary || '';
    const detailed = data?.detailed || data?.detailedComparison || [];

    // Helper to get candidate name
    const getCandidateName = (email) => {
        return email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // Helper to get color for score
    const getScoreColor = (score) => {
        if (score >= 80) return '#22c55e';
        if (score >= 60) return '#f97316';
        if (score >= 40) return '#eab308';
        return '#94a3b8';
    };

    return (
        <div className="comparison-results">
            {/* Results Header */}
            <div className="compare-modal-header">
                <h2>Comparison Results</h2>
                <p>Analysis of selected candidates</p>
            </div>

            {/* Ranking Section */}
            {ranking && ranking.length > 0 && (
                <div className="compare-modal-section">
                    <h3 className="compare-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
                        </svg>
                        Ranking
                    </h3>
                    <div className="results-ranking">
                        {ranking.map((item, idx) => {
                            const candidateName = typeof item === 'string' ? getCandidateName(item) : getCandidateName(item.email || item.candidate || '');
                            const score = typeof item === 'object' ? (item.score || item.match_score || item.matchScore || 0) : 0;
                            return (
                                <div key={idx} className="ranking-item">
                                    <div className="ranking-position">{idx + 1}</div>
                                    <div className="ranking-info">
                                        <h4>{candidateName}</h4>
                                    </div>
                                    {score > 0 && (
                                        <div className="ranking-score" style={{ color: getScoreColor(score) }}>
                                            {Math.round(score)}%
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Summary Section */}
            {summary && (
                <div className="compare-modal-section">
                    <h3 className="compare-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor" />
                        </svg>
                        Summary
                    </h3>
                    <div className="results-summary">
                        <p>{summary}</p>
                    </div>
                </div>
            )}

            {/* Detailed Comparison */}
            {detailed && detailed.length > 0 && (
                <div className="compare-modal-section">
                    <h3 className="compare-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <path d="M9 6H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h.01M12 16h.01M9 16h.01" />
                        </svg>
                        Detailed Analysis
                    </h3>
                    <div className="results-detailed">
                        {detailed.map((item, idx) => (
                            <div key={idx} className="detailed-item">
                                <h4 className="detailed-candidate">
                                    {typeof item === 'string' ? getCandidateName(item) : getCandidateName(item.email || item.candidate || '')}
                                </h4>
                                <div className="detailed-content">
                                    {typeof item === 'object' && item.analysis && (
                                        <p>{item.analysis}</p>
                                    )}
                                    {typeof item === 'object' && item.strengths && (
                                        <div>
                                            <h5 style={{ marginTop: '12px', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase', color: '#38bdf8' }}>Strengths</h5>
                                            <ul style={{ marginBottom: '12px', paddingLeft: '20px', fontSize: '13px' }}>
                                                {(Array.isArray(item.strengths) ? item.strengths : [item.strengths]).map((s, i) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {typeof item === 'object' && item.gaps && (
                                        <div>
                                            <h5 style={{ marginTop: '6px', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase', color: '#f97316' }}>Gaps</h5>
                                            <ul style={{ paddingLeft: '20px', fontSize: '13px' }}>
                                                {(Array.isArray(item.gaps) ? item.gaps : [item.gaps]).map((g, i) => (
                                                    <li key={i}>{g}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="compare-modal-footer">
                <button
                    className="compare-modal-btn compare-modal-btn-secondary"
                    onClick={onNewComparison}
                >
                    ← Back to Comparison
                </button>
                <button
                    className="compare-modal-btn compare-modal-btn-cancel"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ComparisonResults;
