import React from 'react';

const KnowledgePanel = ({ userData }) => {
    const { hero, skills, socials, footer, contact, about } = userData;

    // Flexible contact extraction — data may live in different places
    const email = footer?.email || contact?.email || '';
    const linkedin = socials?.find(s => s.name?.toLowerCase().includes('linkedin'))?.url || contact?.linkedin || '';
    const github = socials?.find(s => s.name?.toLowerCase().includes('github'))?.url || contact?.github || '';

    // Bio text — check multiple possible fields
    const bio = about?.description || hero?.description ||
        (Array.isArray(hero?.intro?.desc) ? hero.intro.desc.join(' ') : '') ||
        hero?.intro?.desc || '';

    // Title/headline — roles array or title string
    const title = hero?.title ||
        (Array.isArray(hero?.roles) ? hero.roles.filter(Boolean).join(' · ') : '') ||
        hero?.headline || '';

    return (
        <div className="knowledge-panel">
            <div className="panel-images">
                <div style={{ flex: 1, backgroundColor: '#f1f3f4', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {hero?.image && hero.image !== '/assets/avatar-placeholder.png' ? (
                        <img src={hero.image} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ fontSize: '3rem', color: '#ccc', fontWeight: 'bold' }}>{hero?.name?.charAt(0)}</div>
                    )}
                </div>
            </div>

            <div className="panel-content">
                <h2 className="panel-title">{hero?.name}</h2>
                {title && <div className="panel-subtitle">{title}</div>}

                {bio && (
                    <p className="panel-desc">{bio}</p>
                )}

                {skills && skills.length > 0 && (
                    <div className="panel-row">
                        <div className="panel-label">Skills:</div>
                        <div style={{ lineHeight: '1.6' }}>
                            {skills.join(', ')}
                        </div>
                    </div>
                )}

                <div className="panel-socials">
                    {email && (
                        <a href={`mailto:${email}`} className="social-link">Email</a>
                    )}
                    {linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                    )}
                    {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
                    )}
                    {socials && socials
                        .filter(s => !s.name?.toLowerCase().includes('linkedin') && !s.name?.toLowerCase().includes('github'))
                        .map((s, i) => s.url && (
                            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="social-link">{s.name}</a>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default KnowledgePanel;
