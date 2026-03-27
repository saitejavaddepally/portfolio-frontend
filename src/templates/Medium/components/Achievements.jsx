import React, { useState, useEffect } from 'react';
import { validateAchievement } from '../../../utils/validateSection';
import ErrorBubble from '../../../components/ErrorBubble';
import { useToast } from '../../../context/ToastContext';

/**
 * Achievements — array-based, same pattern as Education/Experience.
 * Each entry: { title, type, org, description, items: [], image }
 */
const Achievements = ({ data, isEditing, setUserData, validationTrigger }) => {
    const { addToast } = useToast();
    const [fieldErrors, setFieldErrors] = useState({});

    // Normalize: if data is the old single-object format, treat as empty array
    const safeData = Array.isArray(data) ? data : [];

    const clearError = (idx, field) => {
        setFieldErrors(prev => { const n = { ...prev }; delete n[`${idx}_${field}`]; return n; });
    };

    const validateOnBlur = (idx) => {
        const entry = safeData[idx];
        if (!entry) return;
        const errs = validateAchievement(entry);
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(newErrors).filter(k => k.startsWith(`${idx}_`)).forEach(k => delete newErrors[k]);
            errs.forEach(e => {
                if (e.toLowerCase().includes('title')) newErrors[`${idx}_title`] = e;
            });
            return newErrors;
        });
    };

    useEffect(() => {
        if (validationTrigger > 0) {
            safeData.forEach((_, index) => validateOnBlur(index));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validationTrigger]);

    const handleUpdate = (index, field, value) => {
        setUserData(prev => {
            const updated = [...(Array.isArray(prev.achievements) ? prev.achievements : [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, achievements: updated };
        });
    };

    const handleItemUpdate = (achIdx, itemIdx, value) => {
        setUserData(prev => {
            const updated = [...(Array.isArray(prev.achievements) ? prev.achievements : [])];
            const newItems = [...(updated[achIdx].items || [])];
            newItems[itemIdx] = value;
            updated[achIdx] = { ...updated[achIdx], items: newItems };
            return { ...prev, achievements: updated };
        });
    };

    const addAchievement = () => {
        if (safeData.length > 0) {
            const latest = safeData[0];
            const errs = validateAchievement(latest);
            if (errs.length > 0) {
                addToast('Please complete the current achievement before adding a new one.', 'error');
                validateOnBlur(0);
                return;
            }
        }
        setUserData(prev => ({
            ...prev,
            achievements: [
                {
                    title: '',
                    type: '',
                    org: '',
                    description: '',
                    items: [],
                    image: ''
                },
                ...(Array.isArray(prev.achievements) ? prev.achievements : [])
            ]
        }));
    };

    const removeAchievement = (index) => {
        if (window.confirm('Remove this achievement?')) {
            setUserData(prev => ({
                ...prev,
                achievements: (Array.isArray(prev.achievements) ? prev.achievements : []).filter((_, i) => i !== index)
            }));
            setFieldErrors(prev => {
                const n = { ...prev };
                Object.keys(n).filter(k => k.startsWith(`${index}_`)).forEach(k => delete n[k]);
                return n;
            });
        }
    };

    // Don't render in view mode when empty
    if (!isEditing && safeData.length === 0) return null;

    return (
        <section className="featured-achievement" id="achievements">
            <div className="section-header">
                <h2>Achievements</h2>
            </div>

            {isEditing && (
                <button
                    onClick={addAchievement}
                    style={{
                        marginBottom: '2rem',
                        padding: '0.5rem 1rem',
                        width: '100%',
                        border: '2px dashed #eee',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#888',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                    }}
                >
                    + Add New Achievement
                </button>
            )}

            {safeData.map((ach, index) => (
                <article key={index} style={{ position: 'relative', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: index < safeData.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    {/* Remove Button */}
                    {isEditing && (
                        <button
                            onClick={() => removeAchievement(index)}
                            style={{
                                position: 'absolute',
                                top: '0.5rem',
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

                    <div className="achievement-content">
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                                {/* Type badge */}
                                <input
                                    value={ach.type || ''}
                                    onChange={(e) => handleUpdate(index, 'type', e.target.value)}
                                    className="project-type"
                                    placeholder="Achievement Type (e.g. Award, Certification)"
                                    style={{ border: '1px dashed var(--border-color)', background: 'transparent', textAlign: 'center' }}
                                />

                                {/* Title — REQUIRED */}
                                <div style={{ width: '100%' }}>
                                    <input
                                        value={ach.title || ''}
                                        onChange={(e) => { handleUpdate(index, 'title', e.target.value); clearError(index, 'title'); }}
                                        onBlur={() => validateOnBlur(index)}
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '1.8rem',
                                            fontWeight: 'bold',
                                            border: fieldErrors[`${index}_title`]
                                                ? '1px solid #dc2626'
                                                : '1px dashed var(--border-color)',
                                            background: fieldErrors[`${index}_title`] ? 'rgba(220,38,38,0.04)' : 'transparent',
                                            color: 'inherit',
                                            textAlign: 'center',
                                            width: '100%',
                                            borderRadius: '4px'
                                        }}
                                        placeholder="Achievement Title *"
                                    />
                                    <ErrorBubble message={fieldErrors[`${index}_title`]} />
                                </div>

                                {/* Org */}
                                <input
                                    value={ach.org || ''}
                                    onChange={(e) => handleUpdate(index, 'org', e.target.value)}
                                    style={{ fontSize: '1.1rem', border: '1px dashed var(--border-color)', background: 'transparent', color: 'var(--text-muted)', textAlign: 'center', width: '100%', borderRadius: '4px' }}
                                    placeholder="Organization / Issuer"
                                />
                            </div>
                        ) : (
                            <>
                                {ach.type && (
                                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                                        <span className="project-type">{ach.type}</span>
                                    </div>
                                )}
                                <h3 style={{ textAlign: 'center' }}>{ach.title}</h3>
                                {ach.org && (
                                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>{ach.org}</p>
                                )}
                            </>
                        )}

                        {/* Image */}
                        {ach.image && (
                            <div className="achievement-image-container">
                                <img src={ach.image} alt={ach.title} />
                            </div>
                        )}

                        {/* Description */}
                        <div className="achievement-details">
                            {isEditing ? (
                                <textarea
                                    value={ach.description || ''}
                                    onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                                    onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                    ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                    style={{ width: '100%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: '1.1rem', resize: 'none', overflow: 'hidden', textAlign: 'center', marginBottom: '1rem', boxSizing: 'border-box', borderRadius: '4px' }}
                                    rows={1}
                                    placeholder="Brief description (optional)..."
                                />
                            ) : (
                                ach.description && <p className="lead" style={{ textAlign: 'center' }}>{ach.description}</p>
                            )}

                            {/* Detail items list */}
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {(ach.items || []).map((item, i) => (
                                    isEditing ? (
                                        <li key={i} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                            <span style={{ marginTop: '0.4rem' }}>•</span>
                                            <textarea
                                                value={item}
                                                onChange={(e) => handleItemUpdate(index, i, e.target.value)}
                                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                                style={{ width: '80%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', resize: 'none', overflow: 'hidden', boxSizing: 'border-box', borderRadius: '4px' }}
                                                rows={1}
                                                placeholder="Detail point..."
                                            />
                                            <button
                                                onClick={() => {
                                                    const newItems = (ach.items || []).filter((_, idx) => idx !== i);
                                                    handleUpdate(index, 'items', newItems);
                                                }}
                                                style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}
                                                title="Remove point"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ) : (
                                        <li key={i} style={{ textAlign: 'center' }}>{item}</li>
                                    )
                                ))}
                            </ul>

                            {isEditing && (
                                <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                                    <button
                                        onClick={() => handleUpdate(index, 'items', [...(ach.items || []), ''])}
                                        style={{ fontSize: '0.85rem', color: 'var(--accent-color)', background: 'none', border: '1px dashed var(--accent-color)', cursor: 'pointer', padding: '0.4rem 0.9rem', borderRadius: '4px' }}
                                    >
                                        + Add Detail Point
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
};

export default Achievements;
