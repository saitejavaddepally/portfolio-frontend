import React from 'react';
import Loader from './Loader';
import '../css/Components.css';

const EditControl = ({ onSave, onExport, toggleTheme, theme, onExitEdit, isSaving, isDeploying, onDeploy, publicUrl }) => {
    return (
        <div className="edit-control">
            <div className="edit-control-inner">
                <div className="edit-control-header">
                    <strong className="edit-mode-text">PortHire Editor</strong>
                    <button onClick={onExitEdit} className="close-btn" title="Exit Editor">×</button>
                </div>

                <div className="edit-actions">
                    <button onClick={toggleTheme} className="theme-icon-btn" title="Toggle Theme">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>

                    <button
                        onClick={onSave}
                        className="save-btn"
                        disabled={isSaving || isDeploying}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
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
                            ↗
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditControl;
