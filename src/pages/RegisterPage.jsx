import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SharedLayout from '../components/SharedLayout';
import AuthSidePanel from '../components/AuthSidePanel';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';
import '../css/Auth.css';

const RegisterPage = ({ theme, toggleTheme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PROFESSIONAL'); // Default role
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
            // Redirect to OTP verification page with email in state
            navigate('/verify-otp', { state: { email } });
        } catch (err) {
            console.error("Registration failed", err);
            if (err.response?.data) {
                setError(err.response.data);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Failed to create account. Please try again.");
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
                            Create Account
                        </h2>
                        <p className="auth-subtitle">
                            Start building your professional portfolio today
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
                                    placeholder="you@example.com"
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
                                    placeholder="••••••••"
                                    minLength="6"
                                />
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">I am a...</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="auth-input"
                                >
                                    <option value="PROFESSIONAL">Professional (Job Seeker)</option>
                                    <option value="RECRUITER">Recruiter (Hiring)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-button"
                            >
                                {loading ? <Loader size="small" color="#ffffff" /> : 'Get Started'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visuals */}
                <AuthSidePanel
                    title="Join the Community"
                    subtitle="Connect with top companies and showcase your best work."
                    image="/assets/contact.svg"
                />
            </div>
        </SharedLayout>
    );
};

export default RegisterPage;
