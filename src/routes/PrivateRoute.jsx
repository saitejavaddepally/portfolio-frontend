import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

/**
 * PrivateRoute — guards authenticated routes.
 *
 * Props:
 *   requiredRole (optional) — 'recruiter' or 'professional'. If provided,
 *   a logged-in user with the wrong role gets redirected to their own dashboard
 *   instead of seeing the requested page.
 */
const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader fullScreen={true} size="large" />;
    }

    // Not logged in — send to login, preserving where they wanted to go
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but wrong role — redirect to their own dashboard
    if (requiredRole) {
        const userIsRecruiter = user.role?.toLowerCase().includes('recruiter');
        const needsRecruiter = requiredRole.toLowerCase() === 'recruiter';

        if (userIsRecruiter !== needsRecruiter) {
            const correctDashboard = userIsRecruiter
                ? '/recruiter/dashboard'
                : '/professional/dashboard';
            return <Navigate to={correctDashboard} replace />;
        }
    }

    return children;
};

export default PrivateRoute;
