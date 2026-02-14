import React, { useState } from 'react';

const Footer = ({ data, isEditing, updateData }) => {
    const [showSocialsEditor, setShowSocialsEditor] = useState(false);

    const availableIcons = [
        { name: 'Twitter / X', class: 'fab fa-twitter' },
        { name: 'LinkedIn', class: 'fab fa-linkedin' },
        { name: 'GitHub', class: 'fab fa-github' },
        { name: 'Instagram', class: 'fab fa-instagram' },
        { name: 'Facebook', class: 'fab fa-facebook' },
        { name: 'Website', class: 'fas fa-globe' },
        { name: 'Email', class: 'fas fa-envelope' },
        { name: 'YouTube', class: 'fab fa-youtube' },
        { name: 'Medium', class: 'fab fa-medium' },
    ];

    const addSocial = () => {
        const newSocials = [...(data.socials || []), { icon: 'fab fa-github', url: '' }];
        updateData('footer', 'socials', newSocials);
    };

    const updateSocial = (index, field, value) => {
        const newSocials = [...data.socials];
        newSocials[index][field] = value;
        updateData('footer', 'socials', newSocials);
    };

    const removeSocial = (index) => {
        const newSocials = data.socials.filter((_, i) => i !== index);
        updateData('footer', 'socials', newSocials);
    };

    return (
        <footer className="footer" id="contact" style={{ position: 'relative' }}>
            <div className="container footer-content">
                {isEditing ? (
                    <>
                        <input
                            value={data.title}
                            onChange={(e) => updateData('footer', 'title', e.target.value)}
                            style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', textAlign: 'center', width: '100%', border: '1px dashed var(--border-color)', background: 'transparent', color: 'inherit' }}
                        />
                        <textarea
                            value={data.subtitle}
                            onChange={(e) => updateData('footer', 'subtitle', e.target.value)}
                            style={{ fontSize: '1.2rem', textAlign: 'center', width: '100%', border: '1px dashed var(--border-color)', marginTop: '1rem', background: 'transparent', color: 'inherit', fontFamily: 'inherit' }}
                        />
                    </>
                ) : (
                    <>
                        <h2>{data.title}</h2>
                        <p>{data.subtitle}</p>
                    </>
                )}

                <a href={`mailto:${data.email}`} className="email-btn">Say Hello 👋</a>

                <div className="social-links" style={{ position: 'relative' }}>
                    {data.socials?.map((social, index) => (
                        <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                            <i className={social.icon}></i>
                        </a>
                    ))}

                    {isEditing && (
                        <button
                            onClick={() => setShowSocialsEditor(true)}
                            style={{
                                marginLeft: '10px',
                                padding: '5px 10px',
                                fontSize: '0.8rem',
                                background: 'var(--accent-color)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                verticalAlign: 'middle'
                            }}
                        >
                            Manage Socials
                        </button>
                    )}
                </div>

                {/* Socials Editor Modal */}
                {isEditing && showSocialsEditor && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000
                    }}>
                        <div style={{
                            background: 'var(--bg-secondary)',
                            padding: '2rem',
                            borderRadius: '12px',
                            width: '90%',
                            maxWidth: '500px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                        }}>
                            <h3 style={{ marginTop: 0 }}>Manage Social Links</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                {data.socials?.map((social, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--bg-primary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <select
                                            value={social.icon}
                                            onChange={(e) => updateSocial(index, 'icon', e.target.value)}
                                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                        >
                                            {availableIcons.map(icon => (
                                                <option key={icon.class} value={icon.class}>{icon.name}</option>
                                            ))}
                                        </select>

                                        <input
                                            type="text"
                                            value={social.url}
                                            onChange={(e) => updateSocial(index, 'url', e.target.value)}
                                            placeholder="URL (e.g. https://twitter.com/username)"
                                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                        />

                                        <button
                                            onClick={() => removeSocial(index)}
                                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button
                                    onClick={addSocial}
                                    style={{ padding: '8px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}
                                >
                                    + Add New Link
                                </button>

                                <button
                                    onClick={() => setShowSocialsEditor(false)}
                                    style={{ padding: '8px 20px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="copyright">
                    © {new Date().getFullYear()} Saiteja Vaddepalli. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
