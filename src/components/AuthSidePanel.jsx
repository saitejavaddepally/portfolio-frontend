import React from 'react';
import '../css/Auth.css';

const AuthSidePanel = ({ title, subtitle, image }) => {
    return (
        <div className="auth-side-panel">
            <div className="side-panel-content">
                <h1 className="side-panel-title">
                    {title || "Build Your Professional Brand"}
                </h1>
                <p className="side-panel-subtitle">
                    {subtitle || "Create a stunning portfolio in minutes. impressed recruiters and verify your skills."}
                </p>

                {/* Floating Icons / Visuals */}
                {image ? (
                    <div className="side-panel-image-container" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <img src={image} alt="Authentication Visual" style={{ maxWidth: '80%', height: 'auto', maxHeight: '300px' }} />
                    </div>
                ) : (
                    <div className="side-panel-icons">
                        <div className="floating-icon" style={{ animationDelay: '0s' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                            <span>Code</span>
                        </div>
                        <div className="floating-icon" style={{ animationDelay: '1.5s' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
                            <span>Design</span>
                        </div>
                        <div className="floating-icon" style={{ animationDelay: '3s' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            <span>Resume</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Background Texture/Overlay */}
            <div className="side-panel-overlay"></div>
        </div>
    );
};

export default AuthSidePanel;
