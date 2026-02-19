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

    return (
        <div className="google-container">
            <header className="google-header">
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
                    {['All', 'Work', 'Projects', 'Connect'].map(tab => (
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
                        About {data.experience?.length + data.projects?.length || 0} results (0.42 seconds)
                    </div>

                    {activeTab === 'All' && (
                        <>
                            {renderExperience()}
                            {renderProjects()}
                        </>
                    )}
                    {activeTab === 'Work' && renderExperience()}
                    {activeTab === 'Projects' && renderProjects()}
                    {activeTab === 'Connect' && (
                        <div className="panel-socials" style={{ border: 'none' }}>
                            {/* Reusing social links logic if needed, or just KnowledgePanel handles it */}
                            See Knowledge Panel →
                        </div>
                    )}
                </div>

                <aside className="google-side-col">
                    <KnowledgePanel userData={data} />
                </aside>
            </main>
        </div>
    );
};

export default GoogleTemplate;
