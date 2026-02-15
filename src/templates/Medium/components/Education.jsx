import React from 'react';

const Education = ({ data, isEditing, setUserData }) => {

    const handleUpdate = (index, field, value) => {
        setUserData(prev => {
            const newData = [...prev.education];
            newData[index] = { ...newData[index], [field]: value };
            return { ...prev, education: newData };
        });
    };

    const handleDescUpdate = (eduIndex, descIndex, value) => {
        setUserData(prev => {
            const newEdu = [...prev.education];
            const newDesc = [...newEdu[eduIndex].desc];
            newDesc[descIndex] = value;
            newEdu[eduIndex] = { ...newEdu[eduIndex], desc: newDesc };
            return { ...prev, education: newEdu };
        });
    };

    const addEducation = () => {
        setUserData(prev => ({
            ...prev,
            education: [{
                school: "",
                desc: [""],
                dates: "",
                url: ""
            }, ...(prev.education || [])]
        }));
    };

    const removeEducation = (index) => {
        if (window.confirm("Are you sure you want to remove this education entry?")) {
            setUserData(prev => ({
                ...prev,
                education: prev.education.filter((_, i) => i !== index)
            }));
        }
    };

    // If not editing and no data, don't render anything (handled by parent usually, but good safeguard)
    if (!isEditing && (!data || data.length === 0)) return null;

    return (
        <section id="education">
            <div className="section-header">
                <h2>Education</h2>
            </div>

            {isEditing && (
                <button
                    onClick={addEducation}
                    style={{ marginBottom: '2rem', padding: '0.5rem 1rem', width: '100%', border: '2px dashed #eee', background: 'none', cursor: 'pointer', color: '#888' }}
                >
                    + Add New Education
                </button>
            )}

            {data && data.map((edu, index) => (
                <article className="job-item" key={index} style={{ position: 'relative', gridTemplateColumns: '1fr' }}>
                    {isEditing && (
                        <button
                            onClick={() => removeEducation(index)}
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

                    <div className="job-content" style={{ marginLeft: 0 }}> {/* Removed logo margin usage for now */}
                        <div className="job-header">
                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.5rem' }}>
                                    <input
                                        value={edu.school}
                                        onChange={(e) => handleUpdate(index, 'school', e.target.value)}
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 'bold', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', width: '100%' }}
                                        placeholder="School / University"
                                    />
                                </div>
                            ) : (
                                <h3>{edu.school}</h3>
                            )}

                            {isEditing ? (
                                <input
                                    value={edu.dates}
                                    onChange={(e) => handleUpdate(index, 'dates', e.target.value)}
                                    className="dates"
                                    placeholder="Dates (e.g. 2020 - 2024)"
                                    style={{ border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit' }}
                                />
                            ) : (
                                <span className="dates">{edu.dates}</span>
                            )}
                        </div>

                        <div className="job-details">
                            {edu.desc && edu.desc.map((desc, i) => (
                                isEditing ? (
                                    <textarea
                                        key={i}
                                        value={desc}
                                        onChange={(e) => handleDescUpdate(index, i, e.target.value)}
                                        style={{ width: '100%', marginBottom: '0.5rem', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', resize: 'vertical' }}
                                        rows={1}
                                        placeholder="Degree or Field of Study"
                                    />
                                ) : (
                                    <p key={i}>{desc}</p>
                                )
                            ))}
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        const newDesc = [...edu.desc, ""];
                                        handleUpdate(index, 'desc', newDesc);
                                    }}
                                    style={{ fontSize: '0.8rem', color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    + Add Detail
                                </button>
                            )}
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
};

export default Education;
