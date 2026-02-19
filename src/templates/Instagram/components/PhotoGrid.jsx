import React from 'react';

/* Stable number from string hash */
const stableNum = (str, min, max) => {
    let h = 0;
    for (let i = 0; i < (str || '').length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return min + Math.abs(h) % (max - min);
};

const GRADIENTS = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
    'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    'linear-gradient(135deg,#fccb90,#d57eeb)',
];

/* Heart + comment SVG */
const HeartSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const CommentSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const PhotoGrid = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="ig-grid">
                <div className="ig-empty-grid">No projects added yet.</div>
            </div>
        );
    }

    return (
        <div className="ig-grid">
            {projects.map((proj, index) => {
                const bg = GRADIENTS[index % GRADIENTS.length];
                const likes = stableNum(proj.title, 50, 600);
                const comments = stableNum(proj.title + 'c', 5, 80);

                return (
                    <div className="ig-photo-item" key={index} style={{ background: bg }}>
                        {proj.image ? (
                            <img src={proj.image} alt={proj.title} />
                        ) : (
                            <div className="ig-photo-tile">
                                {proj.title}
                            </div>
                        )}

                        <div className="ig-photo-overlay">
                            <div className="ig-overlay-stats">
                                <span className="ig-overlay-stat">
                                    <HeartSVG /> {likes}
                                </span>
                                <span className="ig-overlay-stat">
                                    <CommentSVG /> {comments}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PhotoGrid;
