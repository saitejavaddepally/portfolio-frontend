import React from 'react';
import Loader from './Loader';
import '../css/Components.css';

const EditControl = ({ onSave, onExport, toggleTheme, theme, onExitEdit, isSaving, isDeploying, onDeploy, publicUrl, saveDisabled }) => {
    return (
        <div className="edit-control">
            <div className="edit-control-inner">
                <div className="edit-control-header">
                    <strong className="edit-mode-text">PortHire Editor</strong>
                </div>

                <div className="edit-actions">
                    <button onClick={toggleTheme} className="theme-icon-btn" title="Toggle Theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                        )}
                    </button>

                    <button
                        onClick={onSave}
                        className="save-btn"
                        disabled={isSaving || isDeploying || saveDisabled}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            opacity: saveDisabled ? 0.6 : 1,
                            cursor: saveDisabled ? 'not-allowed' : 'pointer',
                            background: saveDisabled ? '#ccc' : undefined
                        }}
                        title={saveDisabled ? "Please fix validation errors to save" : "Save changes"}
                    >
                        {isSaving && <Loader size="small" color="#fff" />}
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>



                    {publicUrl && (
                        <a
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-live-icon"
                            title="View Live Site"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '4px', background: '#f0f9ff', color: '#0284c7', textDecoration: 'none' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditControl;
