import React from 'react';
import '../css/Loader.css';

const Loader = ({ size = 'medium', color = 'var(--accent-color)', fullScreen = false, inline = false }) => {
    const sizeMap = {
        small: '30px',
        medium: '50px',
        large: '80px',
        xlarge: '120px',
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
                <div className="galaxy-ring galaxy-ring-2"></div>
                <div className="galaxy-ring galaxy-ring-3"></div>
                <div className="galaxy-sparkle-container">
                    <div className="galaxy-sparkle s1"></div>
                    <div className="galaxy-sparkle s2"></div>
                    <div className="galaxy-sparkle s3"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
