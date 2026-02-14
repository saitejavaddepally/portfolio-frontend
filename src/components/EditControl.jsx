import React from 'react';
import '../css/Components.css';

const EditControl = ({ onSave, onExport, toggleTheme, theme, onExitEdit }) => {
    return (
        <div className="edit-control">
            <div className="edit-control-inner">
                <div className="edit-control-header">
                    <strong className="edit-mode-text">Editing Mode Active</strong>
                    <button onClick={onExitEdit} className="close-btn">×</button>
                </div>

                <div className="edit-actions">
                    <button onClick={toggleTheme} className="theme-icon-btn">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button onClick={onSave} className="save-btn">
                        Save
                    </button>
                    <button onClick={onExport} className="export-btn">
                        Export
                    </button>
                </div>
                <small className="edit-note">Save writes to disk (Local only)</small>
            </div>
        </div>
    );
};

export default EditControl;
