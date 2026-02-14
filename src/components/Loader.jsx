import React from 'react';
import '../css/Loader.css';

const Loader = ({ size = 'medium', color = 'currentColor' }) => {
    return (
        <div className={`loader loader-${size}`} style={{ borderColor: `${color} transparent transparent transparent` }}>
            <div></div><div></div><div></div><div></div>
        </div>
    );
};

export default Loader;
