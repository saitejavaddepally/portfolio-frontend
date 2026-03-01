import React from 'react';
import '../../css/Jobs.css';

/**
 * SkillTag — reusable skill chip
 * @param {string} skill - skill label
 * @param {"required"|"nice"|"neutral"} variant - visual style
 */
const SkillTag = ({ skill, variant = 'required' }) => {
    return (
        <span className={`skill-tag ${variant}`}>
            {skill}
        </span>
    );
};

export default SkillTag;
