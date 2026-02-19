import React, { useState, useMemo } from 'react';
import './Google.css';
import SearchResult from './components/SearchResult';
import KnowledgePanel from './components/KnowledgePanel';
import { Icons } from './components/Icons';

const TABS = [
    { id: 'All', icon: Icons.all },
    { id: 'Work', icon: Icons.work },
    { id: 'Projects', icon: Icons.projects },
    { id: 'Education', icon: Icons.education },
    { id: 'Achievements', icon: Icons.achievements },
    { id: 'Profiles', icon: Icons.profiles },
];

const SECTION_ICONS = {
    skills: Icons.skills,
    work: Icons.work,
    projects: Icons.projects,
    education: Icons.education,
    achievements: Icons.achievements,
    profiles: Icons.profiles,
};

const GoogleTemplate = ({ data }) => {
    const [activeTab, setActiveTab] = useState('All');

    const counts = useMemo(() => ({
        Work: data.experience?.length || 0,
        Projects: data.projects?.length || 0,
        Education: data.education?.length || 0,
        Achievements: data.achievements?.items?.length || 0,
        Profiles: data.codingProfiles?.length || 0,
    }), [data]);

    const totalResults = Object.values(counts).reduce((a, b) => a + b, 0);

    const name = data.hero?.name || 'Portfolio';
    const hasAvatar = data.hero?.image && data.hero.image !== '/assets/avatar-placeholder.png';
    const initial = name.charAt(0).toUpperCase();
    const queryText = name + (data.hero?.roles?.[0] ? ` — ${data.hero.roles[0]}` : '');

    // ── Section label helper ───────────────────────────────────
    const SectionLabel = ({ iconKey, label }) => (
        <div className="section-label">
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--g-blue)' }}>
                {SECTION_ICONS[iconKey]}
            </span>
            {label}
        </div>
    );

    // ── Renderers ──────────────────────────────────────────────
    const renderExperience = () => (
        <>
            {data.experience && data.experience.length > 0 ? (
                <>
                    <SectionLabel iconKey="work" label="Work Experience" />
                    {data.experience.map((job, i) => {
                        const descArr = Array.isArray(job.description) ? job.description : (job.description ? [job.description] : []);
                        return (
                            <SearchResult
                                key={`exp-${i}`}
                                type="Experience"
                                title={job.role}
                                company={job.company}
                                subtitle={job.dates}
                                description={descArr}
                                sitelinks={descArr}
                                dateRange={job.dates}
                                url={job.companyUrl || '#'}
                            />
                        );
                    })}
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
                    <SectionLabel iconKey="projects" label="Projects" />
                    {data.projects.map((proj, i) => {
                        const descArr = Array.isArray(proj.description) ? proj.description : (proj.description ? [proj.description] : []);
                        const techs = Array.isArray(proj.tech) ? proj.tech : (proj.tech ? [proj.tech] : []);
                        return (
                            <SearchResult
                                key={`proj-${i}`}
                                type="Project"
                                title={proj.title}
                                subtitle="Personal Project"
                                description={descArr}
                                tags={techs.slice(0, 4)}
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
                    <SectionLabel iconKey="education" label="Education" />
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
                    <SectionLabel iconKey="achievements" label="Achievements & Credentials" />
                    {data.achievements.items.map((item, i) => (
                        <SearchResult
                            key={`ach-${i}`}
                            type="Achievement"
                            title={item}
                            company={data.achievements.org || data.achievements.title}
                            subtitle={data.achievements.type || 'Recognition'}
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
                    <SectionLabel iconKey="profiles" label="Coding Profiles" />
                    {data.codingProfiles.map((prof, i) => (
                        <SearchResult
                            key={`prof-${i}`}
                            type="Profile"
                            title={prof.platform}
                            company={prof.username ? `@${prof.username}` : ''}
                            subtitle="Coding Platform"
                            description={[
                                `Active on ${prof.platform}`,
                                prof.rating ? `Rating: ${prof.rating}` : '',
                                prof.rank ? `Rank: ${prof.rank}` : '',
                            ].filter(Boolean)}
                            url={prof.url}
                        />
                    ))}
                </>
            ) : (
                <p style={{ color: 'var(--g-secondary)', fontSize: '0.9rem' }}>No coding profiles added yet.</p>
            )}
        </>
    );

    const renderSkills = () => {
        if (!data.skills || data.skills.length === 0) return null;
        return (
            <div className="skills-block">
                <div className="section-label" style={{ marginTop: 0, borderBottom: 'none', marginBottom: '0.6rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', color: 'var(--g-blue)' }}>{Icons.skills}</span>
                    Skills &amp; Technologies
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
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
                    {/* Logo */}
                    <div className="google-logo">
                        <span className="g-blue">G</span>
                        <span className="g-red">o</span>
                        <span className="g-yellow">o</span>
                        <span className="g-blue">g</span>
                        <span className="g-green">l</span>
                        <span className="g-red">e</span>
                    </div>

                    {/* Search bar — SVG icon, no emoji */}
                    <div className="google-search-bar">
                        <span className="search-icon">{Icons.search}</span>
                        <input value={queryText} readOnly />
                        <span style={{ display: 'flex', color: 'var(--g-secondary)', cursor: 'pointer' }}>{Icons.close}</span>
                    </div>

                    {/* Avatar */}
                    <div className="google-avatar">
                        {hasAvatar ? <img src={data.hero.image} alt={name} /> : initial}
                    </div>
                </div>

                {/* Tabs — SVG icons, no emoji */}
                <nav className="google-nav">
                    {TABS.map(({ id, icon }) => (
                        <div
                            key={id}
                            className={`google-tab ${activeTab === id ? 'active' : ''}`}
                            onClick={() => setActiveTab(id)}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
                            <span>{id}</span>
                            {id !== 'All' && counts[id] > 0 && (
                                <span className="tab-count">{counts[id]}</span>
                            )}
                        </div>
                    ))}
                </nav>
            </header>

            {/* ── Main ── */}
            <main className="google-content">
                <div className="google-main-col">
                    <div className="search-meta">
                        About {(totalResults * 12300).toLocaleString()} results&nbsp;
                        <span style={{ opacity: 0.7 }}>({(Math.random() * 0.3 + 0.15).toFixed(2)} seconds)</span>
                    </div>

                    {activeTab === 'All' && (
                        <>
                            {renderSkills()}
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

                <aside className="google-side-col">
                    <KnowledgePanel userData={data} />
                </aside>
            </main>
        </div>
    );
};

export default GoogleTemplate;
