import React, { useState, useEffect } from 'react';
import { validateHero } from '../../../utils/validateSection';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 600px)').matches);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 600px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
};

const Hero = ({ data, isEditing, onUpdate, onArrayUpdate, validationTrigger }) => {
    const isMobile = useIsMobile();
    const [roleErrors, setRoleErrors] = useState({}); // { index: 'error msg' }

    // When save is triggered, highlight all empty roles
    useEffect(() => {
        if (validationTrigger > 0) {
            const errs = {};
            (data.roles || []).forEach((role, i) => {
                if (!role || role.trim() === '') {
                    errs[i] = 'Role cannot be empty.';
                }
            });
            setRoleErrors(errs);
        }
    }, [validationTrigger]);

    const handleRoleChange = (index, value) => {
        const newRoles = [...data.roles];
        newRoles[index] = value;
        onUpdate('roles', newRoles);
        // Clear error as user types
        if (roleErrors[index]) {
            setRoleErrors(prev => { const n = { ...prev }; delete n[index]; return n; });
        }
    };

    const removeRole = (index) => {
        const newRoles = data.roles.filter((_, i) => i !== index);
        onUpdate('roles', newRoles);
        setRoleErrors(prev => { const n = { ...prev }; delete n[index]; return n; });
    };

    return (
        <section className="hero" id="about">
            <div
                className="hero-content"
                style={isMobile ? {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    textAlign: 'center',
                } : {
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px',
                    alignItems: 'center',
                    gap: '3rem',
                }}
            >
                <div className="hero-text" style={isMobile ? { order: 2, width: '100%', textAlign: 'center' } : { gridColumn: 1 }}>
                    {isEditing ? (
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>Headline</label>
                            <h1 style={{ margin: 0, display: 'block' }}>
                                <span>Hi, I'm </span>
                                <span
                                    className="placeholder-empty"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => onUpdate('name', e.target.innerText)}
                                    placeholder="Your Name"
                                    style={{
                                        borderBottom: '1px dashed var(--border-color)',
                                        minWidth: '50px',
                                        display: 'inline', /* Allow wrapping */
                                        outline: 'none',
                                        background: 'transparent',
                                        color: 'inherit',
                                    }}
                                >
                                    {data.name}
                                </span>
                                <span>.</span>
                            </h1>
                        </div>
                    ) : (
                        <h1>Hi, I'm {data.name}.</h1>
                    )}

                    <div className="role-badges">
                        {data.roles.map((role, index) => (
                            isEditing ? (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input
                                            value={role}
                                            onChange={(e) => handleRoleChange(index, e.target.value)}
                                            className="role-badge"
                                            placeholder="Role"
                                            style={{
                                                border: roleErrors[index]
                                                    ? '1px solid #ef4444'
                                                    : '1px dashed var(--border-color)',
                                                width: `${Math.max(role.length, 10)}ch`,
                                                minWidth: '80px',
                                                background: roleErrors[index] ? 'rgba(239,68,68,0.05)' : 'transparent',
                                                color: 'inherit',
                                                borderRadius: '4px',
                                            }}
                                        />
                                        <button
                                            onClick={() => removeRole(index)}
                                            style={{
                                                background: 'none',
                                                color: '#ff4444',
                                                border: 'none',
                                                fontSize: '16px',
                                                cursor: 'pointer',
                                                padding: '0 4px',
                                                lineHeight: 1
                                            }}
                                            title="Remove role"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    {roleErrors[index] && (
                                        <span className="error-bubble" style={{
                                            fontSize: '0.72rem',
                                            color: '#ef4444',
                                            paddingLeft: '2px',
                                        }}>
                                            ⚠ {roleErrors[index]}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span key={index} className="role-badge">{role}</span>
                            )
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => onUpdate('roles', [...data.roles, ""])}
                                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'transparent', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                + Add
                            </button>
                        )}
                    </div>

                    <div className="intro-text">
                        {isEditing ? (
                            <p className="intro-text" style={{ display: 'block' }}>
                                <span
                                    className="placeholder-empty"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => onUpdate('intro', { ...data.intro, text: e.target.innerText })}
                                    placeholder="I build things with..."
                                    style={{ borderBottom: '1px dashed var(--border-color)', minWidth: '20px', display: 'inline-block', outline: 'none' }}
                                >
                                    {data.intro.text}
                                </span>
                                {' '}
                                <span
                                    className="highlight placeholder-empty"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => onUpdate('intro', { ...data.intro, highlight: e.target.innerText })}
                                    placeholder="highlighted tech"
                                    style={{ borderBottom: '1px dashed var(--border-color)', minWidth: '20px', display: 'inline-block', outline: 'none', margin: '0 0.3rem' }}
                                >
                                    {data.intro.highlight}
                                </span>
                                {' '}
                                <span
                                    className="placeholder-empty"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => onUpdate('intro', { ...data.intro, suffix: e.target.innerText })}
                                    placeholder="and solve problems."
                                    style={{ borderBottom: '1px dashed var(--border-color)', minWidth: '20px', display: 'inline-block', outline: 'none' }}
                                >
                                    {data.intro.suffix}
                                </span>
                            </p>
                        ) : (
                            <p>
                                {data.intro.text}
                                <span className="highlight">{data.intro.highlight}</span>
                                {data.intro.suffix}
                            </p>
                        )}
                    </div>
                </div>

                <div
                    className="hero-image-container"
                    style={isMobile ? {
                        order: 1,
                        width: '150px',
                        height: '150px',
                        margin: '0 auto',
                    } : {
                        gridColumn: 2,
                    }}
                >
                    <div className="hero-image">
                        <img src={data.image || "https://via.placeholder.com/250"} alt={data.name} />

                        {isEditing && (
                            <label className="image-upload-overlay">
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                onUpdate('image', reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <div className="upload-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                    Change Photo
                                </div>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
