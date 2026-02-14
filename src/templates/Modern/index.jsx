import React from 'react';
import '../../css/Modern.css';

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

            <section className="modern-section" id="experience" style={{ background: 'var(--bg-primary)' }}>
                <div className="modern-container">
                    <h2 className="section-title">Experience</h2>
                    <div className="modern-timeline">
                        {data.experience.map((job, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-marker"></div>
                                <div className="timeline-content modern-card">
                                    <div className="job-header-modern">
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
                                                />
                                            ) : job.role}
                                        </h3>
                                        <span className="modern-company">{job.company}</span>
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
