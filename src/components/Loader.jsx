import React from 'react';
import '../css/Loader.css';

const Loader = ({ size = 'medium', color = 'var(--accent-color)', fullScreen = false, inline = false }) => {
    const sizeMap = {
        small: '28px',
        medium: '52px',
        large: '90px',
        xlarge: '130px',
    };

    let containerClass = fullScreen ? 'spinner-container fullscreen' : 'spinner-container';
    if (inline) containerClass += ' inline';

    return (
        <div className={containerClass}>
            <div
                className={`galaxy-loader ${inline ? 'inline' : ''}`}
                style={{
                    color: color,
                    width: sizeMap[size],
                    height: sizeMap[size],
                }}
            >
                <div className="galaxy-core"></div>
                <div className="galaxy-ring galaxy-ring-1"></div>
            </div>
        </div>
    );
};

export default Loader;
