import React from 'react';

const Projects = ({ data, isEditing, setUserData }) => {

    const handleUpdate = (index, field, value) => {
        setUserData(prev => {
            const newData = [...prev.projects];
            newData[index] = { ...newData[index], [field]: value };
            return { ...prev, projects: newData };
        });
    };

    const removeProject = (index) => {
        if (window.confirm("Are you sure you want to remove this project?")) {
            setUserData(prev => ({
                ...prev,
                projects: prev.projects.filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <section id="projects">
            <div className="section-header">
                <h2>Projects</h2>
            </div>

            {data.map((project, index) => (
                <article className="project-item" key={index} style={{ position: 'relative' }}>
                    {isEditing && (
                        <button
                            onClick={() => removeProject(index)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '0',
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.2rem 0.5rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            Remove
                        </button>
                    )}
                    <div className="project-content">
                        <div className="project-header">
                            {isEditing ? (
                                <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                                    <input
                                        value={project.title}
                                        onChange={(e) => handleUpdate(index, 'title', e.target.value)}
                                        placeholder="Project Title"
                                        style={{ flex: 1, fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 'bold', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit' }}
                                    />
                                    <input
                                        value={project.type}
                                        onChange={(e) => handleUpdate(index, 'type', e.target.value)}
                                        placeholder="Project Type"
                                        className="project-type"
                                        style={{ border: '1px dashed var(--border-color)', minWidth: '150px', background: 'transparent', color: 'inherit' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h3>{project.title}</h3>
                                    <span className="project-type">{project.type}</span>
                                </>
                            )}
                        </div>

                        {isEditing ? (
                            <textarea
                                value={project.desc}
                                onChange={(e) => handleUpdate(index, 'desc', e.target.value)}
                                className="project-desc"
                                style={{ width: '100%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}
                                rows={3}
                            />
                        ) : (
                            <p className="project-desc">{project.desc}</p>
                        )}

                        <div className="project-tags">
                            {project.tags.map((tag, tIndex) => (
                                <span key={tIndex} className="tag">{tag}</span>
                            ))}
                        </div>

                        <a href={project.link} className="project-link">View Project ↗</a>
                    </div>
                </article>
            ))}

            {isEditing && (
                <button
                    onClick={() => {
                        setUserData(prev => ({
                            ...prev,
                            projects: [...prev.projects, {
                                title: "New Project",
                                type: "Web App",
                                desc: "Description here...",
                                tags: ["React"],
                                link: "#"
                            }]
                        }));
                    }}
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                >
                    + Add Project
                </button>
            )}
        </section>
    );
};

export default Projects;
