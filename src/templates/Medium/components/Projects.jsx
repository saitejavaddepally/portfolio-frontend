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

                        <div className="project-details" style={{ marginTop: '1rem' }}>
                            {Array.isArray(project.desc) ? project.desc.map((descPoint, i) => (
                                isEditing ? (
                                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                                        <span style={{ marginTop: '0.5rem' }}>•</span>
                                        <textarea
                                            value={descPoint}
                                            onChange={(e) => {
                                                const newDesc = [...project.desc];
                                                newDesc[i] = e.target.value;
                                                handleUpdate(index, 'desc', newDesc);
                                            }}
                                            style={{ width: '100%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', resize: 'vertical' }}
                                            rows={2}
                                            placeholder="Project Feature / Detail"
                                        />
                                        <button
                                            onClick={() => {
                                                const newDesc = project.desc.filter((_, idx) => idx !== i);
                                                handleUpdate(index, 'desc', newDesc);
                                            }}
                                            style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
                                            title="Remove point"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <ul key={i} style={{ paddingLeft: '1.2rem', margin: '0.2rem 0' }}>
                                        <li>{descPoint}</li>
                                    </ul>
                                )
                            )) : (
                                // Fallback for old string data: render as single point or convert? 
                                // Better to just render it as is if not editing, but if editing, maybe convert it?
                                // Let's just handle it safe.
                                isEditing ? (
                                    <textarea
                                        value={project.desc}
                                        onChange={(e) => handleUpdate(index, 'desc', [e.target.value])} // Auto-convert to array on edit
                                        rows={3}
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    <p>{project.desc}</p>
                                )
                            )}
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        const currentDesc = Array.isArray(project.desc) ? project.desc : [project.desc];
                                        handleUpdate(index, 'desc', [...currentDesc, ""]);
                                    }}
                                    style={{ fontSize: '0.8rem', color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '0.5rem' }}
                                >
                                    + Add Point
                                </button>
                            )}
                        </div>

                        <div className="project-tags">
                            {isEditing ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {project.tags.map((tag, tIndex) => (
                                        <div key={tIndex} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                            <input
                                                value={tag}
                                                onChange={(e) => {
                                                    const newTags = [...project.tags];
                                                    newTags[tIndex] = e.target.value;
                                                    handleUpdate(index, 'tags', newTags);
                                                }}
                                                style={{ border: 'none', background: 'transparent', color: 'inherit', width: '80px', fontSize: '0.8rem' }}
                                                placeholder="Tag"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newTags = project.tags.filter((_, i) => i !== tIndex);
                                                    handleUpdate(index, 'tags', newTags);
                                                }}
                                                style={{ marginLeft: '5px', background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleUpdate(index, 'tags', [...project.tags, ""])}
                                        style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', border: '1px dashed var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                    >
                                        + Add Tag
                                    </button>
                                </div>
                            ) : (
                                project.tags.map((tag, tIndex) => (
                                    <span key={tIndex} className="tag">{tag}</span>
                                ))
                            )}
                        </div>

                        {isEditing ? (
                            <div style={{ marginTop: '1rem' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Project Link</label>
                                <input
                                    value={project.link}
                                    onChange={(e) => handleUpdate(index, 'link', e.target.value)}
                                    placeholder="https://..."
                                    style={{ width: '100%', padding: '0.5rem', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', borderRadius: '4px' }}
                                />
                            </div>
                        ) : (
                            <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">View Project ↗</a>
                        )}
                    </div>
                </article>
            ))}

            {isEditing && (
                <button
                    onClick={() => {
                        setUserData(prev => ({
                            ...prev,
                            projects: [...prev.projects, {
                                title: "",
                                type: "",
                                desc: "",
                                tags: [""],
                                link: ""
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
