import React, { useState, useEffect } from 'react';
import { validateCodingProfile } from '../../../utils/validateSection';
import ErrorBubble from '../../../components/ErrorBubble';
import { useToast } from '../../../context/ToastContext';

const PLATFORMS = [
    { name: 'LeetCode', icon: '🟨', color: '#FFA116' },
    { name: 'GitHub', icon: '🐙', color: '#24292e' },
    { name: 'Codeforces', icon: '🔵', color: '#1F8ACB' },
    { name: 'HackerRank', icon: '🟢', color: '#00EA64' },
    { name: 'GeeksForGeeks', icon: '🌿', color: '#2F8D46' },
    { name: 'CodeChef', icon: '👨‍🍳', color: '#5B4638' },
    { name: 'HackerEarth', icon: '🟣', color: '#2C3E8C' },
    { name: 'AtCoder', icon: '⬜', color: '#222' },
    { name: 'TUF+', icon: '🔥', color: '#e84118' },
];

const CodingProfiles = ({ data, isEditing, setUserData, validationTrigger }) => {
    const { addToast } = useToast();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (validationTrigger > 0) {
            data.forEach((_, index) => handleBlurValidate(index));
        }
    }, [validationTrigger, data]);

    const handleUpdate = (index, field, value) => {
        setUserData(prev => {
            const updated = [...(prev.codingProfiles || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, codingProfiles: updated };
        });
        // Clear error on change
        if (errors[`${index}_${field}`]) {
            setErrors(prev => { const n = { ...prev }; delete n[`${index}_${field}`]; return n; });
        }
    };

    const handleBlurValidate = (index) => {
        const profile = data[index];
        const errs = validateCodingProfile(profile);
        const newErrors = { ...errors };
        // Clear old errors for this index
        Object.keys(newErrors).filter(k => k.startsWith(`${index}_`)).forEach(k => delete newErrors[k]);
        if (errs.length) {
            errs.forEach(e => {
                if (e.includes('Username')) newErrors[`${index}_username`] = e;
                if (e.includes('URL')) newErrors[`${index}_url`] = e;
            });
        }
        setErrors(newErrors);
    };

    const addProfile = () => {
        if (data && data.length > 0) {
            const latest = data[data.length - 1];
            const errs = validateCodingProfile(latest);
            if (errs.length > 0) {
                addToast('Please complete the current profile before adding a new one.', 'error');
                handleBlurValidate(data.length - 1);
                return;
            }
        }
        setUserData(prev => ({
            ...prev,
            codingProfiles: [
                ...(prev.codingProfiles || []),
                { platform: 'LeetCode', username: '', url: '' }
            ]
        }));
    };

    const removeProfile = (index) => {
        setUserData(prev => ({
            ...prev,
            codingProfiles: (prev.codingProfiles || []).filter((_, i) => i !== index)
        }));
        setErrors(prev => {
            const n = { ...prev };
            Object.keys(n).filter(k => k.startsWith(`${index}_`)).forEach(k => delete n[k]);
            return n;
        });
    };

    const getPlatformMeta = (name) =>
        PLATFORMS.find(p => p.name === name) || { icon: '🔗', color: '#555' };

    if (!isEditing && (!data || data.length === 0)) return null;

    return (
        <section id="coding-profiles" style={{ marginBottom: '4rem' }}>
            <div className="section-header">
                <h2>Coding Profiles</h2>
            </div>

            <div className="coding-profiles-grid">
                {data.map((profile, index) => {
                    const meta = getPlatformMeta(profile.platform);
                    return (
                        <div key={index} className="coding-profile-card" style={{ borderLeft: `4px solid ${meta.color}` }}>
                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <select
                                            value={profile.platform}
                                            onChange={e => handleUpdate(index, 'platform', e.target.value)}
                                            style={{
                                                fontWeight: 700,
                                                fontSize: '0.95rem',
                                                background: 'transparent',
                                                border: '1px dashed var(--border-color)',
                                                color: 'var(--text-primary)',
                                                padding: '4px 6px',
                                                borderRadius: '4px',
                                                flex: 1,
                                                marginRight: '8px',
                                            }}
                                        >
                                            {PLATFORMS.map(p => (
                                                <option key={p.name} value={p.name}>{p.icon} {p.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => removeProfile(index)}
                                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >✕</button>
                                    </div>

                                    <div>
                                        <input
                                            value={profile.username}
                                            onChange={e => handleUpdate(index, 'username', e.target.value)}
                                            onBlur={() => handleBlurValidate(index)}
                                            placeholder="Username *"
                                            style={{
                                                width: '100%',
                                                border: errors[`${index}_username`] ? '1px solid #ef4444' : '1px dashed var(--border-color)',
                                                background: 'transparent',
                                                color: 'var(--text-primary)',
                                                padding: '6px',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors[`${index}_username`] && (
                                            <ErrorBubble message={errors[`${index}_username`]} />
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            value={profile.url}
                                            onChange={e => handleUpdate(index, 'url', e.target.value)}
                                            onBlur={() => handleBlurValidate(index)}
                                            placeholder="Profile URL * (https://leetcode.com/username)"
                                            style={{
                                                width: '100%',
                                                border: errors[`${index}_url`] ? '1px solid #ef4444' : '1px dashed var(--border-color)',
                                                background: 'transparent',
                                                color: 'var(--text-primary)',
                                                padding: '6px',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors[`${index}_url`] && (
                                            <ErrorBubble message={errors[`${index}_url`]} />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '1.3rem' }}>{meta.icon}</span>
                                            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{profile.platform}</span>
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>@{profile.username}</span>
                                    </div>
                                    <a
                                        href={profile.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="profile-visit-btn"
                                        style={{ background: meta.color }}
                                    >
                                        Visit ↗
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {isEditing && (
                <button
                    onClick={addProfile}
                    style={{
                        marginTop: '1.5rem',
                        padding: '10px 20px',
                        border: '2px dashed var(--border-color)',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        width: '100%',
                    }}
                >
                    + Add Coding Profile
                </button>
            )}
        </section>
    );
};

export default CodingProfiles;
