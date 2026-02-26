import React from 'react';
import '../../css/Modern.css';
import '../../css/scrollReveal.css';
import CompanySelector from '../../components/CompanySelector';
import useScrollReveal from '../../hooks/useScrollReveal';

// A completely different layout to prove the concept
const ModernTemplate = ({ data, isEditing, updateData, onArrayUpdate, setUserData, theme, toggleTheme }) => {
    useScrollReveal();
    return (
        <div className="modern-template animate-fade-in">
            <nav className="modern-nav">
                <div className="modern-container nav-flex">
                    {isEditing ? (
                        <input
                            value={data.hero.name}
                            onChange={(e) => updateData('hero', 'name', e.target.value)}
                            className="modern-logo-input"
                        />
                    ) : (
                        <div className="modern-logo">{data.hero.name}</div>
                    )}
                    <div className="modern-links">
                        <a href="#about">About</a>
                        <a href="#projects">Projects</a>
                        <a href="#contact">Contact</a>
                        {toggleTheme && (
                            <button
                                onClick={toggleTheme}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginLeft: '15px',
                                    color: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {theme === 'dark' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <header className="modern-hero" id="about">
                <div className="modern-container hero-grid">
                    <div className="hero-content animate-slide-up">
                        <h1 className="glitch-text">
                            {isEditing ? "Hello, I'm" : "Hello, I'm"} <br />
                            <span className="text-highlight">{data.hero.name}</span>
                        </h1>
                        <p className="hero-lead">
                            {data.hero.intro.text} {data.hero.intro.highlight}
                        </p>
                        <div className="modern-roles">
                            {data.hero.roles.map((role, i) => (
                                <span key={i} className="modern-pill">{role}</span>
                            ))}
                        </div>
                    </div>
                    <div className="hero-img-wrapper">
                        <img src={data.hero.image} alt="Profile" className="modern-profile-img" />
                    </div>
                </div>
            </header>

            {(!isEditing && (!data.experience || data.experience.length === 0)) ? null : (
                <section className="modern-section" id="experience" style={{ background: 'var(--bg-primary)' }}>
                    <div className="modern-container">
                        <h2 className={!isEditing ? "section-title reveal" : "section-title"}>Experience</h2>
                        <div className="modern-timeline">
                            {data.experience.map((job, index) => (
                                <div key={index} className={!isEditing ? `timeline-item reveal reveal-delay-${Math.min(index + 1, 5)}` : "timeline-item"}>
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content modern-card">
                                        <div className="job-header-modern">
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                                                    {isEditing ? (
                                                        <input
                                                            value={job.role}
                                                            onChange={(e) => {
                                                                const newExp = [...data.experience];
                                                                newExp[index].role = e.target.value;
                                                                setUserData(prev => ({ ...prev, experience: newExp }));
                                                            }}
                                                            style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'bold', width: '100%' }}
                                                            placeholder="Role"
                                                        />
                                                    ) : job.role}
                                                </h3>

                                                {isEditing ? (
                                                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {job.logo && <img src={job.logo} alt={job.company} style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '4px' }} />}
                                                        <div style={{ flex: 1 }}>
                                                            <CompanySelector
                                                                value={job.company}
                                                                onChange={(name, logo) => {
                                                                    const newExp = [...data.experience];
                                                                    newExp[index] = {
                                                                        ...newExp[index],
                                                                        company: name,
                                                                        logo: logo
                                                                    };
                                                                    setUserData(prev => ({ ...prev, experience: newExp }));
                                                                }}
                                                                placeholder="Company Name"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                        {job.logo && <img src={job.logo} alt={job.company} style={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '4px' }} />}
                                                        <span className="modern-company">{job.company}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="modern-dates">{job.dates}</span>
                                        <ul className="modern-job-desc">
                                            {job.description.map((desc, i) => (
                                                <li key={i}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )
            }

            {
                (!isEditing && (!data.education || data.education.length === 0)) ? null : (
                    <section className="modern-section" id="education" style={{ background: 'var(--bg-secondary)' }}>
                        <div className="modern-container">
                            <h2 className={!isEditing ? "section-title reveal" : "section-title"}>Education</h2>
                            <div className="modern-timeline">
                                {(data.education || []).map((edu, index) => (
                                    <div key={index} className={!isEditing ? `timeline-item reveal reveal-delay-${Math.min(index + 1, 5)}` : "timeline-item"}>
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content modern-card">
                                            <div className="job-header-modern">
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                                                        {isEditing ? (
                                                            <input
                                                                value={edu.school}
                                                                onChange={(e) => {
                                                                    const newEdu = [...(data.education || [])];
                                                                    newEdu[index] = { ...newEdu[index], school: e.target.value };
                                                                    setUserData(prev => ({ ...prev, education: newEdu }));
                                                                }}
                                                                style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'bold', width: '100%' }}
                                                                placeholder="University Name"
                                                            />
                                                        ) : edu.school}
                                                    </h3>
                                                    {isEditing ? (
                                                        <input
                                                            value={edu.dates}
                                                            onChange={(e) => {
                                                                const newEdu = [...(data.education || [])];
                                                                newEdu[index] = { ...newEdu[index], dates: e.target.value };
                                                                setUserData(prev => ({ ...prev, education: newEdu }));
                                                            }}
                                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', width: '100%' }}
                                                            placeholder="Dates"
                                                        />
                                                    ) : (
                                                        <span className="modern-dates" style={{ display: 'block', margin: '5px 0' }}>{edu.dates}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <ul className="modern-job-desc">
                                                {(edu.desc || []).map((desc, i) => (
                                                    <li key={i}>
                                                        {isEditing ? (
                                                            <input
                                                                value={desc}
                                                                onChange={(e) => {
                                                                    const newEdu = [...(data.education || [])];
                                                                    const newDesc = [...newEdu[index].desc];
                                                                    newDesc[i] = e.target.value;
                                                                    newEdu[index] = { ...newEdu[index], desc: newDesc };
                                                                    setUserData(prev => ({ ...prev, education: newEdu }));
                                                                }}
                                                                style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%' }}
                                                            />
                                                        ) : desc}
                                                    </li>
                                                ))}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => {
                                                            const newEdu = [...(data.education || [])];
                                                            newEdu[index].desc = [...newEdu[index].desc, "New Detail"];
                                                            setUserData(prev => ({ ...prev, education: newEdu }));
                                                        }}
                                                        style={{ fontSize: '0.8rem', color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                    >
                                                        + Add Detail
                                                    </button>
                                                )}
                                            </ul>
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const newEdu = data.education.filter((_, i) => i !== index);
                                                        setUserData(prev => ({ ...prev, education: newEdu }));
                                                    }}
                                                    style={{ marginTop: '10px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                                >
                                                    Remove Education
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            setUserData(prev => ({
                                                ...prev,
                                                education: [...(prev.education || []), {
                                                    school: "New University",
                                                    dates: "2020-2024",
                                                    desc: ["Degree Name"]
                                                }]
                                            }));
                                        }}
                                        style={{ marginTop: '20px', padding: '10px', width: '100%', border: '2px dashed var(--border-color)', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                    >
                                        + Add New Education
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                )
            }

            {
                (!isEditing && (!data.projects || data.projects.length === 0)) ? null : (
                    <section className="modern-section" id="projects">
                        <div className="modern-container">
                            <h2 className={!isEditing ? "section-title reveal" : "section-title"}>Featured Work</h2>
                            <div className="project-grid">
                                {data.projects.map((project, index) => (
                                    <div key={index} className={!isEditing ? `modern-card reveal reveal-delay-${Math.min(index + 1, 5)}` : "modern-card"}>
                                        <div className="card-header">
                                            <span className="project-type-badge">{project.type}</span>
                                            <h3>{isEditing ? (
                                                <input
                                                    value={project.title}
                                                    onChange={(e) => {
                                                        const newProjects = [...data.projects];
                                                        newProjects[index].title = e.target.value;
                                                        setUserData(prev => ({ ...prev, projects: newProjects }));
                                                    }}
                                                    style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: 'inherit', fontWeight: 'bold', width: '100%' }}
                                                />
                                            ) : project.title}</h3>
                                        </div>
                                        {/* Description as bullet points for Modern too if array */}
                                        {Array.isArray(project.desc) ? (
                                            <ul className="modern-job-desc" style={{ marginTop: '1rem' }}>
                                                {project.desc.map((d, i) => <li key={i}>{d}</li>)}
                                            </ul>
                                        ) : (
                                            <p>{project.desc}</p>
                                        )}
                                        <div className="card-tags">
                                            {project.tags.map(t => <span key={t}>#{t}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Achievements Section */}
            {
                (!isEditing && (!data.achievements || !data.achievements.items || data.achievements.items.length === 0)) ? null : (
                    <section className="modern-section" id="achievements" style={{ background: 'var(--bg-secondary)' }}>
                        <div className="modern-container">
                            <h2 className="section-title">Achievements</h2>
                            <div className="modern-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                                <span className="project-type-badge">{data.achievements.type}</span>
                                <h3 style={{ fontSize: '2rem', margin: '1rem 0' }}>{data.achievements.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '1rem' }}>{data.achievements.org}</p>
                                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>{data.achievements.description}</p>

                                <ul className="modern-job-desc" style={{ textAlign: 'left', display: 'inline-block' }}>
                                    {data.achievements?.items?.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Coding Profiles Section */}
            {(!isEditing && (!data.codingProfiles || data.codingProfiles.length === 0)) ? null : (
                <section className="modern-section" id="coding-profiles" style={{ background: 'var(--bg-primary)', paddingBottom: '3rem' }}>
                    <div className="modern-container">
                        <h2 className={!isEditing ? 'section-title reveal' : 'section-title'}>Coding Profiles</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '1rem',
                            marginTop: '1.5rem',
                        }}>
                            {(data.codingProfiles || []).map((profile, i) => {
                                const platformColors = {
                                    'LeetCode': '#FFA116', 'GitHub': '#24292e', 'Codeforces': '#1F8ACB',
                                    'HackerRank': '#00EA64', 'GeeksForGeeks': '#2F8D46', 'CodeChef': '#5B4638',
                                    'HackerEarth': '#2C3E8C', 'AtCoder': '#222222', 'TUF+': '#e84118',
                                };
                                const platformIcons = {
                                    'LeetCode': '🟨', 'GitHub': '🐙', 'Codeforces': '🔵',
                                    'HackerRank': '🟢', 'GeeksForGeeks': '🌿', 'CodeChef': '👨‍🍳',
                                    'HackerEarth': '🟣', 'AtCoder': '⬜', 'TUF+': '🔥',
                                };
                                const color = platformColors[profile.platform] || '#6366f1';
                                const icon = platformIcons[profile.platform] || '🔗';
                                return (
                                    <div key={i} className="modern-card" style={{
                                        borderLeft: `4px solid ${color}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem 1.2rem',
                                        gap: '1rem',
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                                                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{profile.platform}</span>
                                            </div>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>@{profile.username}</span>
                                        </div>
                                        <a
                                            href={profile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                background: color,
                                                color: '#fff',
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                fontSize: '0.82rem',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                            }}
                                        >
                                            Visit ↗
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}


            <footer className={!isEditing ? "modern-footer reveal" : "modern-footer"} id="contact">
                <div className="modern-container">
                    <h2>Let's Connect</h2>
                    <a href={`mailto:${data.footer.email}`} className="modern-btn">Get In Touch</a>
                </div>
            </footer>
        </div >
    );
};

export default ModernTemplate;
