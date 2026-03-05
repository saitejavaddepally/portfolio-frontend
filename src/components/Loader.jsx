import React from 'react';
import '../css/Loader.css';

/**
 * Loader component.
 *
 * Inline (inside buttons):  renders a compact 16px spinning ring.
 * Standalone (page/section): renders the morphing square/circle animation.
 *
 * Props:
 *   size       - 'small' | 'medium' (default) | 'large'
 *   fullScreen - boolean: centers loader over the full viewport
 *   inline     - boolean: compact mode for use inside buttons
 */
const Loader = ({ size = 'medium', fullScreen = false, inline = false }) => {
    let containerClass = fullScreen ? 'spinner-container fullscreen' : 'spinner-container';
    if (inline) containerClass += ' inline';

    if (inline) {
        // Compact spinner for buttons — does not affect button height
        return (
            <div className={containerClass}>
                <div className="loader-inline" />
            </div>
        );
    }

    // Standalone morphing animation for page / feature loaders
    return (
        <div className={containerClass}>
            <div className={`loader-standalone size-${size}`} />
        </div>
    );
};

export default Loader;
