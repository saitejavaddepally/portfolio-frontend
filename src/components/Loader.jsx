import React from 'react';
import '../css/Loader.css';

// Base size of the animation is 65px (matching the keyframe px values).
// We scale up/down using transform to handle different requested sizes.
const scaleMap = {
    small: 0.43,   // ~28px
    medium: 0.8,    // ~52px
    large: 1.23,   // ~80px
    xlarge: 1.8,    // ~117px
};

const Loader = ({ size = 'medium', fullScreen = false, inline = false }) => {
    let containerClass = fullScreen ? 'spinner-container fullscreen' : 'spinner-container';
    if (inline) containerClass += ' inline';

    const scale = scaleMap[size] ?? scaleMap.medium;

    return (
        <div className={containerClass}>
            <div
                className={`galaxy-loader ${inline ? 'inline' : ''}`}
                style={{ transform: `scale(${scale})` }}
            />
        </div>
    );
};

export default Loader;
