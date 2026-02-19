/**
 * Validates a section entry. Returns an array of error strings.
 * Returns empty array if valid.
 */

export const validateExperience = (job) => {
    const errors = [];
    if (!job.company || typeof job.company !== 'string' || job.company.trim() === '') errors.push('Company name is required.');
    if (!job.role || typeof job.role !== 'string' || job.role.trim() === '') errors.push('Job title / role is required.');
    if (!job.dates || typeof job.dates !== 'string' || job.dates.trim() === '') errors.push('Dates are required (e.g. Jan 2023 – Present).');
    if (!job.description || job.description.every(d => typeof d !== 'string' || d.trim() === ''))
        errors.push('Add at least one description bullet point.');
    return errors;
};

export const validateProject = (project) => {
    const errors = [];
    if (!project.title || typeof project.title !== 'string' || project.title.trim() === '') errors.push('Project title is required.');
    const desc = Array.isArray(project.description) ? project.description : (project.desc ? [project.desc] : []);
    if (desc.length === 0 || desc.every(d => typeof d !== 'string' || d.trim() === ''))
        errors.push('Add at least one description point.');
    return errors;
};

export const validateEducation = (edu) => {
    const errors = [];
    if (!edu.school || typeof edu.school !== 'string' || edu.school.trim() === '') errors.push('School / University name is required.');
    if (!edu.dates || typeof edu.dates !== 'string' || edu.dates.trim() === '') errors.push('Dates are required.');
    return errors;
};

export const validateCodingProfile = (profile) => {
    const errors = [];
    if (!profile.username || typeof profile.username !== 'string' || profile.username.trim() === '') errors.push('Username is required.');
    if (!profile.url || typeof profile.url !== 'string' || profile.url.trim() === '') errors.push('Profile URL is required.');
    return errors;
};

export const validateAchievements = (achievements) => {
    const errors = [];
    if (!achievements.title || typeof achievements.title !== 'string' || achievements.title.trim() === '') errors.push('Achievement title is required.');
    // items can be empty if user just wants a title or forgot to add items? 
    // Actually, if title is present, items are optional now.
    return errors;
};

export const validateSkills = (skills) => {
    // Skills can be empty
    return [];
};
