import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SharedLayout from '../components/SharedLayout';
import AuthSidePanel from '../components/AuthSidePanel';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';
import '../css/Auth.css';

const VerifyOtpPage = ({ theme, toggleTheme }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Email should be passed via navigation state
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            // If no email in state (e.g. direct access), redirect to register
            navigate('/register', { replace: true });
        }
    }, [email, navigate]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Only numbers
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await verifyOtp(email, otp);
            // Success! Token is stored by AuthContext, redirect to dashboard
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error("OTP Verification failed", err);
            if (err.response?.data) {
                setError(err.response.data);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Failed to verify OTP. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!email) return null; // Should redirect via useEffect

    return (
        <SharedLayout theme={theme} toggleTheme={toggleTheme}>
            <div className="auth-container">
                {/* Left Side: Form */}
                <div className="auth-form-side">
                    <div className="auth-card">
                        <h2 className="auth-title">
                            Check Your Email
                        </h2>
                        <p className="auth-subtitle">
                            We've sent a 6-digit verification code to <br /><strong>{email}</strong>
                        </p>

                        <ErrorAlert error={error} />

                        <form onSubmit={handleSubmit}>
                            <div className="auth-input-group">
                                <label className="auth-label">Verification Code</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength="6"
                                    value={otp}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit code"
                                    className="auth-input"
                                    style={{ letterSpacing: '0.2em', fontSize: '1.2rem', textAlign: 'center' }}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="auth-button"
                            >
                                {loading ? <Loader size="small" color="#ffffff" /> : 'Verify Email'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <span style={{ color: 'var(--text-secondary)' }}>Didn't receive code? </span>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary-color)',
                                    cursor: 'pointer',
                                    padding: 0,
                                    font: 'inherit',
                                    fontWeight: 500
                                }}>
                                Try again with a different email
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visuals */}
                <AuthSidePanel
                    title="Secure Verification"
                    subtitle="Protecting your account with industry-standard security."
                    image="/assets/contact.svg"
                />
            </div>
        </SharedLayout>
    );
};

export default VerifyOtpPage;
