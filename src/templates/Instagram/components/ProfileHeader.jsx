import React from 'react';

const ProfileHeader = ({ userData }) => {
    const { hero, about, experience, projects, contact, socials, footer, education, codingProfiles, skills } = userData;

    const projectCount = projects?.length || 0;
    const experienceCount = experience?.length || 0;
    // Stable follower count derived from content
    const followers = experienceCount * 137 + projectCount * 73 + 248;

    // Contact extraction
    const email = footer?.email || contact?.email || '';
    const linkedin = socials?.find(s => s.name?.toLowerCase().includes('linkedin'))?.url || contact?.linkedin || '';
    const github = socials?.find(s => s.name?.toLowerCase().includes('github'))?.url || contact?.github || '';

    // Bio
    const bio = about?.description || hero?.description ||
        (Array.isArray(hero?.intro?.desc) ? hero.intro.desc.join(' ') : '') ||
        hero?.intro?.desc || '';

    // Title
    const title = hero?.title ||
        (Array.isArray(hero?.roles) ? hero.roles.filter(Boolean).join(' · ') : '') ||
        hero?.headline || '';

    // Skills array
    const skillsList = skills?.items || skills || [];

    // Total posts
    const totalPosts = projectCount + experienceCount + (education?.length || 0);

    const hasImage = hero?.image && hero.image !== '/assets/avatar-placeholder.png';

    return (
        <>
            <header className="ig-header">
                {/* Avatar with gradient ring */}
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

                {/* Profile info */}
                <section className="ig-profile-info">
                    <div className="ig-username-row">
                        <h2 className="ig-username">
                            {hero?.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}
                        </h2>
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
                        </div>
                    </div>

                    {/* Stats */}
                    <ul className="ig-stats">
                        <li className="ig-stat"><strong>{totalPosts}</strong> posts</li>
                        <li className="ig-stat"><strong>{followers}</strong> followers</li>
                        <li className="ig-stat"><strong>{experienceCount}</strong> following</li>
                    </ul>

                    {/* Bio */}
                    <div className="ig-bio">
                        <span className="ig-bio-name">{hero?.name}</span>
                        {title && <div className="ig-bio-title">{title}</div>}
                        {bio && (
                            <div className="ig-bio-desc">
                                {bio.length > 150 ? bio.substring(0, 150) + '…' : bio}
                            </div>
                        )}
                        {github && (
                            <a href={github} target="_blank" rel="noopener noreferrer" className="ig-bio-link">
                                {github.replace('https://', '').replace('http://', '')}
                            </a>
                        )}
                        {!github && linkedin && (
                            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="ig-bio-link">
                                {linkedin.replace('https://', '').replace('http://', '')}
                            </a>
                        )}

                        {/* Skill chips */}
                        {Array.isArray(skillsList) && skillsList.length > 0 && (
                            <div className="ig-bio-skills">
                                {skillsList.slice(0, 8).map((sk, i) => (
                                    <span key={i} className="ig-skill-chip">{sk}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </header>
        </>
    );
};

export default ProfileHeader;
