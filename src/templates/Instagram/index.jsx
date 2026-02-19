import React, { useState } from 'react';
import './Instagram.css';
import ProfileHeader from './components/ProfileHeader';
import PhotoGrid from './components/PhotoGrid';

const InstagramTemplate = ({ data, isEditing, setUserData }) => {
    const [activeTab, setActiveTab] = useState('grid');

    return (
        <div className="ig-container">
            <main className="ig-main">
                <ProfileHeader userData={data} />

                <nav className="ig-nav">
                    <div
                        className={`ig-tab ${activeTab === 'grid' ? 'active' : ''}`}
                        onClick={() => setActiveTab('grid')}
                    >
                        <span style={{ fontSize: '12px' }}>POSTS</span>
                    </div>
                    <div
                        className={`ig-tab ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        <span style={{ fontSize: '12px' }}>EXPERIENCE</span>
                    </div>
                    <div
                        className={`ig-tab ${activeTab === 'education' ? 'active' : ''}`}
                        onClick={() => setActiveTab('education')}
                    >
                        <span style={{ fontSize: '12px' }}>EDUCATION</span>
                    </div>
                    <div
                        className={`ig-tab ${activeTab === 'credits' ? 'active' : ''}`}
                        onClick={() => setActiveTab('credits')}
                    >
                        <span style={{ fontSize: '12px' }}>CREDITS</span>
                    </div>
                    {/* <div className="ig-tab">TAGGED</div> */}
                </nav>

                {activeTab === 'grid' && (
                    <PhotoGrid projects={data.projects} />
                )}

                {activeTab === 'list' && (
                    <div className="ig-feed">
                        {data.experience && data.experience.map((job, index) => (
                            <article className="ig-post" key={index}>
                                <div className="ig-post-header">
                                    {data.hero?.image ? (
                                        <img src={data.hero.image} alt={data.hero.name} className="ig-post-user-img" />
                                    ) : (
                                        <div className="ig-post-user-img" style={{ background: '#dbdbdb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#fff' }}>{data.hero?.name?.charAt(0)}</div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="ig-post-username">{job.company}</span>
                                        <span style={{ fontSize: '11px', color: '#8e8e8e' }}>{job.dates}</span>
                                    </div>
                                    <div style={{ marginLeft: 'auto', cursor: 'pointer' }}>•••</div>
                                </div>

                                <div className="ig-post-content">
                                    <div className="ig-post-title">{job.role}</div>
                                    <div className="ig-post-desc">
                                        {Array.isArray(job.description) ? (
                                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                {job.description.map((desc, i) => (
                                                    <li key={i} style={{ marginBottom: '4px' }}>{desc}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ margin: 0 }}>{job.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--ig-border)', display: 'flex', gap: '16px', fontSize: '24px' }}>
                                    <span>❤️</span> <span>💬</span> <span>🚀</span>
                                    <span style={{ marginLeft: 'auto' }}>🔖</span>
                                </div>
                                <div style={{ padding: '0 16px 16px', fontSize: '14px', fontWeight: '600' }}>
                                    {Math.floor(Math.random() * 200) + 20} likes
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {activeTab === 'education' && (
                    <div className="ig-feed">
                        {data.education && data.education.map((edu, index) => (
                            <article className="ig-post" key={`edu-${index}`}>
                                <div className="ig-post-header">
                                    <div className="ig-post-user-img" style={{ background: '#fafafa', border: '1px solid #dbdbdb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎓</div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="ig-post-username">{edu.school}</span>
                                        <span style={{ fontSize: '11px', color: '#8e8e8e' }}>{edu.year}</span>
                                    </div>
                                </div>
                                <div className="ig-post-content">
                                    <div className="ig-post-title">{edu.degree}</div>
                                    <div className="ig-post-desc" style={{ marginTop: '8px' }}>
                                        {edu.description}
                                    </div>
                                </div>
                                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--ig-border)', display: 'flex', gap: '16px', fontSize: '24px' }}>
                                    <span>🎓</span>
                                </div>
                                <div style={{ padding: '0 16px 16px', fontSize: '14px', fontWeight: '600' }}>
                                    Alumni
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {activeTab === 'credits' && (
                    <div className="ig-feed">
                        {/* Achievements */}
                        {data.achievements?.items && (
                            <article className="ig-post">
                                <div className="ig-post-header">
                                    <div className="ig-post-user-img" style={{ background: '#fff7d6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏆</div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="ig-post-username">{data.achievements.title || "Achievements"}</span>
                                        <span style={{ fontSize: '11px', color: '#8e8e8e' }}>Highlights</span>
                                    </div>
                                </div>
                                <div className="ig-post-content">
                                    <div className="ig-post-desc">
                                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                            {data.achievements.items.map((item, i) => (
                                                <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--ig-border)', display: 'flex', gap: '16px', fontSize: '24px' }}>
                                    <span>🏆</span> <span>👏</span>
                                </div>
                            </article>
                        )}

                        {/* Profiles */}
                        {data.codingProfiles && data.codingProfiles.map((prof, index) => (
                            <article className="ig-post" key={`prof-${index}`}>
                                <div className="ig-post-header">
                                    <div className="ig-post-user-img" style={{ background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💻</div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="ig-post-username">{prof.platform}</span>
                                        <span style={{ fontSize: '11px', color: '#8e8e8e' }}>@{prof.username}</span>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <a href={prof.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0095f6', fontWeight: '600', fontSize: '14px' }}>Visit</a>
                                    </div>
                                </div>
                                <div className="ig-post-content">
                                    <div className="ig-post-desc">
                                        Check out my coding activity and stats on {prof.platform}.
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default InstagramTemplate;
