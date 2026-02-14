import React from 'react';
import '../../css/Medium.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Footer from './components/Footer';

const MediumTemplate = ({ data, isEditing, updateData, onArrayUpdate, setUserData, theme, toggleTheme }) => {
    return (
        <div className="medium-template">
            {/* We might need to import the medium.css here or ensure it's loaded globally for this template */}
            {/* For now, assuming index.css has medium styles globally, but ideally we scope it */}

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

                <Experience
                    data={data.experience}
                    isEditing={isEditing}
                    setUserData={setUserData}
                />

                <Projects
                    data={data.projects}
                    isEditing={isEditing}
                    setUserData={setUserData}
                />

                <Skills
                    data={data.skills}
                    isEditing={isEditing}
                    setUserData={setUserData}
                />
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
