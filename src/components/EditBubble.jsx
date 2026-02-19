import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Floating "Missed something? Edit" bubble shown in preview mode.
 * Only renders when isEditing=false AND user is logged in as owner.
 */
const EditBubble = ({ portfolioStyle }) => {
    const navigate = useNavigate();
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const handleEdit = () => {
        // Editing always happens in the Medium editor — all templates draw from the same data.
        navigate(`/?portfolioStyle=medium&edit=true`);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '28px',
            right: '24px',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '50px',
            padding: '10px 16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            animation: 'bubbleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            fontFamily: 'Inter, sans-serif',
        }}>
            <style>{`
                @keyframes bubbleIn {
                    from { opacity: 0; transform: translateY(16px) scale(0.95); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .edit-bubble-edit-btn {
                    background: #111;
                    color: #fff;
                    border: none;
                    border-radius: 30px;
                    padding: 6px 14px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                    font-family: inherit;
                    white-space: nowrap;
                }
                .edit-bubble-edit-btn:hover { background: #333; }
                .edit-bubble-dismiss {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    font-size: 1rem;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0 2px;
                }
                .edit-bubble-dismiss:hover { color: #6b7280; }
                @media (max-width: 600px) {
                    .edit-bubble-root {
                        bottom: 16px !important;
                        right: 12px !important;
                        left: 12px !important;
                        right: 12px !important;
                        border-radius: 16px !important;
                        justify-content: space-between;
                    }
                }
            `}</style>

            <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500, whiteSpace: 'nowrap' }}>
                ✏️ Missed something?
            </span>
            <button className="edit-bubble-edit-btn" onClick={handleEdit}>
                Edit
            </button>
            <button
                className="edit-bubble-dismiss"
                onClick={() => setDismissed(true)}
                title="Dismiss"
            >
                ×
            </button>
        </div>
    );
};

export default EditBubble;
