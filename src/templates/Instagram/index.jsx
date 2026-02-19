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
                                    {/* Small avatar */}
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
                                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                            {job.description.map((desc, i) => (
                                                <li key={i} style={{ marginBottom: '4px' }}>{desc}</li>
                                            ))}
                                        </ul>
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
            </main>
        </div>
    );
};

export default InstagramTemplate;
