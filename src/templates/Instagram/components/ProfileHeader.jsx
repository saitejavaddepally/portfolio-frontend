import React from 'react';

const ProfileHeader = ({ userData, theme, toggleTheme }) => {
    const { hero, about, experience, projects, contact, socials, footer, education, skills } = userData;

    const projectCount = projects?.length || 0;
    const experienceCount = experience?.length || 0;
    const followers = experienceCount * 137 + projectCount * 73 + 248;

    const email = footer?.email || contact?.email || '';
    const linkedin = socials?.find(s => s.name?.toLowerCase().includes('linkedin'))?.url || contact?.linkedin || '';
    const github = socials?.find(s => s.name?.toLowerCase().includes('github'))?.url || contact?.github || '';

    const bio = about?.description || hero?.description ||
        (Array.isArray(hero?.intro?.desc) ? hero.intro.desc.join(' ') : '') ||
        hero?.intro?.desc || '';

    const title = hero?.title ||
        (Array.isArray(hero?.roles) ? hero.roles.filter(Boolean).join(' · ') : '') ||
        hero?.headline || '';

    const skillsList = skills?.items || (Array.isArray(skills) ? skills : []);
    const totalPosts = projectCount + experienceCount + (education?.length || 0);
    const hasImage = hero?.image && hero.image !== '/assets/avatar-placeholder.png';

    return (
        <div className="ig-profile-block">
            {/* ── Top row: Avatar + Username/Buttons ── */}
            <div className="ig-top-row">
                <div className="ig-avatar-wrap">
                    <div className="ig-avatar-inner">
                        {hasImage ? (
                            <img src={hero.image} alt={hero?.name} className="ig-avatar" />
                        ) : (
                            <div className="ig-avatar-initial">
                                {hero?.name?.charAt(0) || '?'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="ig-top-info">
                    <div className="ig-username-row">
                        <h2 className="ig-username">
                            {hero?.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}
                        </h2>
                    </div>
                    <div className="ig-action-btns">
                        <button
                            className="ig-follow-btn"
                            onClick={() => linkedin && window.open(linkedin, '_blank')}
                        >
                            Follow
                        </button>
                        <button
                            className="ig-message-btn"
                            onClick={() => email && (window.location.href = `mailto:${email}`)}
                        >
                            Message
                        </button>
                        {toggleTheme && (
                            <button
                                onClick={toggleTheme}
                                style={{
                                    background: 'none',
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    padding: '5px 10px',
                                    borderRadius: '8px',
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: '5px'
                                }}
                                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {theme === 'dark' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                )}
                            </button>
                        )}
                    </div>
                    {/* Stats — visible on desktop only, moved below on mobile */}
                    <ul className="ig-stats ig-stats-desktop">
                        <li className="ig-stat"><strong>{totalPosts}</strong>&nbsp;posts</li>
                        <li className="ig-stat"><strong>{followers}</strong>&nbsp;followers</li>
                        <li className="ig-stat"><strong>{experienceCount}</strong>&nbsp;following</li>
                    </ul>
                </div>
            </div>

            {/* ── Stats bar — full-width on mobile ── */}
            <ul className="ig-stats ig-stats-mobile">
                <li className="ig-stat"><strong>{totalPosts}</strong><span>posts</span></li>
                <li className="ig-stat"><strong>{followers}</strong><span>followers</span></li>
                <li className="ig-stat"><strong>{experienceCount}</strong><span>following</span></li>
            </ul>

            {/* ── Bio — always full-width ── */}
            <div className="ig-bio">
                <span className="ig-bio-name">{hero?.name}</span>
                {title && <div className="ig-bio-title">{title}</div>}
                {bio && (
                    <div className="ig-bio-desc">
                        {bio.length > 160 ? bio.substring(0, 160) + '…' : bio}
                    </div>
                )}
                {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" className="ig-bio-link">
                        {github.replace(/https?:\/\//, '')}
                    </a>
                )}
                {!github && linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="ig-bio-link">
                        {linkedin.replace(/https?:\/\//, '')}
                    </a>
                )}
                {Array.isArray(skillsList) && skillsList.length > 0 && (
                    <div className="ig-bio-skills">
                        {skillsList.slice(0, 8).map((sk, i) => (
                            <span key={i} className="ig-skill-chip">{sk}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
