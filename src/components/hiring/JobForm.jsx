import React, { useState } from 'react';
import '../../css/Jobs.css';

/**
 * JobForm — used on /recruiter/post-job
 * @param {function} onSubmit — receives new job object
 */
const JobForm = ({ onSubmit }) => {
    const [form, setForm] = useState({
        companyName: '',
        role: '',
        jobType: 'Full-time',
        experienceRequired: '',
        salaryRange: '',
        location: '',
        requiredSkills: '',
        niceToHave: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.companyName.trim()) e.companyName = 'Company Name is required';
        if (!form.role.trim()) e.role = 'Role is required';
        if (!form.experienceRequired.trim()) e.experienceRequired = 'Experience is required';
        if (!form.location.trim()) e.location = 'Location is required';
        if (!form.requiredSkills.trim()) e.requiredSkills = 'At least one required skill needed';
        if (!form.description.trim()) e.description = 'Description is required';
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
            companyName: form.companyName.trim(),
            role: form.role.trim(),
            jobType: form.jobType,
            experienceRequired: form.experienceRequired.trim(),
            salaryRange: form.salaryRange.trim(),
            location: form.location.trim(),
            requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
            niceToHave: form.niceToHave.split(',').map(s => s.trim()).filter(Boolean),
            description: form.description.trim(),
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
                    name="companyName"
                    label="Company Name *"
                    placeholder="e.g. TechNova Corp"
                />
                <Field
                    name="role"
                    label="Job Role *"
                    placeholder="e.g. Senior Backend Developer"
                />
            </div>
            <div className="form-row">
                <div className="form-field">
                    <label htmlFor="field-jobType">Job Type *</label>
                    <select
                        id="field-jobType"
                        className="form-input"
                        value={form.jobType}
                        onChange={handleChange('jobType')}
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
                <Field
                    name="location"
                    label="Location *"
                    placeholder="e.g. Remote, Bangalore"
                />
            </div>
            <div className="form-row">
                <Field
                    name="experienceRequired"
                    label="Experience Required *"
                    placeholder="e.g. 3+ years"
                />
                <Field
                    name="salaryRange"
                    label="Salary Range"
                    placeholder="e.g. $120k - $150k"
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

            <div className="form-field">
                <label htmlFor="field-description">Job Description *</label>
                <textarea
                    id="field-description"
                    className="form-input"
                    rows="4"
                    placeholder="Describe the responsibilities, requirements, and benefits..."
                    value={form.description}
                    onChange={handleChange('description')}
                    style={errors.description ? { borderColor: '#f87171', boxShadow: '0 0 0 3px rgba(248,113,113,0.15)', resize: 'vertical' } : { resize: 'vertical' }}
                />
                {errors.description && (
                    <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{errors.description}</span>
                )}
            </div>

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
