import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Components.css';

const SharedLayout = ({ children, showUserInfo = false, theme, toggleTheme }) => {
    const { user, logout } = useAuth();

    return (
        <div className="shared-layout">
            {/* Common Header */}
            <header className="shared-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', position: 'relative' }}>

                {/* Empty left side to balance right side for centering, or just absolute center the title */}
                <div style={{ width: '150px' }}></div>

                <Link to="/" className="header-logo-link" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <div className="header-logo-text" style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px' }}>
                        PortHire
                    </div>
                </Link>

                <div className="header-actions" style={{ width: '150px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        )}
                    </button>

                    {showUserInfo && user && (
                        <div className="user-info-container">
                            <button
                                onClick={logout}
                                className="logout-btn"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="shared-main">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="shared-footer">
                &copy; {new Date().getFullYear()} PortHire. All rights reserved.
            </footer>
        </div>
    );
};

export default SharedLayout;
