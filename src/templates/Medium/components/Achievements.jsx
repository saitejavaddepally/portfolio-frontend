import React from 'react';

const Achievements = ({ data, isEditing, setUserData }) => {
    // If not editing and no data, don't render
    if (!isEditing && (!data || !data.items || data.items.length === 0)) return null;

    const handleUpdate = (field, value) => {
        setUserData(prev => ({
            ...prev,
            achievements: { ...prev.achievements, [field]: value }
        }));
    };

    return (
        <section className="featured-achievement">
            <div className="section-header">
                <h2>Achievements</h2>
            </div>

            <div className="achievement-content">
                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <input
                            value={data.type}
                            onChange={(e) => handleUpdate('type', e.target.value)}
                            className="project-type" // Reusing badge style
                            placeholder="Achievement Type"
                            style={{ border: '1px dashed var(--border-color)', background: 'transparent', textAlign: 'center' }}
                        />
                        <input
                            value={data.title}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                            style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 'bold', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', textAlign: 'center', width: '100%' }}
                            placeholder="Achievement Title"
                        />
                        <input
                            value={data.org}
                            onChange={(e) => handleUpdate('org', e.target.value)}
                            style={{ fontSize: '1.1rem', border: '1px dashed var(--border-color)', background: 'transparent', color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}
                            placeholder="Organization / Issuer"
                        />
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <span className="project-type">{data.type}</span>
                        </div>
                        <h3>{data.title}</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>{data.org}</p>
                    </>
                )}

                {data.image && (
                    <div className="achievement-image-container">
                        <img src={data.image} alt={data.title} />
                    </div>
                )}

                <div className="achievement-details">
                    {isEditing ? (
                        <textarea
                            value={data.description}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                            style={{ width: '100%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: '1.2rem', resize: 'vertical', textAlign: 'center', marginBottom: '2rem' }}
                            rows={2}
                            placeholder="Brief description of the achievement..."
                        />
                    ) : (
                        <p className="lead" style={{ textAlign: 'center' }}>{data.description}</p>
                    )}

                    <ul>
                        {data.items && data.items.map((item, i) => (
                            isEditing ? (
                                <li key={i} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                    <textarea
                                        value={item}
                                        onChange={(e) => {
                                            const newItems = [...data.items];
                                            newItems[i] = e.target.value;
                                            handleUpdate('items', newItems);
                                        }}
                                        style={{ width: '80%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', resize: 'vertical' }}
                                        rows={1}
                                    />
                                    <button
                                        onClick={() => {
                                            const newItems = data.items.filter((_, idx) => idx !== i);
                                            handleUpdate('items', newItems);
                                        }}
                                        style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        ×
                                    </button>
                                </li>
                            ) : (
                                <li key={i}>{item}</li>
                            )
                        ))}
                    </ul>
                    {isEditing && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button
                                onClick={() => handleUpdate('items', [...(data.items || []), ""])}
                                style={{ fontSize: '0.9rem', color: 'var(--accent-color)', background: 'none', border: '1px dashed var(--accent-color)', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '4px' }}
                            >
                                + Add Detail Point
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
