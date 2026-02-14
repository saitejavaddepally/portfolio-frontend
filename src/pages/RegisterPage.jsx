import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SharedLayout from '../components/SharedLayout';
import AuthSidePanel from '../components/AuthSidePanel';
import ErrorAlert from '../components/ErrorAlert';
import '../css/Auth.css';

const RegisterPage = ({ theme, toggleTheme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PROFESSIONAL');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await register(email, password, role);
            // Registration now auto-logs in the user.
            // Redirect immediately to dashboard without showing "success" message.
            navigate('/dashboard');
        } catch (err) {
            console.error("Registration failed", err);
            if (err.response?.data) {
                setError(err.response.data);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Failed to register. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SharedLayout theme={theme} toggleTheme={toggleTheme}>
            <div className="auth-container">
                {/* Left Side: Form */}
                <div className="auth-form-side">
                    <div className="auth-card">
                        <h2 className="auth-title">
                            Get Started
                        </h2>
                        <p className="auth-subtitle">
                            Create your account to start showcasing your work
                        </p>

                        <ErrorAlert error={error} />

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <label className="auth-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                />
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="auth-input"
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label className="auth-label">I am a</label>
                                <div className="auth-select-wrapper">
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="auth-input auth-select"
                                    >
                                        <option value="PROFESSIONAL">Professional (I want to build a portfolio)</option>
                                        <option value="RECRUITER">Recruiter (I want to hire)</option>
                                    </select>
                                    <div className="auth-select-arrow">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-button"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already have an account? <Link to="/login">Sign in here</Link>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visuals */}
                <AuthSidePanel
                    title="Scale Your Team"
                    subtitle="Connect with top-tier developers and designers who are verified and ready to work."
                />
            </div>
        </SharedLayout>
    );
};

export default RegisterPage;
