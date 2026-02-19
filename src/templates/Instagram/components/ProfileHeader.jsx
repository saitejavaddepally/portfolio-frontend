import React from 'react';

const ProfileHeader = ({ userData }) => {
    const { hero, about, experience, projects, contact, socials, footer, education, codingProfiles } = userData;

    const projectCount = projects?.length || 0;
    const experienceCount = experience?.length || 0;
    const followers = experienceCount * 100 + projectCount * 50 + 150;

    // Flexible contact extraction
    const email = footer?.email || contact?.email || '';
    const linkedin = socials?.find(s => s.name?.toLowerCase().includes('linkedin'))?.url || contact?.linkedin || '';
    const github = socials?.find(s => s.name?.toLowerCase().includes('github'))?.url || contact?.github || '';

    // Bio / description
    const bio = about?.description || hero?.description ||
        (Array.isArray(hero?.intro?.desc) ? hero.intro.desc.join(' ') : '') ||
        hero?.intro?.desc || '';

    // Title / roles
    const title = hero?.title ||
        (Array.isArray(hero?.roles) ? hero.roles.filter(Boolean).join(' · ') : '') ||
        hero?.headline || '';

    // Total posts count (projects + experience + education)
    const totalPosts = projectCount + experienceCount + (education?.length || 0) + (codingProfiles?.length || 0);

    return (
        <header className="ig-header">
            <div className="ig-avatar-container">
                {hero?.image && hero.image !== '/assets/avatar-placeholder.png' ? (
                    <img src={hero.image} alt={hero.name} className="ig-avatar" />
                ) : (
                    <div className="ig-avatar" style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#fff', fontWeight: 'bold' }}>
                        {hero?.name?.charAt(0)}
                    </div>
                )}
            </div>

            <section className="ig-profile-info">
                <div className="ig-username-row">
                    <h2 className="ig-username">{hero?.name?.toLowerCase().replace(/\s/g, '_') || 'user'}</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="ig-follow-btn"
                            onClick={() => linkedin && window.open(linkedin, '_blank')}
                        >
                            Follow
                        </button>
                        <button className="ig-message-btn"
                            onClick={() => email && (window.location.href = `mailto:${email}`)}
                        >
                            Message
                        </button>
                    </div>
                </div>

                <ul className="ig-stats">
                    <li className="ig-stat"><strong>{totalPosts}</strong> posts</li>
                    <li className="ig-stat"><strong>{followers}</strong> followers</li>
                    <li className="ig-stat"><strong>{experienceCount}</strong> following</li>
                </ul>

                <div className="ig-bio">
                    <span className="ig-bio-name">{hero?.name}</span>
                    {title && <div style={{ color: '#8e8e8e', fontSize: '14px', marginBottom: '4px' }}>{title}</div>}
                    {bio && <div style={{ whiteSpace: 'pre-line', marginBottom: '6px', fontSize: '14px' }}>{bio}</div>}
                    {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer" className="ig-bio-link">
                            {github.replace('https://', '')}
                        </a>
                    )}
                    {!github && linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="ig-bio-link">
                            {linkedin.replace('https://', '')}
                        </a>
                    )}
                </div>
            </section>
        </header>
    );
};

export default ProfileHeader;
