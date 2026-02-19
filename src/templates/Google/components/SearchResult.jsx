import React from 'react';

// Color palette for type badges — cycles through
const TYPE_COLORS = ['badge-blue', 'badge-green', 'badge-purple', 'badge-red', 'badge-yellow'];
const FAVICON_BG = ['#4285f4', '#34a853', '#ea4335', '#fbbc05', '#9c27b0', '#e91e63', '#00bcd4'];

const getColor = (str = '') => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return FAVICON_BG[Math.abs(hash) % FAVICON_BG.length];
};

const getBadgeClass = (type = '') => TYPE_COLORS[type.length % TYPE_COLORS.length];

const SearchResult = ({ title, company, subtitle, url, description, image, tags, onClick, type, dateRange, sitelinks }) => {
    // Smart URL display
    const domain = url && url.startsWith('http')
        ? new URL(url).hostname
        : (company ? company.toLowerCase().replace(/\s+/g, '') + '.com' : 'portfolio.example.com');
    const breadcrumb = url && url.startsWith('http')
        ? `${new URL(url).hostname} › ${type?.toLowerCase()}`
        : `portfolio.dev › ${(type || 'info').toLowerCase()}`;

    // Description handling
    const descArray = Array.isArray(description) ? description : (description ? [description] : []);
    const descText = descArray.filter(Boolean).join('. ');
    const truncated = descText.length > 200 ? descText.substring(0, 200) + '...' : descText;

    // Favicon initial
    const initial = (title || company || 'P').charAt(0).toUpperCase();
    const faviconColor = getColor(company || title || type || '');

    return (
        <div className="search-result">
            {/* URL row */}
            <div className="result-url-row">
                <div className="result-favicon" style={{ background: faviconColor }}>
                    {image ? <img src={image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initial}
                </div>
                <div className="result-breadcrumb">
                    <cite>{breadcrumb}</cite>
                </div>
                <span className="result-menuicon">⋮</span>
            </div>

            {/* Title */}
            <a
                className="result-title"
                href={url || '#'}
                target={url && url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={onClick}
            >
                {title}{company ? ` — ${company}` : ''}
            </a>

            {/* Badges */}
            <div className="result-badges">
                {type && (
                    <span className={`result-badge ${getBadgeClass(type)}`}>{type}</span>
                )}
                {dateRange && (
                    <span className="result-badge badge-yellow">📅 {dateRange}</span>
                )}
                {tags && tags.map((tag, i) => (
                    <span key={i} className={`result-badge ${TYPE_COLORS[i % TYPE_COLORS.length]}`}>{tag}</span>
                ))}
            </div>

            {/* Description */}
            {descArray.length > 0 && (
                <p className="result-desc">
                    {subtitle && <span className="result-desc-date">{subtitle} — </span>}
                    {truncated}
                </p>
            )}

            {/* Sitelinks (bullet sub-points) */}
            {sitelinks && sitelinks.length > 0 && (
                <div className="result-sitelinks">
                    {sitelinks.slice(0, 4).map((s, i) => (
                        <div key={i} className="sitelink-item">› {s}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResult;
