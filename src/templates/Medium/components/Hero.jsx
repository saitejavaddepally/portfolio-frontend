import React from 'react';

const Hero = ({ data, isEditing, onUpdate, onArrayUpdate }) => {
    return (
        <section className="hero" id="about">
            <div className="hero-content">
                <div className="hero-text">
                    {isEditing ? (
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Headline</label>
                            <h1 style={{ margin: 0 }}>
                                <span>Hi, I'm </span>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        const newName = e.target.innerText;
                                        onUpdate('name', newName);
                                    }}
                                    style={{
                                        borderBottom: '1px dashed var(--border-color)',
                                        minWidth: '50px',
                                        display: 'inline',
                                        outline: 'none'
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
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <input
                                        value={role}
                                        onChange={(e) => {
                                            const newRoles = [...data.roles];
                                            newRoles[index] = e.target.value;
                                            onUpdate('roles', newRoles);
                                        }}
                                        className="role-badge"
                                        style={{ border: '1px dashed var(--border-color)', width: '200px', background: 'transparent', color: 'inherit' }}
                                    />
                                    <button
                                        onClick={() => {
                                            const newRoles = data.roles.filter((_, i) => i !== index);
                                            onUpdate('roles', newRoles);
                                        }}
                                        style={{
                                            background: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title="Remove role"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <span key={index} className="role-badge">{role}</span>
                            )
                        ))}
                        {isEditing && (
                            <button
                                onClick={() => onUpdate('roles', [...data.roles, "New Role"])}
                                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', marginLeft: '0.5rem', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                            >
                                + Add Role
                            </button>
                        )}
                    </div>

                    <div className="intro-text">
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                <textarea
                                    value={data.intro.text}
                                    onChange={(e) => onUpdate('intro', { ...data.intro, text: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}
                                    placeholder="Intro start..."
                                />
                                <input
                                    value={data.intro.highlight}
                                    onChange={(e) => onUpdate('intro', { ...data.intro, highlight: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px dashed var(--border-color)', color: 'var(--accent-color)', background: 'transparent', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: '500' }}
                                    placeholder="Highlighted text"
                                />
                                <textarea
                                    value={data.intro.suffix}
                                    onChange={(e) => onUpdate('intro', { ...data.intro, suffix: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}
                                    placeholder="Intro end..."
                                />
                            </div>
                        ) : (
                            <p>
                                {data.intro.text}
                                <span className="highlight">{data.intro.highlight}</span>
                                {data.intro.suffix}
                            </p>
                        )}
                    </div>
                </div>

                <div className="hero-image">
                    {/* If editing, could add an image upload/url input. For now just display. */}
                    <img src={data.image} alt={data.name} />
                    {isEditing && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            background: 'rgba(255,255,255,0.9)',
                            padding: '5px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px'
                        }}>
                            <input
                                type="text"
                                value={data.image}
                                onChange={(e) => onUpdate('image', e.target.value)}
                                placeholder="Image URL"
                                style={{
                                    fontSize: '0.7rem',
                                    border: '1px solid #ccc',
                                    padding: '2px',
                                    width: '100%'
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', cursor: 'pointer', background: '#eee', padding: '2px 5px', borderRadius: '3px', border: '1px solid #ccc' }}>
                                    Select File
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
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;
