import React from 'react';

const PhotoGrid = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return <div className="ig-empty-grid">No Posts Yet</div>;
    }

    return (
        <div className="ig-grid">
            {projects.map((proj, index) => {
                const colors = ['#FFD700', '#FF6347', '#4682B4', '#32CD32', '#DA70D6'];
                const bgColor = colors[index % colors.length];

                return (
                    <div className="ig-photo-item" key={index} style={{ backgroundColor: bgColor }}>
                        {proj.image ? (
                            <img src={proj.image} alt={proj.title} />
                        ) : (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 'bold', fontSize: '1.2rem', padding: '10px', textAlign: 'center'
                            }}>
                                {proj.title}
                            </div>
                        )}

                        <div className="ig-photo-overlay">
                            <div className="ig-overlay-content">
                                <span>❤️ {Math.floor(Math.random() * 500) + 50}</span>
                                <span>💬 {Math.floor(Math.random() * 50) + 5}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PhotoGrid;
