import React from 'react';
import '../css/Loader.css';

const Loader = ({ size = 'medium', color = 'var(--accent-color)', fullScreen = false }) => {
    const containerClass = fullScreen ? 'spinner-container fullscreen' : 'spinner-container';

    return (
        <div className={containerClass}>
            <div
                className={`spinner spinner-${size}`}
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
