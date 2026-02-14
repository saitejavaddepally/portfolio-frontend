import React from 'react';
import '../css/Auth.css';

const ErrorAlert = ({ error }) => {
    if (!error) return null;

    // Default message
    let message = "An unexpected error occurred.";

    // If it's a simple string error
    if (typeof error === 'string') {
        message = error;
    }
    // If it's the structured backend error object
    else if (error.errorMessage) {
        message = error.errorMessage;
    }
    // Fallback for other axios error structures if strictly passed
    else if (error.message) {
        message = error.message;
    }

    return (
        <div className="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="error-alert-text">{message}</span>
        </div>
    );
};

export default ErrorAlert;
