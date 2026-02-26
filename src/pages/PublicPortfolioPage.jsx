import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicPortfolio } from '../services/portfolioService';
import MediumTemplate from '../templates/Medium';
import ModernTemplate from '../templates/Modern';
import GoogleTemplate from '../templates/Google';
import InstagramTemplate from '../templates/Instagram';
import TerminalTemplate from '../templates/Terminal';
import Loader from '../components/Loader';

const PublicPortfolioPage = () => {
    const { slug } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize theme from localStorage so user preference persists per-profile
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem(`portfolio-theme-${slug}`);
        if (savedTheme) return savedTheme;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    // Dynamic Title Effect
    useEffect(() => {
        if (userData?.hero?.name) {
            document.title = userData.hero.name;
        } else if (userData) {
            document.title = "Portfolio"; // Fallback if name is missing but data loaded
        }

        // Cleanup: Revert to default title when component unmounts or slug changes
        return () => {
            document.title = "PortHire";
        };
    }, [userData]);

    useEffect(() => {
        const fetchPublicPortfolio = async () => {
            try {
                setLoading(true);
                const data = await getPublicPortfolio(slug);
                setUserData(data);
            } catch (err) {
                console.error("Failed to load public portfolio", err);
                setError("Portfolio not found.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPublicPortfolio();
        }
    }, [slug]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem(`portfolio-theme-${slug}`, newTheme);
            return newTheme;
        });
    };

    if (loading) {
        return <Loader fullScreen={true} size="large" />;
    }

    if (error || !userData) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: '"Source Serif Pro", serif',
                color: '#333',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404</h1>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>{error || "Portfolio not found."}</p>
            </div>
        );
    }

    // Determine Template
    const activeTemplate = userData.activeTemplate || 'medium';

    let Template;
    switch (activeTemplate) {
        case 'modern': Template = ModernTemplate; break;
        case 'google': Template = GoogleTemplate; break;
        case 'instagram': Template = InstagramTemplate; break;
        case 'terminal': Template = TerminalTemplate; break;
        case 'medium':
        default: Template = MediumTemplate; break;
    }

    // Render Read-Only Template
    return (
        <Template
            data={userData}
            isEditing={false} // READ ONLY
            updateData={() => { }} // No-op
            setUserData={() => { }} // No-op
            theme={theme}
            toggleTheme={toggleTheme}
            onArrayUpdate={() => { }} // No-op
        />
    );
};

export default PublicPortfolioPage;
