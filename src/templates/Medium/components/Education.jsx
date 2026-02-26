import React, { useState, useEffect } from 'react';
import { validateEducation } from '../../../utils/validateSection';
import ErrorBubble from '../../../components/ErrorBubble';
import { useToast } from '../../../context/ToastContext';


const Education = ({ data, isEditing, setUserData, validationTrigger }) => {
    const { addToast } = useToast();
    const [fieldErrors, setFieldErrors] = useState({});

    const clearError = (idx, field) => {
        setFieldErrors(prev => { const n = { ...prev }; delete n[`${idx}_${field}`]; return n; });
    };

    const validateOnBlur = (idx) => {
        const edu = data[idx];
        const errs = validateEducation(edu);
        const newErrors = { ...fieldErrors };
        Object.keys(newErrors).filter(k => k.startsWith(`${idx}_`)).forEach(k => delete newErrors[k]);
        errs.forEach(e => {
            if (e.includes('School')) newErrors[`${idx}_school`] = e;
            if (e.includes('Dates')) newErrors[`${idx}_dates`] = e;
        });
        setFieldErrors(newErrors);
    };

    useEffect(() => {
        if (validationTrigger > 0) {
            data.forEach((_, index) => validateOnBlur(index));
        }
    }, [validationTrigger]);

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
        if (data && data.length > 0) {
            const latest = data[0];
            const errs = validateEducation(latest);
            if (errs.length > 0) {
                addToast('Please complete the current education entry before adding a new one.', 'error');
                validateOnBlur(0);
                return;
            }
        }
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
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.2rem' }}>
                                    <input
                                        value={edu.school}
                                        onChange={(e) => { handleUpdate(index, 'school', e.target.value); clearError(index, 'school'); }}
                                        onBlur={() => validateOnBlur(index)}
                                        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 'bold', border: fieldErrors[`${index}_school`] ? '1px solid #dc2626' : '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', width: '100%' }}
                                        placeholder="School / University *"
                                    />
                                    <ErrorBubble message={fieldErrors[`${index}_school`]} />
                                </div>
                            ) : (
                                <h3>{edu.school}</h3>
                            )}

                            {isEditing ? (
                                <>
                                    <input
                                        value={edu.dates}
                                        onChange={(e) => { handleUpdate(index, 'dates', e.target.value); clearError(index, 'dates'); }}
                                        onBlur={() => validateOnBlur(index)}
                                        className="dates"
                                        placeholder="Dates * (e.g. 2020 - 2024)"
                                        style={{ border: fieldErrors[`${index}_dates`] ? '1px solid #dc2626' : '1px dashed var(--border-color)', background: 'transparent', color: 'inherit' }}
                                    />
                                    <ErrorBubble message={fieldErrors[`${index}_dates`]} />
                                </>
                            ) : (
                                <span className="dates">{edu.dates}</span>
                            )}
                        </div>

                        <div className="job-details">
                            <ul>
                                {edu.desc && edu.desc.map((desc, i) => (
                                    isEditing ? (
                                        <li key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start', listStyle: 'none' }}>
                                            <span style={{ marginTop: '0.5rem' }}>•</span>
                                            <textarea
                                                value={desc}
                                                onChange={(e) => handleDescUpdate(index, i, e.target.value)}
                                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                                style={{ width: '100%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', resize: 'none', overflow: 'hidden', boxSizing: 'border-box' }}
                                                rows={1}
                                                placeholder="Degree or Field of Study"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newDesc = edu.desc.filter((_, idx) => idx !== i);
                                                    setUserData(prev => {
                                                        const newEdu = [...prev.education];
                                                        newEdu[index] = { ...newEdu[index], desc: newDesc };
                                                        return { ...prev, education: newEdu };
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
                                        const newDesc = [...(edu.desc || []), ""];
                                        handleUpdate(index, 'desc', newDesc);
                                    }}
                                    style={{ fontSize: '0.8rem', color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '1.5rem' }}
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
