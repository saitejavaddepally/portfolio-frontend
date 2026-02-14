import React from 'react';
import '../../css/Modern.css';
import CompanySelector from '../../components/CompanySelector';

// A completely different layout to prove the concept
const ModernTemplate = ({ data, isEditing, updateData, onArrayUpdate, setUserData }) => {
    return (
        <div className="modern-template">
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
                    </div>
                </div>
            </nav>

            <header className="modern-hero" id="about">
                <div className="modern-container hero-grid">
                    <div className="hero-content">
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
                        <h2 className="section-title">Experience</h2>
                        <div className="modern-timeline">
                            {data.experience.map((job, index) => (
                                <div key={index} className="timeline-item">
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
            )}

            {(!isEditing && (!data.education || data.education.length === 0)) ? null : (
                <section className="modern-section" id="education" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="modern-container">
                        <h2 className="section-title">Education</h2>
                        <div className="modern-timeline">
                            {(data.education || []).map((edu, index) => (
                                <div key={index} className="timeline-item">
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
            )}

            {(!isEditing && (!data.projects || data.projects.length === 0)) ? null : (
                <section className="modern-section" id="projects">
                    <div className="modern-container">
                        <h2 className="section-title">Featured Work</h2>
                        <div className="project-grid">
                            {data.projects.map((project, index) => (
                                <div key={index} className="modern-card">
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
                                    <p>{project.desc}</p>
                                    <div className="card-tags">
                                        {project.tags.map(t => <span key={t}>#{t}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <footer className="modern-footer" id="contact">
                <div className="modern-container">
                    <h2>Let's Connect</h2>
                    <a href={`mailto:${data.footer.email}`} className="modern-btn">Get In Touch</a>
                </div>
            </footer>
        </div>
    );
};

export default ModernTemplate;
