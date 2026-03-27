import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import CodingProfiles from './components/CodingProfiles';
import Footer from './components/Footer';
import '../../css/Medium.css';
import '../../css/scrollReveal.css';
import useScrollReveal from '../../hooks/useScrollReveal';


const MediumTemplate = ({ data, isEditing, updateData, onArrayUpdate, setUserData, theme, toggleTheme, validationTrigger }) => {
    // Re-run whenever editing mode changes so newly revealed sections get observed
    useScrollReveal(
        '.reveal',
        'reveal-visible',
        { threshold: 0.08, rootMargin: '0px 0px -60px 0px' },
        [isEditing]
    );

    const shouldShow = (sectionData) => {
        if (isEditing) return true;
        return sectionData && sectionData.length > 0;
    };

    // Wrap a section's heading in reveal-fade, body in reveal with sequential delays
    const revealClass = (variant = '', delay = 0) => {
        if (isEditing) return '';
        const base = variant ? `reveal ${variant}` : 'reveal';
        return delay ? `${base} reveal-delay-${delay}` : base;
    };

    return (
        <div className="medium-template animate-fade-in">
            <Header
                data={data.header || { name: data.hero.name }}
                isEditing={isEditing}
                updateData={updateData}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <main className="container">
                {/* Hero — no reveal, it's above the fold */}
                <Hero
                    data={data.hero}
                    isEditing={isEditing}
                    onUpdate={(field, val) => updateData('hero', field, val)}
                    onArrayUpdate={(field, index, val) => {
                        const newRoles = [...data.hero.roles];
                        newRoles[index] = val;
                        updateData('hero', 'roles', newRoles);
                    }}
                    validationTrigger={validationTrigger}
                />

                {/* Experience — each job card self-animates (see Experience.jsx) */}
                {shouldShow(data.experience) && (
                    <div>
                        <Experience
                            data={data.experience}
                            isEditing={isEditing}
                            setUserData={setUserData}
                            validationTrigger={validationTrigger}
                        />
                    </div>
                )}

                {/* Education — slightly delayed so it cascades after experience */}
                {shouldShow(data.education) && (
                    <div className={revealClass('', 0)}>
                        <Education
                            data={data.education || []}
                            isEditing={isEditing}
                            setUserData={setUserData}
                            validationTrigger={validationTrigger}
                        />
                    </div>
                )}

                {/* Projects — each project card self-animates (see Projects.jsx) */}
                {shouldShow(data.projects) && (
                    <div>
                        <Projects
                            data={data.projects}
                            isEditing={isEditing}
                            setUserData={setUserData}
                            validationTrigger={validationTrigger}
                        />
                    </div>
                )}

                {/* Achievements — scale in for visual variety */}
                {shouldShow(data.achievements) && (
                    <div className={revealClass('reveal-scale', 0)}>
                        <Achievements
                            data={data.achievements}
                            isEditing={isEditing}
                            setUserData={setUserData}
                            validationTrigger={validationTrigger}
                        />
                    </div>
                )}

                {/* Skills — fade in (flat grid doesn't need vertical motion) */}
                {shouldShow(data.skills) && (
                    <div className={revealClass('reveal-fade', 0)}>
                        <Skills
                            data={data.skills}
                            isEditing={isEditing}
                            setUserData={setUserData}
                        />
                    </div>
                )}

                {/* Coding Profiles */}
                {(isEditing || (data.codingProfiles && data.codingProfiles.length > 0)) && (
                    <div className={revealClass('', 0)}>
                        <CodingProfiles
                            data={data.codingProfiles || []}
                            isEditing={isEditing}
                            setUserData={setUserData}
                            validationTrigger={validationTrigger}
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
