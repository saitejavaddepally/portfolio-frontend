import React from 'react';

const Skills = ({ data, isEditing, setUserData }) => {

    const handleUpdate = (index, value) => {
        setUserData(prev => {
            const newData = [...prev.skills];
            newData[index] = value;
            return { ...prev, skills: newData };
        });
    };

    const addSkill = () => {
        setUserData(prev => ({
            ...prev,
            skills: [...prev.skills, "New Skill"]
        }));
    };

    const removeSkill = (index) => {
        setUserData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="skills-section">
            <h3>Technical Skills</h3>
            <div className="skills-container">
                {data.map((skill, index) => (
                    isEditing ? (
                        <div key={index} style={{ position: 'relative' }}>
                            <input
                                value={skill}
                                onChange={(e) => handleUpdate(index, e.target.value)}
                                className="skill-tag"
                                style={{ border: '1px dashed var(--border-color)', minWidth: '80px', textAlign: 'center', background: 'transparent', color: 'inherit' }}
                            />
                            <button
                                onClick={() => removeSkill(index)}
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '15px',
                                    height: '15px',
                                    fontSize: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >x</button>
                        </div>
                    ) : (
                        <span key={index} className="skill-tag">{skill}</span>
                    )
                ))}

                {isEditing && (
                    <button onClick={addSkill} className="skill-tag" style={{ border: '1px dashed #ccc', cursor: 'pointer' }}>+ Add</button>
                )}
            </div>
        </div>
    );
};

export default Skills;
