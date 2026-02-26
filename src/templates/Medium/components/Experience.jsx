import React, { useState, useEffect } from 'react';
import CompanySelector from '../../../components/CompanySelector';
import { validateExperience } from '../../../utils/validateSection';
import ErrorBubble from '../../../components/ErrorBubble';
import { useToast } from '../../../context/ToastContext';

const Experience = ({ data, isEditing, setUserData, validationTrigger }) => {
    const { addToast } = useToast();
    const [fieldErrors, setFieldErrors] = useState({}); // { `${jobIndex}_field`: 'error msg' }

    const clearError = (jobIndex, field) => {
        setFieldErrors(prev => { const n = { ...prev }; delete n[`${jobIndex}_${field}`]; return n; });
    };

    const validateOnBlur = (jobIndex) => {
        const job = data[jobIndex];
        const errs = validateExperience(job);
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            // Clear previous errors for this job
            Object.keys(newErrors).filter(k => k.startsWith(`${jobIndex}_`)).forEach(k => delete newErrors[k]);
            errs.forEach(e => {
                if (e.includes('Company')) newErrors[`${jobIndex}_company`] = e;
                if (e.includes('role')) newErrors[`${jobIndex}_role`] = e;
                if (e.includes('Dates')) newErrors[`${jobIndex}_dates`] = e;
                if (e.includes('description')) newErrors[`${jobIndex}_description`] = e;
            });
            return newErrors;
        });
    };

    useEffect(() => {
        if (validationTrigger > 0) {
            data.forEach((_, index) => validateOnBlur(index));
        }
    }, [validationTrigger]);

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
        // Validate the most-recent job before allowing a new one
        if (data.length > 0) {
            const latest = data[0];
            const errs = validateExperience(latest);
            if (errs.length > 0) {
                addToast('Please complete the current experience entry before adding a new one.', 'error');
                // Highlight fields
                validateOnBlur(0);
                return;
            }
        }
        setUserData(prev => ({
            ...prev,
            experience: [{
                company: "",
                role: "",
                logo: "",
                dates: "",
                url: "",
                description: [""]
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
                                        onChange={(e) => { handleUpdate(index, 'role', e.target.value); clearError(index, 'role'); }}
                                        onBlur={() => validateOnBlur(index)}
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 'bold', border: fieldErrors[`${index}_role`] ? '1px solid #dc2626' : '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', width: '100%' }}
                                        placeholder="Role / Job Title *"
                                    />
                                    <ErrorBubble message={fieldErrors[`${index}_role`]} />
                                    <CompanySelector
                                        value={job.company}
                                        onChange={(name, logo) => { handleCompanyChange(index, name, logo); clearError(index, 'company'); }}
                                        placeholder="Company Name *"
                                    />
                                    <ErrorBubble message={fieldErrors[`${index}_company`]} />
                                </div>
                            ) : (
                                <h3>{job.role} @ {job.company}</h3>
                            )}

                            {isEditing ? (
                                <>
                                    <input
                                        value={job.dates}
                                        onChange={(e) => { handleUpdate(index, 'dates', e.target.value); clearError(index, 'dates'); }}
                                        onBlur={() => validateOnBlur(index)}
                                        className="dates"
                                        placeholder="Dates * (e.g. 2022 - Present)"
                                        style={{ border: fieldErrors[`${index}_dates`] ? '1px solid #dc2626' : '1px dashed var(--border-color)', background: 'transparent', color: 'inherit' }}
                                    />
                                    <ErrorBubble message={fieldErrors[`${index}_dates`]} />
                                </>
                            ) : (
                                <span className="dates">{job.dates}</span>
                            )}
                        </div>

                        <div className="job-details">
                            {/* Render as list for cleaner look */}
                            <ul>
                                {job.description.map((desc, i) => (
                                    isEditing ? (
                                        <li key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start', listStyle: 'none' }}>
                                            <span style={{ marginTop: '0.5rem' }}>•</span>
                                            <textarea
                                                value={desc}
                                                onChange={(e) => handleDescUpdate(index, i, e.target.value)}
                                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                                style={{ width: '100%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', resize: 'none', overflow: 'hidden', minHeight: '1.5em', boxSizing: 'border-box' }}
                                                rows={1}
                                                placeholder="Job Description / Achievement"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newDesc = job.description.filter((_, idx) => idx !== i);
                                                    const newExp = [...data];
                                                    newExp[index] = { ...newExp[index], description: newDesc };
                                                    // We need to use setUserData updater pattern from parent or just call handleUpdate if it supported value?
                                                    // Start using manual update since handleUpdate is single field.
                                                    // Actually handleDescUpdate is for updating, we need a "remove description" function or inline it.
                                                    setUserData(prev => {
                                                        const latestExp = [...prev.experience];
                                                        latestExp[index] = { ...latestExp[index], description: newDesc };
                                                        return { ...prev, experience: latestExp };
                                                    });
                                                }}
                                                style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
                                                title="Remove point"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ) : (
                                        <li key={i}>{desc}</li>
                                    )
                                ))}
                            </ul>
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        setUserData(prev => {
                                            const newExp = [...prev.experience];
                                            const newDesc = [...newExp[index].description, ""];
                                            newExp[index] = { ...newExp[index], description: newDesc };
                                            return { ...prev, experience: newExp };
                                        });
                                    }}
                                    style={{ fontSize: '0.8rem', color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '1.5rem' }}
                                >
                                    + Add Point
                                </button>
                            )}
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
