import React, { useState, useEffect } from 'react';
import './Terminal.css';
import CommandLine from './components/CommandLine';

const TerminalTemplate = ({ data, isEditing, setUserData, theme, toggleTheme }) => {
    // If editing, start with all shown to make it easier to see changes
    const [step, setStep] = useState(isEditing ? 100 : 0);

    // Reset step if isEditing changes to false (preview)
    useEffect(() => {
        if (isEditing) setStep(100);
        else setStep(0);
    }, [isEditing]);

    // Flexible data extraction — data structure may vary
    const name = data.hero?.name || '';
    const title = data.hero?.title ||
        (Array.isArray(data.hero?.roles) ? data.hero.roles.filter(Boolean).join(' | ') : '') || '';
    const bio = data.about?.description || data.hero?.description ||
        (Array.isArray(data.hero?.intro?.desc) ? data.hero.intro.desc.join(' ') : '') || '';

    const email = data.footer?.email || data.contact?.email || '';
    const github = data.socials?.find(s => s.name?.toLowerCase().includes('github'))?.url || data.contact?.github || '';
    const linkedin = data.socials?.find(s => s.name?.toLowerCase().includes('linkedin'))?.url || data.contact?.linkedin || '';

    const commands = [
        {
            cmd: 'whoami',
            output: (
                <div className="term-text">
                    <h1 style={{ color: '#7ee787', fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: 0 }}>{name}</h1>
                    {title && <p style={{ margin: 0, fontWeight: 'bold', color: '#79c0ff' }}>{title}</p>}
                    {bio && <p style={{ marginTop: '0.5rem', maxWidth: '600px', color: '#c9d1d9' }}>{bio}</p>}
                </div>
            )
        },
        {
            cmd: 'cat skills.json',
            output: (
                <div className="term-json" style={{ color: '#e3b341' }}>
                    {'['}
                    {data.skills && data.skills.length > 0 ? data.skills.map((skill, i) => (
                        <span key={i}>
                            <span className="json-string">"{skill}"</span>{i < data.skills.length - 1 ? ', ' : ''}
                        </span>
                    )) : <span style={{ color: '#8b949e' }}> (no skills added)</span>}
                    {']'}
                </div>
            )
        },
        {
            cmd: 'ls -l ./experience',
            output: (
                <div className="term-exp-list">
                    {data.experience && data.experience.length > 0
                        ? data.experience.map((job, i) => (
                            <div key={i} className="term-exp-item">
                                <div style={{ color: '#79c0ff', fontWeight: 'bold' }}>{job.role}</div>
                                <div style={{ color: '#d2a8ff' }}>@ {job.company}</div>
                                <div style={{ color: '#8b949e', fontSize: '0.85rem' }}>{job.dates}</div>
                                {Array.isArray(job.description) && (
                                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', marginBottom: 0 }}>
                                        {job.description.map((d, j) => <li key={j}>{d}</li>)}
                                    </ul>
                                )}
                                {typeof job.description === 'string' && (
                                    <div style={{ marginTop: '0.4rem' }}>{job.description}</div>
                                )}
                            </div>
                        ))
                        : <span style={{ color: '#8b949e' }}>(no experience entries)</span>
                    }
                </div>
            )
        },
        {
            cmd: 'ls ./projects',
            output: (
                <div className="term-project-list">
                    {data.projects && data.projects.length > 0
                        ? data.projects.map((proj, i) => (
                            <div key={i} className="term-project-item">
                                <div style={{ fontWeight: 'bold', color: '#7ee787' }}>{proj.title}</div>
                                <div style={{ fontSize: '0.9rem', margin: '0.5rem 0', color: '#c9d1d9' }}>
                                    {Array.isArray(proj.description) ? proj.description[0] : proj.description}
                                </div>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="term-link">Link {'->'}</a>}
                            </div>
                        ))
                        : <span style={{ color: '#8b949e' }}>(no projects added)</span>
                    }
                </div>
            )
        },
        {
            cmd: 'cat education.json',
            output: (
                <div className="term-exp-list">
                    {data.education && data.education.length > 0
                        ? data.education.map((edu, i) => (
                            <div key={i} className="term-exp-item">
                                <div style={{ color: '#d2a8ff', fontWeight: 'bold' }}>{edu.degree}</div>
                                <div style={{ color: '#79c0ff' }}>@ {edu.school}</div>
                                <div style={{ color: '#8b949e', fontSize: '0.85rem' }}>{edu.year}</div>
                                {edu.description && <div style={{ marginTop: '0.2rem' }}>{edu.description}</div>}
                            </div>
                        ))
                        : <span style={{ color: '#8b949e' }}>(no education entries)</span>
                    }
                </div>
            )
        },
        {
            cmd: 'cat achievements.txt',
            output: (
                <div className="term-text">
                    {data.achievements?.title && <div style={{ color: '#e3b341', marginBottom: '0.5rem', fontWeight: 'bold' }}>{data.achievements.title}:</div>}
                    {data.achievements?.items && data.achievements.items.length > 0
                        ? <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                            {data.achievements.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                        : <span style={{ color: '#8b949e' }}>(no achievements added)</span>
                    }
                </div>
            )
        },
        {
            cmd: 'cat coding-profiles.json',
            output: (
                <div className="term-json">
                    {'['}
                    {data.codingProfiles && data.codingProfiles.length > 0
                        ? data.codingProfiles.map((prof, i) => (
                            <div key={i} style={{ paddingLeft: '1rem' }}>
                                {'{'}
                                <span className="json-key"> "platform":</span> <span className="json-string">"{prof.platform}"</span>,
                                <span className="json-key"> "handle":</span> <span className="json-string">"{prof.username}"</span>,
                                <span className="json-key"> "link":</span> <a href={prof.url} target="_blank" rel="noopener noreferrer" className="term-link">"{prof.url}"</a>
                                {'}'}{i < data.codingProfiles.length - 1 ? ',' : ''}
                            </div>
                        ))
                        : <span style={{ color: '#8b949e', paddingLeft: '1rem' }}>(no profiles added)</span>
                    }
                    {']'}
                </div>
            )
        },
        {
            cmd: './contact.sh',
            output: (
                <div className="term-contact" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    {email && <div>Email: <a href={`mailto:${email}`} className="term-link">{email}</a></div>}
                    {github && <div>GitHub: <a href={github} target="_blank" rel="noopener noreferrer" className="term-link">Profile</a></div>}
                    {linkedin && <div>LinkedIn: <a href={linkedin} target="_blank" rel="noopener noreferrer" className="term-link">Profile</a></div>}
                    {data.socials && data.socials
                        .filter(s => s.url && !s.name?.toLowerCase().includes('github') && !s.name?.toLowerCase().includes('linkedin'))
                        .map((s, i) => <div key={i}>{s.name}: <a href={s.url} target="_blank" rel="noopener noreferrer" className="term-link">{s.name}</a></div>)
                    }
                    {!email && !github && !linkedin && <span style={{ color: '#8b949e' }}>(no contact info added)</span>}
                </div>
            )
        }
    ];

    return (
        <div className="term-container" style={{ position: 'relative' }}>
            {toggleTheme && (
                <button
                    onClick={toggleTheme}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: '1px solid #30363d',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px',
                        color: '#8b949e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                    title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    )}
                </button>
            )}
            {commands.map((item, index) => (
                (index <= step) ? (
                    <CommandLine
                        key={index}
                        command={item.cmd}
                        output={item.output}
                        isTypingActive={!isEditing && index === step}
                        onComplete={() => setStep(prev => prev + 1)}
                    />
                ) : null
            ))}

            {(step >= commands.length) && (
                <div className="term-line">
                    <span className="term-prompt">visitor@portfolio:~$</span>
                    <span className="term-cursor"></span>
                </div>
            )}

            {/* If editing, show inputs? Terminal is mostly read-only concept. 
                Ideally we show a floating edit bubble or side panel, or use the global Edit Control.
                Or maybe we reuse the standard editor but with terminal CSS?
                For now, just ensuring it renders.
            */}
        </div>
    );
};

export default TerminalTemplate;
