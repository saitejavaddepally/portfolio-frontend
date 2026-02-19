import React from 'react';

const KnowledgePanel = ({ userData }) => {
    const { hero, about, skills, contact } = userData;

    // Image source: hero image or placeholder
    const imageSrc = hero?.image || 'https://via.placeholder.com/150';

    return (
        <div className="knowledge-panel">
            <div className="panel-images">
                {/* Simulated image carousel */}
                <div style={{ flex: 1, backgroundColor: '#f1f3f4', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {hero?.image ? (
                        <img src={hero.image} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ fontSize: '3rem', color: '#ccc' }}>{hero?.name?.charAt(0)}</div>
                    )}
                </div>
            </div>

            <div className="panel-content">
                <h2 className="panel-title">{hero?.name}</h2>
                <div className="panel-subtitle">{hero?.title}</div>

                <p className="panel-desc">
                    {about?.description || hero?.description}
                </p>

                {skills && skills.length > 0 && (
                    <div className="panel-row">
                        <div className="panel-label">Skills:</div>
                        <div style={{ lineHeight: '1.6' }}>
                            {skills.join(', ')}
                        </div>
                    </div>
                )}

                {contact && (
                    <div className="panel-socials">
                        {contact.email && (
                            <a href={`mailto:${contact.email}`} className="social-link">Email</a>
                        )}
                        {contact.linkedin && (
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                        )}
                        {contact.github && (
                            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgePanel;
