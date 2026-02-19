import React, { useState } from 'react';
import './Instagram.css';
import ProfileHeader from './components/ProfileHeader';
import PhotoGrid from './components/PhotoGrid';

/* ── SVG Icons ── */
const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const ListIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="4" width="18" height="4" rx="1" />
        <rect x="3" y="10" width="18" height="4" rx="1" />
        <rect x="3" y="16" width="18" height="4" rx="1" />
    </svg>
);
const EduIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 3L2 8l10 5 10-5-10-5z" />
        <path d="M6 11v5c0 2 2.686 4 6 4s6-2 6-4v-5" />
        <path d="M22 8v6" strokeLinecap="round" />
    </svg>
);
const StarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

/* ── Heart / Comment / Share / Bookmark SVG icons ── */
const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" width="24" height="24" aria-label="Like">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const CommentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" width="24" height="24" aria-label="Comment">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" width="24" height="24" aria-label="Share">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);
const BookmarkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" width="24" height="24" aria-label="Save">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

/* ── Stable "likes" from string hash so they don't flicker ── */
const stableLikes = (str, min = 30, max = 700) => {
    let h = 0;
    for (let i = 0; i < (str || '').length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return min + Math.abs(h) % (max - min);
};

/* ── Highlight items ── */
const HIGHLIGHTS = [
    { label: 'Work', emoji: '💼', bg: 'linear-gradient(135deg,#f09433,#e6683c)' },
    { label: 'Projects', emoji: '🚀', bg: 'linear-gradient(135deg,#4285f4,#34a853)' },
    { label: 'Education', emoji: '🎓', bg: 'linear-gradient(135deg,#fbbc05,#ea4335)' },
    { label: 'Creds', emoji: '🏆', bg: 'linear-gradient(135deg,#bc1888,#cc2366)' },
];

/* ── Post action bar ── */
const PostActions = ({ title }) => {
    const likes = stableLikes(title);
    return (
        <>
            <div className="ig-post-actions">
                <span className="ig-action-icon"><HeartIcon /></span>
                <span className="ig-action-icon"><CommentIcon /></span>
                <span className="ig-action-icon"><ShareIcon /></span>
                <span className="ig-action-icon ig-action-icon-right"><BookmarkIcon /></span>
            </div>
            <div className="ig-post-likes">{likes.toLocaleString()} likes</div>
        </>
    );
};

/* ── Gradient palette per index ── */
const GRADIENTS = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
    'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    'linear-gradient(135deg,#fccb90,#d57eeb)',
];

const InstagramTemplate = ({ data }) => {
    const [activeTab, setActiveTab] = useState('grid');

    const TABS = [
        { id: 'grid', label: 'Posts', icon: <GridIcon /> },
        { id: 'list', label: 'Work', icon: <ListIcon /> },
        { id: 'education', label: 'Education', icon: <EduIcon /> },
        { id: 'credits', label: 'Credits', icon: <StarIcon /> },
    ];

    return (
        <div className="ig-container">
            <main className="ig-main">
                {/* Profile Header */}
                <ProfileHeader userData={data} />

                {/* Story-style section highlights */}
                <div className="ig-highlights">
                    {HIGHLIGHTS.map((h) => (
                        <div className="ig-highlight-item" key={h.label}>
                            <div className="ig-highlight-ring">
                                <div className="ig-highlight-inner">
                                    <div className="ig-highlight-circle" style={{ background: h.bg }}>
                                        <span style={{ fontSize: '1.4rem' }}>{h.emoji}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="ig-highlight-label">{h.label}</span>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <nav className="ig-nav" role="tablist">
                    {TABS.map(({ id, label, icon }) => (
                        <div
                            key={id}
                            className={`ig-tab ${activeTab === id ? 'active' : ''}`}
                            role="tab"
                            aria-selected={activeTab === id}
                            onClick={() => setActiveTab(id)}
                        >
                            {icon}
                            <span className="ig-tab-label">{label}</span>
                        </div>
                    ))}
                </nav>

                {/* ── POSTS (Projects grid) ── */}
                {activeTab === 'grid' && (
                    <PhotoGrid projects={data.projects} />
                )}

                {/* ── WORK (Experience feed) ── */}
                {activeTab === 'list' && (
                    <div className="ig-feed">
                        {data.experience && data.experience.length > 0 ? data.experience.map((job, index) => (
                            <article className="ig-post" key={index}>
                                <div className="ig-post-header">
                                    {data.hero?.image && data.hero.image !== '/assets/avatar-placeholder.png' ? (
                                        <div className="ig-post-avatar">
                                            <img src={data.hero.image} alt={data.hero.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        </div>
                                    ) : (
                                        <div className="ig-post-avatar" style={{ background: GRADIENTS[index % GRADIENTS.length] }}>
                                            {job.company?.charAt(0)}
                                        </div>
                                    )}
                                    <div className="ig-post-meta">
                                        <span className="ig-post-username">{job.company}</span>
                                        <div className="ig-post-date">{job.dates}</div>
                                    </div>
                                    <span className="ig-post-more">···</span>
                                </div>

                                {/* Colorful banner */}
                                <div className="ig-post-banner" style={{ background: GRADIENTS[index % GRADIENTS.length] }}>
                                    <span className="ig-post-banner-letter">{job.company?.charAt(0)}</span>
                                    <div className="ig-post-banner-title">{job.role}</div>
                                </div>

                                <div className="ig-post-body">
                                    <PostActions title={job.role + job.company} />
                                    <div className="ig-post-caption">
                                        <strong>{data.hero?.name?.toLowerCase().replace(/\s/g, '_')}</strong>&nbsp;
                                        {Array.isArray(job.description) ? (
                                            <ul className="ig-post-desc-list">
                                                {job.description.map((d, i) => <li key={i}>{d}</li>)}
                                            </ul>
                                        ) : (
                                            <span>{job.description}</span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        )) : (
                            <div className="ig-empty-grid">No work experience added yet.</div>
                        )}
                    </div>
                )}

                {/* ── EDUCATION ── */}
                {activeTab === 'education' && (
                    <div className="ig-feed">
                        {data.education && data.education.length > 0 ? data.education.map((edu, index) => (
                            <article className="ig-post" key={index}>
                                <div className="ig-post-header">
                                    <div className="ig-post-avatar" style={{ background: GRADIENTS[(index + 2) % GRADIENTS.length] }}>
                                        {edu.school?.charAt(0)}
                                    </div>
                                    <div className="ig-post-meta">
                                        <span className="ig-post-username">{edu.school}</span>
                                        <div className="ig-post-date">{edu.year}</div>
                                    </div>
                                </div>

                                <div className="ig-post-banner" style={{ background: GRADIENTS[(index + 2) % GRADIENTS.length] }}>
                                    <span className="ig-post-banner-letter">{edu.school?.charAt(0)}</span>
                                    <div className="ig-post-banner-title">{edu.degree}</div>
                                </div>

                                <div className="ig-post-body">
                                    <PostActions title={edu.school + edu.degree} />
                                    <div className="ig-post-caption">
                                        <strong>{data.hero?.name?.toLowerCase().replace(/\s/g, '_')}</strong>&nbsp;
                                        {edu.description}
                                    </div>
                                    {edu.tags && (
                                        <div className="ig-post-tags">
                                            {(Array.isArray(edu.tags) ? edu.tags : edu.tags.split(',')).map((t, i) => (
                                                <span key={i} className="ig-post-tag">#{t.trim()}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </article>
                        )) : (
                            <div className="ig-empty-grid">No education added yet.</div>
                        )}
                    </div>
                )}

                {/* ── CREDITS (Achievements + Coding Profiles) ── */}
                {activeTab === 'credits' && (
                    <div className="ig-feed">
                        {/* Achievements card */}
                        {data.achievements?.items && data.achievements.items.length > 0 && (
                            <>
                                <div className="ig-feed-section-title">Achievements</div>
                                <div className="ig-cred-card">
                                    <div className="ig-cred-header">
                                        <div className="ig-cred-icon" style={{ background: 'linear-gradient(135deg,#fbbc05,#f09433)' }}>
                                            <span style={{ fontSize: '1.3rem' }}>🏆</span>
                                        </div>
                                        <div>
                                            <div className="ig-cred-title">{data.achievements.title || 'Achievements'}</div>
                                            <div className="ig-cred-sub">{data.achievements.items.length} highlights</div>
                                        </div>
                                    </div>
                                    <div className="ig-cred-body">
                                        <ul className="ig-cred-list">
                                            {data.achievements.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Coding profiles */}
                        {data.codingProfiles && data.codingProfiles.length > 0 && (
                            <>
                                <div className="ig-feed-section-title">Coding Profiles</div>
                                {data.codingProfiles.map((prof, index) => (
                                    <a
                                        key={index}
                                        href={prof.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ig-profile-link-card"
                                    >
                                        <div className="ig-profile-link-icon" style={{ background: GRADIENTS[(index + 4) % GRADIENTS.length] }}>
                                            <span style={{ fontSize: '1.3rem', color: '#fff' }}>{'</>'[index % 3] || '⚡'}</span>
                                        </div>
                                        <div className="ig-profile-link-info">
                                            <div className="ig-profile-link-name">{prof.platform}</div>
                                            <div className="ig-profile-link-handle">
                                                @{prof.username}
                                                {prof.rating && <span style={{ marginLeft: '8px', color: '#fbbc05', fontWeight: 700 }}>★ {prof.rating}</span>}
                                            </div>
                                        </div>
                                        <span className="ig-profile-link-arrow">›</span>
                                    </a>
                                ))}
                            </>
                        )}

                        {(!data.achievements?.items?.length && !data.codingProfiles?.length) && (
                            <div className="ig-empty-grid">No credentials added yet.</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default InstagramTemplate;
