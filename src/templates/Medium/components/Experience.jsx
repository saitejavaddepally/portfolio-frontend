import React from 'react';
import CompanySelector from '../../../components/CompanySelector';

const Experience = ({ data, isEditing, setUserData }) => {

    const handleUpdate = (index, field, value) => {
        setUserData(prev => {
            const newData = [...prev.experience];
            newData[index] = { ...newData[index], [field]: value };
            return { ...prev, experience: newData };
        });
    };

    const handleCompanyChange = (index, name, logo) => {
        setUserData(prev => {
            const newData = [...prev.experience];
            newData[index] = {
                ...newData[index],
                company: name,
                logo: logo
            };
            return { ...prev, experience: newData };
        });
    };

    const handleDescUpdate = (expIndex, descIndex, value) => {
        setUserData(prev => {
            const newExp = [...prev.experience];
            const newDesc = [...newExp[expIndex].description];
            newDesc[descIndex] = value;
            newExp[expIndex] = { ...newExp[expIndex], description: newDesc };
            return { ...prev, experience: newExp };
        });
    };

    const addJob = () => {
        setUserData(prev => ({
            ...prev,
            experience: [{
                company: "New Company",
                role: "New Role",
                logo: "",
                dates: "Present",
                url: "#",
                description: ["Description..."]
            }, ...prev.experience]
        }));
    };

    const removeJob = (index) => {
        if (window.confirm("Are you sure you want to remove this experience?")) {
            setUserData(prev => ({
                ...prev,
                experience: prev.experience.filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <section id="experience">
            <div className="section-header">
                <h2>Experience</h2>
            </div>

            {isEditing && (
                <button
                    onClick={addJob}
                    style={{ marginBottom: '2rem', padding: '0.5rem 1rem', width: '100%', border: '2px dashed #eee', background: 'none', cursor: 'pointer', color: '#888' }}
                >
                    + Add New Experience
                </button>
            )}

            {data.map((job, index) => (
                <article className="job-item" key={index} style={{ position: 'relative' }}>
                    {isEditing && (
                        <button
                            onClick={() => removeJob(index)}
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
                    <div className="job-logo">
                        {job.logo && <img src={job.logo} alt={job.company} />}
                    </div>
                    <div className="job-content">
                        <div className="job-header">
                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.5rem' }}>
                                    <input
                                        value={job.role}
                                        onChange={(e) => handleUpdate(index, 'role', e.target.value)}
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 'bold', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', width: '100%' }}
                                        placeholder="Role / Job Title"
                                    />
                                    <CompanySelector
                                        value={job.company}
                                        onChange={(name, logo) => handleCompanyChange(index, name, logo)}
                                        placeholder="Company Name"
                                    />
                                </div>
                            ) : (
                                <h3>{job.role} @ {job.company}</h3>
                            )}

                            {isEditing ? (
                                <input
                                    value={job.dates}
                                    onChange={(e) => handleUpdate(index, 'dates', e.target.value)}
                                    className="dates"
                                    style={{ border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit' }}
                                />
                            ) : (
                                <span className="dates">{job.dates}</span>
                            )}
                        </div>

                        <div className="job-details">
                            {job.description.map((desc, i) => (
                                isEditing ? (
                                    <textarea
                                        key={i}
                                        value={desc}
                                        onChange={(e) => handleDescUpdate(index, i, e.target.value)}
                                        style={{ width: '100%', marginBottom: '0.5rem', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', resize: 'vertical' }}
                                        rows={2}
                                    />
                                ) : (
                                    <p key={i}>{desc}</p>
                                )
                            ))}
                        </div>

                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="company-link">
                            Visit {job.company} ↗
                        </a>
                    </div>
                </article>
            ))}
        </section>
    );
};

export default Experience;
