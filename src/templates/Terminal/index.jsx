import React, { useState, useEffect } from 'react';
import './Terminal.css';
import CommandLine from './components/CommandLine';

const TerminalTemplate = ({ data, isEditing, setUserData }) => {
    // If editing, start with all shown to make it easier to see changes
    const [step, setStep] = useState(isEditing ? 100 : 0);

    // Reset step if isEditing changes to false (preview)
    useEffect(() => {
        if (isEditing) setStep(100);
        else setStep(0);
    }, [isEditing]);

    const commands = [
        {
            cmd: 'whoami',
            output: (
                <div className="term-text">
                    <h1 style={{ color: '#7ee787', fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: 0 }}>{data.hero?.name}</h1>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{data.hero?.title}</p>
                    <p style={{ marginTop: '0.5rem', maxWidth: '600px' }}>{data.about?.description || data.hero?.description}</p>
                </div>
            )
        },
        {
            cmd: 'cat skills.json',
            output: (
                <div className="term-json" style={{ color: '#e3b341' }}>
                    {'['}
                    {data.skills && data.skills.map((skill, i) => (
                        <span key={i}>
                            <span className="json-string">"{skill}"</span>{i < data.skills.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                    {']'}
                </div>
            )
        },
        {
            cmd: 'ls -l ./experience',
            output: (
                <div className="term-exp-list">
                    {data.experience && data.experience.map((job, i) => (
                        <div key={i} className="term-exp-item">
                            <div style={{ color: '#79c0ff', fontWeight: 'bold' }}>{job.role}</div>
                            <div style={{ color: '#d2a8ff' }}>@ {job.company}</div>
                            <div style={{ color: '#8b949e', fontSize: '0.85rem' }}>{job.dates}</div>
                            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', marginBottom: 0 }}>
                                {job.description.map((d, j) => <li key={j}>{d}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            )
        },
        {
            cmd: 'ls ./projects',
            output: (
                <div className="term-project-list">
                    {data.projects && data.projects.map((proj, i) => (
                        <div key={i} className="term-project-item">
                            <div style={{ fontWeight: 'bold', color: '#7ee787' }}>{proj.title}</div>
                            <div style={{ fontSize: '0.9rem', margin: '0.5rem 0', color: '#c9d1d9' }}>{Array.isArray(proj.description) ? proj.description[0] : proj.description}</div>
                            {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="term-link">Link {'->'}</a>}
                        </div>
                    ))}
                </div>
            )
        },
        {
            cmd: './contact.sh',
            output: (
                <div className="term-contact" style={{ display: 'flex', gap: '1.5rem' }}>
                    {data.contact?.email && <div>Email: <a href={`mailto:${data.contact.email}`} className="term-link">{data.contact.email}</a></div>}
                    {data.contact?.github && <div>GitHub: <a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="term-link">Profile</a></div>}
                    {data.contact?.linkedin && <div>LinkedIn: <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="term-link">Profile</a></div>}
                </div>
            )
        }
    ];

    return (
        <div className="term-container">
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
