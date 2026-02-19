import React from 'react';

const ProfileHeader = ({ userData }) => {
    const { hero, about, experience, projects, contact } = userData;
    const projectCount = projects?.length || 0;
    const followers = (experience?.length || 0) * 100 + projectCount * 50 + 150; // Fake calc

    return (
        <header className="ig-header">
            <div className="ig-avatar-container">
                {hero?.image ? (
                    <img src={hero.image} alt={hero.name} className="ig-avatar" />
                ) : (
                    <div className="ig-avatar" style={{ background: '#dbdbdb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#fff' }}>
                        {hero?.name?.charAt(0)}
                    </div>
                )}
            </div>

            <section className="ig-profile-info">
                <div className="ig-username-row">
                    <h2 className="ig-username">{hero?.name?.toLowerCase().replace(/\s/g, '_') || 'user'}</h2>
                    <div style={{ display: 'flex' }}>
                        <button className="ig-follow-btn"
                            onClick={() => contact?.linkedin && window.open(contact.linkedin, '_blank')}
                        >
                            Follow
                        </button>
                        <button className="ig-message-btn"
                            onClick={() => contact?.email && (window.location.href = `mailto:${contact.email}`)}
                        >
                            Message
                        </button>
                    </div>
                </div>

                <ul className="ig-stats">
                    <li className="ig-stat"><strong>{projectCount}</strong> posts</li>
                    <li className="ig-stat"><strong>{followers}</strong> followers</li>
                    <li className="ig-stat"><strong>{experience?.length || 0}</strong> following</li>
                </ul>

                <div className="ig-bio">
                    <span className="ig-bio-name">{hero?.name}</span>
                    <div style={{ whiteSpace: 'pre-line', marginBottom: '4px' }}>
                        {hero?.title}
                        {'\n'}
                        {about?.description || hero?.description}
                    </div>
                    {contact?.github && (
                        <a href={contact.github} target="_blank" rel="noopener noreferrer" className="ig-bio-link">
                            {contact.github.replace('https://', '')}
                        </a>
                    )}
                </div>
            </section>
        </header>
    );
};

export default ProfileHeader;
