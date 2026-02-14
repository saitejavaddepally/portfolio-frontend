import React, { useEffect } from 'react';
import '../css/Toast.css';

const Toast = ({ message, type, onClose }) => {
    return (
        <div className={`toast toast-${type}`}>
            <span className="toast-message">{message}</span>
            <button onClick={onClose} className="toast-close">×</button>
        </div>
    );
};

export default Toast;
