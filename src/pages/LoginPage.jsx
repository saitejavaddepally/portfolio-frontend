import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SharedLayout from '../components/SharedLayout';
import AuthSidePanel from '../components/AuthSidePanel';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';
import '../css/Auth.css';

const LoginPage = ({ theme, toggleTheme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await login(email, password);
            const role = data.role || '';

            // Always redirect based on the actual role of the user who just logged in.
            // Never trust location.state.from — it may be from a different role's session.
            if (role.toLowerCase().includes('recruiter')) {
                navigate('/recruiter/dashboard', { replace: true });
            } else {
                navigate('/professional/dashboard', { replace: true });
            }
        } catch (err) {
            console.error('Login failed', err);
            if (err.response?.data) {
                setError(err.response.data);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Failed to login. Please check your credentials.');
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
                            Welcome Back
                        </h2>
                        <p className="auth-subtitle">
                            Sign in to continue building your portfolio
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

                            <div style={{ marginBottom: '2rem' }}>
                                <label className="auth-label">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="auth-input"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-button"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader size="small" color="#ffffff" inline />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Don't have an account? <Link to="/register">Register for free</Link>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visuals */}
                <AuthSidePanel
                    title="Design Your Future"
                    subtitle="Join thousands of professionals showcasing their work."
                    image="/assets/contact.svg"
                />
            </div>
        </SharedLayout>
    );
};

export default LoginPage;
