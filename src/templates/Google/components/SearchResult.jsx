import React from 'react';
import { Icons } from './Icons';

// Color palette for type badges
const BADGE_CLASSES = ['badge-blue', 'badge-green', 'badge-purple', 'badge-red', 'badge-yellow'];
const FAVICON_COLORS = ['#4285f4', '#34a853', '#ea4335', '#fbbc05', '#9c27b0', '#e91e63', '#00bcd4'];

const hashColor = (str = '') => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return FAVICON_COLORS[Math.abs(h) % FAVICON_COLORS.length];
};

const badgeClass = (type = '') => BADGE_CLASSES[type.length % BADGE_CLASSES.length];

const SearchResult = ({ title, company, subtitle, url, description, image, tags, onClick, type, dateRange, sitelinks }) => {
    const breadcrumb = url && url.startsWith('http')
        ? `${new URL(url).hostname} › ${(type || 'info').toLowerCase()}`
        : `portfolio.dev › ${(type || 'info').toLowerCase()}`;

    const descArray = Array.isArray(description) ? description : (description ? [description] : []);
    const descText = descArray.filter(Boolean).join('. ');
    // Much longer limit so content is not cut off
    const truncated = descText.length > 340 ? descText.substring(0, 340) + '…' : descText;

    const initial = (title || company || 'P').charAt(0).toUpperCase();
    const avatarBg = hashColor(company || title || type || '');

    return (
        <div className="search-result">
            {/* URL breadcrumb row */}
            <div className="result-url-row">
                <div className="result-favicon" style={{ background: avatarBg }}>
                    {image
                        ? <img src={image} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        : initial
                    }
                </div>
                <div className="result-breadcrumb">
                    <cite>{breadcrumb}</cite>
                </div>
                <span className="result-menuicon" style={{ display: 'flex', color: 'var(--g-secondary)' }}>
                    {Icons.more}
                </span>
            </div>

            {/* Title */}
            <a
                className="result-title"
                href={url && url !== '#' ? url : undefined}
                target={url && url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={onClick}
            >
                {title}{company ? ` — ${company}` : ''}
            </a>

            {/* Badges — no emojis, clean text only */}
            <div className="result-badges">
                {type && (
                    <span className={`result-badge ${badgeClass(type)}`}>{type}</span>
                )}
                {dateRange && (
                    <span className="result-badge badge-date">
                        <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '3px' }}>{Icons.calendar}</span>
                        {dateRange}
                    </span>
                )}
                {tags && tags.map((tag, i) => (
                    <span key={i} className={`result-badge ${BADGE_CLASSES[(i + 1) % BADGE_CLASSES.length]}`}>{tag}</span>
                ))}
            </div>

            {/* Description — full text, generous limit */}
            {descText && (
                <p className="result-desc">
                    {subtitle && <span className="result-desc-date">{subtitle} — </span>}
                    {truncated}
                </p>
            )}

            {/* Sitelinks (key bullet points) */}
            {sitelinks && sitelinks.filter(Boolean).length > 0 && (
                <div className="result-sitelinks">
                    {sitelinks.filter(Boolean).slice(0, 6).map((s, i) => (
                        <div key={i} className="sitelink-item">
                            <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '4px', flexShrink: 0, color: 'var(--g-link)' }}>{Icons.chevron}</span>
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResult;
