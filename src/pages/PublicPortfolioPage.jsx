import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicPortfolio } from '../services/portfolioService';
import MediumTemplate from '../templates/Medium';
import ModernTemplate from '../templates/Modern';

const PublicPortfolioPage = () => {
    const { slug } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Theme state (Public View typically defaults to light or user preference, 
    // but here we can default to light or read from portfolio config if we saved it)
    const [theme, setTheme] = useState('light'); // Could load from userData if we saved 'theme' preference

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
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: '"Source Serif Pro", serif',
                color: '#666'
            }}>
                Loading Portfolio...
            </div>
        );
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
    const Template = activeTemplate === 'modern' ? ModernTemplate : MediumTemplate;

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
