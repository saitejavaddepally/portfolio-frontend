import React from 'react';

const Header = ({ data, isEditing, updateData, theme, toggleTheme }) => {
    return (
        <header className="site-header">
            <div className="container header-content">
                {isEditing ? (
                    <input
                        type="text"
                        className="logo-input"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            border: '1px dashed var(--border-color)',
                            padding: '0.2rem',
                            background: 'transparent',
                            color: 'inherit'
                        }}
                        value={data.name}
                        onChange={(e) => updateData('header', 'name', e.target.value)}
                        placeholder="Site Name"
                    />
                ) : (
                    data.logo ? (
                        <img src={data.logo} alt={data.name} className="logo" style={{ height: '40px', width: 'auto' }} />
                    ) : (
                        <a href="#" className="logo">{data.name}</a>
                    )
                )}

                {/* Header Logo Upload removed as per request */}

                <nav className="nav-links">
                    {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '0.8rem' }}>Resume:</span>
                            <input
                                value={data.resumeUrl}
                                onChange={(e) => updateData('header', 'resumeUrl', e.target.value)}
                                style={{ border: '1px dashed var(--border-color)', padding: '2px', width: '150px', fontSize: '0.8rem', background: 'transparent', color: 'inherit' }}
                            />
                        </div>
                    ) : (
                        <a href={data.resumeUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-btn">
                            Resume ↗
                        </a>
                    )}

                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            width: '36px',
                            height: '36px',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'border-color 0.2s, background 0.2s',
                        }}
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        )}
                    </button>
                </nav>
            </div>
        </header >
    );
};

export default Header;
