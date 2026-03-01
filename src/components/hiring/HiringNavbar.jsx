import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../css/Jobs.css';

/**
 * HiringNavbar — sticky sub-navigation for the hiring platform section.
 * Placed below the SharedLayout header.
 */
const HiringNavbar = () => {
    return (
        <nav className="hiring-nav">
            <div className="hiring-nav-brand">
                <div className="hiring-nav-brand-dot" />
                Jobs Platform
            </div>
            <div className="hiring-nav-links">
                <NavLink
                    to="/recruiter/jobs"
                    id="nav-recruiter-dashboard"
                    className={({ isActive }) =>
                        `hiring-nav-link${isActive ? ' active' : ''}`
                    }
                >
                    My Jobs
                </NavLink>
                <NavLink
                    to="/recruiter/post-job"
                    id="nav-post-job"
                    className={({ isActive }) =>
                        `hiring-nav-link${isActive ? ' active' : ''}`
                    }
                >
                    Post Job
                </NavLink>
            </div>
        </nav>
    );
};

export default HiringNavbar;
