import React from 'react';
import '../css/Recruiter.css';

const UserCard = ({ user, onClick }) => {
    // Access portfolio data safely, handling potential structure variations
    const getPortfolioData = (u) => {
        if (u.userData?.portfolio?.data) return u.userData.portfolio.data; // Specific nested structure from screenshot
        if (u.userData?.portfolio) return u.userData.portfolio; // Just in case
        if (u.userData) return u.userData; // Fallback if flattened
        if (u.data?.hero) return u.data; // Structure from potential JSON variation
        if (u.portfolio?.data?.hero) return u.portfolio.data;
        if (u.portfolio?.hero) return u.portfolio; // Maybe flattened in list
        if (u.hero) return u; // Maybe at root
        return u.portfolio?.data || {}; // Default fallback
    };

    const portfolioData = getPortfolioData(user);

    // Derive current role/company
    let currentRole = "Fresher";
    let currentCompany = "";

    if (portfolioData.experience && portfolioData.experience.length > 0) {
        // Try to find a "Present" role
        const currentExp = portfolioData.experience.find(exp =>
            exp.dates && (exp.dates.toLowerCase().includes('present') || exp.dates.toLowerCase().includes('current'))
        ) || portfolioData.experience[0]; // Fallback to first

        currentRole = currentExp.role;
        currentCompany = currentExp.company;
    }

    // Top 3 skills
    const topSkills = portfolioData.skills ? portfolioData.skills.slice(0, 3) : [];

    return (
        <div className="recruiter-user-card" onClick={onClick}>
            <div className="user-card-header">
                <div className="user-avatar-placeholder">
                    {portfolioData.hero?.name ? portfolioData.hero.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                    <h3 className="user-name">{portfolioData.hero?.name || 'Unnamed Professional'}</h3>
                    <p className="user-role">
                        {currentRole}
                        {currentCompany && <span className="user-company"> @ {currentCompany}</span>}
                    </p>
                </div>
            </div>

            <div className="user-card-skills">
                {topSkills.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                ))}
                {portfolioData.skills && portfolioData.skills.length > 3 && (
                    <span className="skill-badge more">+{portfolioData.skills.length - 3}</span>
                )}
            </div>

            <div className="user-card-footer">
                <span className="view-profile-link">View Portfolio →</span>
            </div>
        </div>
    );
};

export default UserCard;
