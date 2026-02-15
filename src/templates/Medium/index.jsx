import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import Footer from './components/Footer';
import '../../css/Medium.css';


const MediumTemplate = ({ data, isEditing, updateData, onArrayUpdate, setUserData, theme, toggleTheme }) => {
    // Helper to check if a section should be visible
    const shouldShow = (sectionData) => {
        if (isEditing) return true;
        return sectionData && sectionData.length > 0;
    };

    return (
        <div className="medium-template">
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
                    <Experience
                        data={data.experience}
                        isEditing={isEditing}
                        setUserData={setUserData}
                    />
                )}

                {shouldShow(data.education) && (
                    <Education
                        data={data.education || []}
                        isEditing={isEditing}
                        setUserData={setUserData}
                    />
                )}

                {shouldShow(data.projects) && (
                    <Projects
                        data={data.projects}
                        isEditing={isEditing}
                        setUserData={setUserData}
                    />
                )}

                {shouldShow(data.achievements?.items) && (
                    <Achievements
                        data={data.achievements}
                        isEditing={isEditing}
                        setUserData={setUserData}
                    />
                )}

                {shouldShow(data.skills) && (
                    <Skills
                        data={data.skills}
                        isEditing={isEditing}
                        setUserData={setUserData}
                    />
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
