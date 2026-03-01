import React from 'react';
import '../css/Loader.css';

const Loader = ({ size = 'medium', color = 'var(--accent-color)', fullScreen = false, inline = false }) => {
    let containerClass = fullScreen ? 'spinner-container fullscreen' : 'spinner-container';
    if (inline) containerClass += ' inline';

    return (
        <div className={containerClass}>
            <div
                className={`loading-spinner spinner-${size}`}
                style={{
                    borderTopColor: color,
                    borderRightColor: color,
                    borderBottomColor: color
                }}
            ></div>
        </div>
    );
};

export default Loader;
