import React from 'react';

const ErrorBubble = ({ message }) => {
    if (!message) return null;
    return (
        <div className="error-bubble" style={{
            color: '#dc2626',
            fontSize: '0.8rem',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            animation: 'fadeIn 0.2s ease-in'
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {message}
        </div>
    );
};

export default ErrorBubble;
