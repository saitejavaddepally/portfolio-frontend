/**
 * Validates a section entry. Returns an array of error strings.
 * Returns empty array if valid.
 */

export const validateExperience = (job) => {
    const errors = [];
    if (!job.company || typeof job.company !== 'string' || job.company.trim() === '') errors.push('Company name is required.');
    if (!job.role || typeof job.role !== 'string' || job.role.trim() === '') errors.push('Job title / role is required.');
    if (!job.dates || typeof job.dates !== 'string' || job.dates.trim() === '') errors.push('Dates are required (e.g. Jan 2023 – Present).');
    // Accept description as array OR desc as array/string
    const desc = Array.isArray(job.description) ? job.description
        : Array.isArray(job.desc) ? job.desc
        : job.description ? [job.description]
        : job.desc ? [job.desc]
        : [];
    if (desc.length === 0 || desc.every(d => typeof d !== 'string' || d.trim() === ''))
        errors.push('Add at least one description bullet point.');
    return errors;
};

export const validateProject = (project) => {
    const errors = [];
    if (!project.title || typeof project.title !== 'string' || project.title.trim() === '') errors.push('Project title is required.');
    // Normalize: support both `desc` (array or string) and `description` (array)
    let desc;
    if (Array.isArray(project.description)) {
        desc = project.description;
    } else if (Array.isArray(project.desc)) {
        desc = project.desc;
    } else if (project.desc && typeof project.desc === 'string' && project.desc.trim() !== '') {
        desc = [project.desc];
    } else if (project.description && typeof project.description === 'string' && project.description.trim() !== '') {
        desc = [project.description];
    } else {
        desc = [];
    }
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

/**
 * Validates a single achievement entry (achievements is now an array of these).
 * Title is the mandatory field.
 */
export const validateAchievement = (achievement) => {
    const errors = [];
    if (!achievement.title || typeof achievement.title !== 'string' || achievement.title.trim() === '')
        errors.push('Achievement title is required.');
    return errors;
};

// Keep old export name as alias for backward compat (other templates may still use it)
export const validateAchievements = validateAchievement;

export const validateSkills = (skills) => {
    // Skills can be empty — no required validation
    return [];
};

export const validateHero = (hero) => {
    const errors = [];
    if (!hero) return errors;
    // Only flag empty role inputs if there is more than one role, or if the single role has been explicitly
    // added (i.e. we only flag empty roles when the user has interacted — detected by having > 1 role
    // or a non-empty role exists alongside empty ones).
    if (Array.isArray(hero.roles)) {
        const nonEmptyCount = hero.roles.filter(r => r && r.trim() !== '').length;
        hero.roles.forEach((role, i) => {
            if (!role || role.trim() === '') {
                // Only flag if there are other non-empty roles (meaning user added this intentionally)
                // OR if the hero has a name (meaning they've started filling in data)
                if (nonEmptyCount > 0 || (hero.name && hero.name.trim() !== '')) {
                    errors.push({ field: `role_${i}`, message: 'Role cannot be empty. Fill it in or remove it.' });
                }
            }
        });
    }
    return errors;
};
