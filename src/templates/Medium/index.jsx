import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import Footer from './components/Footer';
import '../../css/Medium.css';
import '../../css/scrollReveal.css';
import useScrollReveal from '../../hooks/useScrollReveal';


const MediumTemplate = ({ data, isEditing, updateData, onArrayUpdate, setUserData, theme, toggleTheme }) => {
    useScrollReveal();

    // Helper to check if a section should be visible
    const shouldShow = (sectionData) => {
        if (isEditing) return true;
        return sectionData && sectionData.length > 0;
    };

    return (
        <div className="medium-template animate-fade-in">
            {/* ... Header ... */}
            <Header
                data={data.header || { name: data.hero.name }} // Fallback
                isEditing={isEditing}
                updateData={updateData}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <main className="container">
                <Hero
                    data={data.hero}
                    isEditing={isEditing}
                    onUpdate={(field, val) => updateData('hero', field, val)}
                    onArrayUpdate={(field, index, val) => {
                        const newRoles = [...data.hero.roles];
                        newRoles[index] = val;
                        updateData('hero', 'roles', newRoles);
                    }}
                />

                {shouldShow(data.experience) && (
                    <div className="reveal">
                        <Experience
                            data={data.experience}
                            isEditing={isEditing}
                            setUserData={setUserData}
                        />
                    </div>
                )}

                {shouldShow(data.education) && (
                    <div className="reveal reveal-delay-1">
                        <Education
                            data={data.education || []}
                            isEditing={isEditing}
                            setUserData={setUserData}
                        />
                    </div>
                )}

                {shouldShow(data.projects) && (
                    <div className="reveal reveal-delay-2">
                        <Projects
                            data={data.projects}
                            isEditing={isEditing}
                            setUserData={setUserData}
                        />
                    </div>
                )}

                {shouldShow(data.achievements?.items) && (
                    <div className="reveal reveal-scale">
                        <Achievements
                            data={data.achievements}
                            isEditing={isEditing}
                            setUserData={setUserData}
                        />
                    </div>
                )}

                {shouldShow(data.skills) && (
                    <div className="reveal reveal-delay-1">
                        <Skills
                            data={data.skills}
                            isEditing={isEditing}
                            setUserData={setUserData}
                        />
                    </div>
                )}
            </main>

            <Footer
                data={data.footer}
                isEditing={isEditing}
                updateData={updateData}
            />
        </div>
    );
};

export default MediumTemplate;
