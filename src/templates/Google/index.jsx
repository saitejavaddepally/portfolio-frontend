import React, { useState, useMemo } from 'react';
import './Google.css';
import SearchResult from './components/SearchResult';
import KnowledgePanel from './components/KnowledgePanel';

const TAB_ICONS = {
    All: '⊞',
    Work: '💼',
    Projects: '🚀',
    Education: '🎓',
    Achievements: '🏆',
    Profiles: '💻',
};

const GoogleTemplate = ({ data }) => {
    const [activeTab, setActiveTab] = useState('All');

    // Pre-compute counts for tab badges
    const counts = useMemo(() => ({
        Work: data.experience?.length || 0,
        Projects: data.projects?.length || 0,
        Education: data.education?.length || 0,
        Achievements: data.achievements?.items?.length || 0,
        Profiles: data.codingProfiles?.length || 0,
    }), [data]);

    const totalResults = Object.values(counts).reduce((a, b) => a + b, 0);

    // Derived info for header
    const name = data.hero?.name || 'Portfolio';
    const hasAvatar = data.hero?.image && data.hero.image !== '/assets/avatar-placeholder.png';
    const initial = name.charAt(0).toUpperCase();
    const queryText = name + (data.hero?.roles?.[0] ? ` — ${data.hero.roles[0]}` : '');

    const tabs = ['All', 'Work', 'Projects', 'Education', 'Achievements', 'Profiles'];

    // ── Renderers ──────────────────────────────────────────────
    const renderExperience = () => (
        <>
            {data.experience && data.experience.length > 0 ? (
                <>
                    <div className="section-label">💼 Work Experience</div>
                    {data.experience.map((job, i) => (
                        <SearchResult
                            key={`exp-${i}`}
                            type="Experience"
                            title={job.role}
                            company={job.company}
                            subtitle={job.dates}
                            description={job.description}
                            tags={job.tech || job.skills || []}
                            dateRange={job.dates}
                            sitelinks={Array.isArray(job.description) ? job.description.slice(0, 4) : []}
                            url={job.companyUrl || '#'}
                        />
                    ))}
                </>
            ) : (
                <p style={{ color: 'var(--g-secondary)', fontSize: '0.9rem' }}>No work experience added yet.</p>
            )}
        </>
    );

    const renderProjects = () => (
        <>
            {data.projects && data.projects.length > 0 ? (
                <>
                    <div className="section-label">🚀 Projects</div>
                    {data.projects.map((proj, i) => {
                        const projTechs = proj.tech ? (Array.isArray(proj.tech) ? proj.tech : [proj.tech]) : [];
                        return (
                            <SearchResult
                                key={`proj-${i}`}
                                type="Project"
                                title={proj.title}
                                subtitle="Personal Project"
                                description={proj.description}
                                tags={projTechs.slice(0, 3)}
                                url={proj.link || proj.github || '#'}
                            />
                        );
                    })}
                </>
            ) : (
                <p style={{ color: 'var(--g-secondary)', fontSize: '0.9rem' }}>No projects added yet.</p>
            )}
        </>
    );

    const renderEducation = () => (
        <>
            {data.education && data.education.length > 0 ? (
                <>
                    <div className="section-label">🎓 Education</div>
                    {data.education.map((edu, i) => (
                        <SearchResult
                            key={`edu-${i}`}
                            type="Education"
                            title={edu.degree}
                            company={edu.school}
                            subtitle={edu.year}
                            description={edu.description ? [edu.description] : []}
                            dateRange={edu.year}
                            url={edu.schoolUrl || '#'}
                        />
                    ))}
                </>
            ) : (
                <p style={{ color: 'var(--g-secondary)', fontSize: '0.9rem' }}>No education entries added yet.</p>
            )}
        </>
    );

    const renderAchievements = () => (
        <>
            {data.achievements?.items && data.achievements.items.length > 0 ? (
                <>
                    <div className="section-label">🏆 Achievements & Credentials</div>
                    {data.achievements.items.map((item, i) => (
                        <SearchResult
                            key={`ach-${i}`}
                            type="Achievement"
                            title={item}
                            company={data.achievements.org || data.achievements.title}
                            subtitle={data.achievements.type || 'Award'}
                            description={[]}
                            url="#"
                        />
                    ))}
                </>
            ) : (
                <p style={{ color: 'var(--g-secondary)', fontSize: '0.9rem' }}>No achievements added yet.</p>
            )}
        </>
    );

    const renderProfiles = () => (
        <>
            {data.codingProfiles && data.codingProfiles.length > 0 ? (
                <>
                    <div className="section-label">💻 Coding Profiles</div>
                    {data.codingProfiles.map((prof, i) => (
                        <SearchResult
                            key={`prof-${i}`}
                            type="Profile"
                            title={`${prof.platform} — ${prof.username || 'View Profile'}`}
                            subtitle="Coding Platform"
                            description={[`Active on ${prof.platform}. ${prof.rating ? `Rating: ${prof.rating}` : ''}`]}
                            url={prof.url}
                        />
                    ))}
                </>
            ) : (
                <p style={{ color: 'var(--g-secondary)', fontSize: '0.9rem' }}>No coding profiles added yet.</p>
            )}
        </>
    );

    // ── Skills featured block inside "All" tab ──
    const renderSkillsBlock = () => {
        if (!data.skills || data.skills.length === 0) return null;
        return (
            <div style={{
                border: '1px solid var(--g-border)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                background: 'var(--g-surface)',
                animation: 'fadeSlideIn 0.35s ease both',
            }}>
                <div className="section-label" style={{ marginTop: 0 }}>⚡ Skills & Technologies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem' }}>
                    {data.skills.map((skill, i) => (
                        <span key={i} className={`result-badge ${['badge-blue', 'badge-green', 'badge-purple', 'badge-red', 'badge-yellow'][i % 5]}`}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="google-container">
            {/* ── Header ── */}
            <header className="google-header">
                <div className="google-top-bar">
                    <div className="google-logo">
                        <span className="g-blue">G</span>
                        <span className="g-red">o</span>
                        <span className="g-yellow">o</span>
                        <span className="g-blue">g</span>
                        <span className="g-green">l</span>
                        <span className="g-red">e</span>
                    </div>

                    <div className="google-search-bar">
                        <span className="search-icon">🔍</span>
                        <input value={queryText} readOnly />
                        <span style={{ color: 'var(--g-secondary)', fontSize: '1.1rem', cursor: 'pointer' }}>✕</span>
                    </div>

                    <div className="google-avatar">
                        {hasAvatar
                            ? <img src={data.hero.image} alt={name} />
                            : initial
                        }
                    </div>
                </div>

                {/* Tabs */}
                <nav className="google-nav">
                    {tabs.map(tab => (
                        <div
                            key={tab}
                            className={`google-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            <span>{TAB_ICONS[tab]}</span>
                            <span>{tab}</span>
                            {tab !== 'All' && counts[tab] > 0 && (
                                <span className="tab-count">{counts[tab]}</span>
                            )}
                        </div>
                    ))}
                </nav>
            </header>

            {/* ── Content ── */}
            <main className="google-content">
                <div className="google-main-col">
                    <div className="search-meta">
                        About {(totalResults * 12300).toLocaleString()} results&nbsp;&nbsp;
                        <span style={{ opacity: 0.7 }}>({(Math.random() * 0.3 + 0.15).toFixed(2)} seconds)</span>
                    </div>

                    {/* All tab: show everyone */}
                    {activeTab === 'All' && (
                        <>
                            {renderSkillsBlock()}
                            {renderExperience()}
                            {renderProjects()}
                            {renderEducation()}
                            {renderAchievements()}
                            {renderProfiles()}
                        </>
                    )}
                    {activeTab === 'Work' && renderExperience()}
                    {activeTab === 'Projects' && renderProjects()}
                    {activeTab === 'Education' && renderEducation()}
                    {activeTab === 'Achievements' && renderAchievements()}
                    {activeTab === 'Profiles' && renderProfiles()}
                </div>

                {/* ── Knowledge Panel ── */}
                <aside className="google-side-col">
                    <KnowledgePanel userData={data} />
                </aside>
            </main>
        </div>
    );
};

export default GoogleTemplate;
