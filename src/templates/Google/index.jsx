import React, { useState } from 'react';
import './Google.css';
import SearchResult from './components/SearchResult';
import KnowledgePanel from './components/KnowledgePanel';

const GoogleTemplate = ({ data, isEditing, updateData, setUserData }) => {
    const [activeTab, setActiveTab] = useState('All');

    const renderExperience = () => (
        <>
            {data.experience && data.experience.map((job, index) => (
                <SearchResult
                    key={`exp-${index}`}
                    type="Experience"
                    title={job.role}
                    company={job.company}
                    subtitle={`${job.dates}`}
                    description={job.description}
                    url="#" // Could be company URL
                />
            ))}
        </>
    );

    const renderProjects = () => (
        <>
            {data.projects && data.projects.map((proj, index) => (
                <SearchResult
                    key={`proj-${index}`}
                    type="Project"
                    title={proj.title}
                    company=""
                    subtitle="Project"
                    description={proj.description}
                    url={proj.link}
                />
            ))}
        </>
    );

    const renderEducation = () => (
        <>
            {data.education && data.education.map((edu, index) => (
                <SearchResult
                    key={`edu-${index}`}
                    type="Education"
                    title={edu.school}
                    company={edu.degree}
                    subtitle={edu.year}
                    description={[edu.description]}
                    url="#"
                />
            ))}
        </>
    );

    const renderCredentials = () => (
        <>
            {data.achievements?.items && (
                <SearchResult
                    type="Credentials"
                    title={data.achievements.title || "Achievements"}
                    company=""
                    subtitle="Certifications & Awards"
                    description={data.achievements.items}
                    url="#"
                />
            )}
        </>
    );

    const renderProfiles = () => (
        <>
            {data.codingProfiles && data.codingProfiles.map((prof, index) => (
                <SearchResult
                    key={`prof-${index}`}
                    type="Profile"
                    title={prof.platform}
                    company={prof.username}
                    subtitle="Coding Profile"
                    description={[`Check out my profile on ${prof.platform}`]}
                    url={prof.url}
                />
            ))}
        </>
    );

    const tabs = ['All', 'Work', 'Projects', 'Education', 'Credentials', 'Profiles'];

    // Flexible data extraction — handles different data structures
    const totalResults = (data.experience?.length || 0) +
        (data.projects?.length || 0) +
        (data.education?.length || 0) +
        (data.codingProfiles?.length || 0);

    return (
        <div className="google-container">
            <header className="google-header">
                {/* ... header top bar ... */}
                <div className="google-top-bar">
                    <div className="google-logo">
                        <span className="g-blue">G</span>
                        <span className="g-red">o</span>
                        <span className="g-yellow">o</span>
                        <span className="g-blue">g</span>
                        <span className="g-green">l</span>
                        <span className="g-red">e</span>
                    </div>
                    <div className="google-search-bar">
                        <input value={data.hero?.name || "Portfolio"} readOnly />
                        <span style={{ color: '#4285f4', fontSize: '1.2rem' }}>🔍</span>
                    </div>
                    <div className="google-avatar">
                        {data.hero?.image && <img src={data.hero.image} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />}
                    </div>
                </div>

                <div className="google-nav">
                    {tabs.map(tab => (
                        <div
                            key={tab}
                            className={`google-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </header>

            <main className="google-content">
                <div className="google-main-col">
                    <div className="search-meta">
                        About {totalResults} results ({(Math.random() * 0.5 + 0.2).toFixed(2)} seconds)
                    </div>

                    {activeTab === 'All' && (
                        <>
                            {renderExperience()}
                            {renderProjects()}
                            {renderEducation()}
                            {renderCredentials()}
                            {renderProfiles()}
                        </>
                    )}
                    {activeTab === 'Work' && renderExperience()}
                    {activeTab === 'Projects' && renderProjects()}
                    {activeTab === 'Education' && renderEducation()}
                    {activeTab === 'Credentials' && renderCredentials()}
                    {activeTab === 'Profiles' && renderProfiles()}
                </div>

                <aside className="google-side-col">
                    <KnowledgePanel userData={data} />
                </aside>
            </main>
        </div>
    );
};

export default GoogleTemplate;
