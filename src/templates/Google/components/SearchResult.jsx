import React from 'react';

const SearchResult = ({ title, company, subtitle, url, description, image, onClick, type }) => {
    // Generate a fake URL for display if real one missing
    const displayUrl = url || `https://${company ? company.toLowerCase().replace(/\s/g, '') : 'portfolio'}.com › ${type}`;

    // Description: if array, join with periods. If string, use as is.
    const descText = Array.isArray(description) ? description.join('. ') : description;
    const truncatedDesc = descText && descText.length > 160 ? descText.substring(0, 160) + '...' : descText;

    return (
        <div className="search-result">
            <div className="result-url">
                {image && <img src={image} alt={company || title} />}
                <cite>{displayUrl}</cite>
                <div style={{ marginLeft: 'auto', color: '#5f6368', fontSize: '13px' }}>⋮</div>
            </div>
            <h3 className="result-title" onClick={onClick}>
                {title} {company ? `- ${company}` : ''}
            </h3>
            <p className="result-desc">
                {subtitle && <span style={{ color: '#70757a' }}>{subtitle} — </span>}
                {truncatedDesc}
            </p>
            {/* Sitelinks or sub-results could go here */}
        </div>
    );
};

export default SearchResult;
