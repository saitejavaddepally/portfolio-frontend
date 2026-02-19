import React from 'react';

const KnowledgePanel = ({ userData }) => {
    const { hero, skills, socials, footer, contact, about, education, achievements, codingProfiles } = userData;

    // Flexible contact extraction
    const email = footer?.email || contact?.email || '';
    const linkedin = socials?.find(s => s.name?.toLowerCase().includes('linkedin'))?.url || contact?.linkedin || '';
    const github = socials?.find(s => s.name?.toLowerCase().includes('github'))?.url || contact?.github || '';
    const otherSocials = socials?.filter(s => s.url && !s.name?.toLowerCase().includes('linkedin') && !s.name?.toLowerCase().includes('github')) || [];

    // Bio text
    const bio = about?.description || hero?.description ||
        (Array.isArray(hero?.intro?.desc) ? hero.intro.desc.join(' ') : hero?.intro?.desc) || '';

    // Title / roles
    const title = hero?.title ||
        (Array.isArray(hero?.roles) ? hero.roles.filter(Boolean).join(' · ') : '') || '';

    // Avatar initial
    const initial = hero?.name?.charAt(0)?.toUpperCase() || '?';
    const hasImage = hero?.image && hero.image !== '/assets/avatar-placeholder.png';

    // Latest education
    const latestEdu = education && education.length > 0 ? education[0] : null;

    return (
        <div className="knowledge-panel">
            {/* Hero image / gradient header */}
            <div className="panel-hero">
                {hasImage ? (
                    <>
                        <img src={hero.image} alt={hero.name} />
                        <div className="panel-hero-overlay" />
                    </>
                ) : (
                    <div className="panel-hero-initials">{initial}</div>
                )}
            </div>

            <div className="panel-content">
                <h2 className="panel-title">{hero?.name || 'Portfolio'}</h2>
                {title && <div className="panel-subtitle">{title}</div>}

                {bio && <p className="panel-desc">{bio.length > 180 ? bio.substring(0, 180) + '…' : bio}</p>}

                {/* Education */}
                {latestEdu && (
                    <div className="panel-row">
                        <span className="panel-row-icon">🎓</span>
                        <div>
                            <span className="panel-row-label">{latestEdu.degree}</span>
                            <div className="panel-row-value">{latestEdu.school}{latestEdu.year ? `, ${latestEdu.year}` : ''}</div>
                        </div>
                    </div>
                )}

                {/* Achievements count */}
                {achievements?.items && achievements.items.length > 0 && (
                    <div className="panel-row">
                        <span className="panel-row-icon">🏆</span>
                        <div>
                            <span className="panel-row-label">{achievements.title || 'Achievements'}</span>
                            <div className="panel-row-value">{achievements.items.length} recognition{achievements.items.length !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                )}

                {/* Coding Profiles */}
                {codingProfiles && codingProfiles.length > 0 && (
                    <div className="panel-row">
                        <span className="panel-row-icon">💻</span>
                        <div>
                            <span className="panel-row-label">Coding Profiles</span>
                            <div className="panel-row-value">{codingProfiles.map(p => p.platform).join(', ')}</div>
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <>
                        <hr className="panel-divider" />
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--g-secondary)', marginBottom: '0.5rem' }}>SKILLS</div>
                        <div className="panel-skills-wrap">
                            {skills.map((skill, i) => (
                                <span key={i} className="panel-skill-chip">{skill}</span>
                            ))}
                        </div>
                    </>
                )}

                {/* Social Links */}
                {(email || linkedin || github || otherSocials.length > 0) && (
                    <>
                        <hr className="panel-divider" />
                        <div className="panel-socials">
                            {email && (
                                <a href={`mailto:${email}`} className="social-link">
                                    ✉️ Email
                                </a>
                            )}
                            {linkedin && (
                                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                                    💼 LinkedIn
                                </a>
                            )}
                            {github && (
                                <a href={github} target="_blank" rel="noopener noreferrer" className="social-link">
                                    🐙 GitHub
                                </a>
                            )}
                            {otherSocials.map((s, i) => (
                                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="social-link">
                                    🔗 {s.name}
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default KnowledgePanel;
