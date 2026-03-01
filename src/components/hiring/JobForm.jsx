import React, { useState } from 'react';
import '../../css/Jobs.css';

/**
 * JobForm — used on /recruiter/post-job
 * @param {function} onSubmit — receives new job object
 */
const JobForm = ({ onSubmit }) => {
    const [form, setForm] = useState({
        role: '',
        experienceRequired: '',
        location: '',
        requiredSkills: '',
        niceToHave: ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.role.trim()) e.role = 'Role is required';
        if (!form.experienceRequired.trim()) e.experienceRequired = 'Experience is required';
        if (!form.location.trim()) e.location = 'Location is required';
        if (!form.requiredSkills.trim()) e.requiredSkills = 'At least one required skill needed';
        return e;
    };

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        const newJob = {
            jobId: `job_${Date.now()}`,
            recruiterId: 'rec123',
            role: form.role.trim(),
            experienceRequired: form.experienceRequired.trim(),
            location: form.location.trim(),
            requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
            niceToHave: form.niceToHave.split(',').map(s => s.trim()).filter(Boolean),
            status: 'Open',
            createdAt: new Date().toISOString().split('T')[0]
        };

        onSubmit(newJob);
    };

    const Field = ({ name, label, placeholder, hint }) => (
        <div className="form-field">
            <label htmlFor={`field-${name}`}>{label}</label>
            <input
                id={`field-${name}`}
                type="text"
                className="form-input"
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange(name)}
                style={errors[name] ? { borderColor: '#f87171', boxShadow: '0 0 0 3px rgba(248,113,113,0.15)' } : {}}
            />
            {errors[name] && (
                <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{errors[name]}</span>
            )}
            {hint && !errors[name] && <span className="form-hint">{hint}</span>}
        </div>
    );

    return (
        <form className="job-form-card" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
                <Field
                    name="role"
                    label="Job Role *"
                    placeholder="e.g. Senior Backend Developer"
                />
                <Field
                    name="experienceRequired"
                    label="Experience Required *"
                    placeholder="e.g. 3+ years"
                />
            </div>
            <div className="form-row">
                <Field
                    name="location"
                    label="Location *"
                    placeholder="e.g. Remote, Bangalore"
                />
            </div>
            <Field
                name="requiredSkills"
                label="Required Skills *"
                placeholder="Java, Spring Boot, MongoDB"
                hint="Comma-separated list of skills"
            />
            <Field
                name="niceToHave"
                label="Nice to Have"
                placeholder="Kafka, AWS, Docker"
                hint="Optional comma-separated skills"
            />

            <div className="form-actions">
                <button
                    id="submit-job-form"
                    type="submit"
                    className="btn-primary"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Post Job
                </button>
            </div>
        </form>
    );
};

export default JobForm;
