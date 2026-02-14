import React from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/Dashboard';
import SharedLayout from '../components/SharedLayout';
import '../css/DashboardPage.css';

const DashboardPage = ({ theme, toggleTheme, userData, setUserData, setActiveTemplate }) => {
    const { user } = useAuth();

    // Determine role
    const role = user?.role ? user.role.toUpperCase() : 'USER';
    const isRecruiter = role.includes('RECRUITER') || role.includes('ADMIN');
    const isProfessional = role.includes('PROFESSIONAL') || !isRecruiter;

    return (
        <SharedLayout showUserInfo={true} theme={theme} toggleTheme={toggleTheme}>
            {isProfessional ? (
                // For Professionals: Show the Portfolio Dashboard
                // userData is passed from App, fetched globally
                <Dashboard
                    activeTemplate={userData?.activeTemplate || 'medium'}
                    onSelectTemplate={setActiveTemplate}
                    isPublished={!!userData?.slug}
                    publicUrl={userData?.slug ? `/p/${userData.slug}` : null}
                    onPublish={async () => {
                        // 1. Save current state first to ensure record exists in DB
                        try {
                            const currentName = userData.header?.name || userData.hero?.name || '';
                            const nameSlug = currentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                            let newSlug = userData.slug;
                            if (userData.slug && !userData.slug.includes(nameSlug)) {
                                console.log("Name changed, forcing slug regeneration on publish");
                                newSlug = null;
                            }

                            // Strip slug to force backend to regenerate it based on new name if needed
                            const payload = { ...userData, slug: newSlug };

                            // Also ensure activeTemplate is saved
                            await import('../services/portfolioService').then(m => m.savePortfolio(payload));
                            return true; // Signal success to proceed with publish
                        } catch (err) {
                            console.error("Auto-save before publish failed", err);
                            throw new Error("Failed to save portfolio before publishing.");
                        }
                    }}
                    onPublishUpdate={(url) => {
                        // Update local userData to reflect published state
                        setUserData(prev => ({
                            ...prev,
                            slug: url.split('/').pop(), // Extract slug if full URL, or just use it
                            isPublished: true
                        }));
                    }}
                    onDeployTemplate={async (templateId) => {
                        try {
                            // 1. Prepare data with new template
                            // 1. Prepare data with new template
                            const currentName = userData.header?.name || userData.hero?.name || '';
                            const nameSlug = currentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                            // Check if current slug matches name (roughly)
                            // If current slug is 'saiteja-v' and name is 'Saiteja V.', it matches.
                            // If name is 'John Doe', slug should be 'john-doe'.
                            // If they differ, we nullify slug to force regen.
                            let newSlug = userData.slug;
                            if (userData.slug && !userData.slug.includes(nameSlug)) {
                                console.log("Name changed, forcing slug regeneration");
                                newSlug = null;
                            }

                            const payload = {
                                ...userData,
                                activeTemplate: templateId,
                                slug: newSlug
                            };

                            // 2. Save
                            await import('../services/portfolioService').then(m => m.savePortfolio(payload));

                            // 3. Publish
                            const result = await import('../services/portfolioService').then(m => m.publishPortfolio());
                            console.log("Publish result:", result);

                            // 4. Update State
                            let slug = result.slug;

                            if (!slug && result.publicUrl) {
                                // Fallback: extract slug from publicUrl
                                try {
                                    // Handle full URL or relative path
                                    const url = result.publicUrl;
                                    const parts = url.split('/');
                                    slug = parts[parts.length - 1] || parts[parts.length - 2];
                                    // If ends with /, pop gives empty string, so take previous.
                                    if (!slug) slug = parts[parts.length - 2];
                                } catch (e) {
                                    console.warn("Failed to extract slug from publicUrl", e);
                                }
                            }

                            if (!slug) {
                                console.error("Publish returned no slug and limited publicUrl!", result);
                                throw new Error("Publish failed to return a slug context.");
                            }

                            setUserData(prev => ({
                                ...prev,
                                ...payload,
                                slug: slug,
                                isPublished: true
                                // Also update publicUrl if available
                            }));

                            // 5. Update App active template
                            setActiveTemplate(templateId);

                            return result;
                        } catch (err) {
                            console.error("Deploy template failed", err);
                            throw err;
                        }
                    }}
                />
            ) : (
                // For Recruiters: Show Recruiter Dashboard
                <div className="recruiter-container">
                    <div className="recruiter-card">
                        <h1 className="recruiter-title">Recruiter Dashboard</h1>
                        <p className="recruiter-subtitle">
                            Discover top engineering talent for your teams.
                        </p>

                        <div className="placeholder-search-area">
                            <div className="search-icon">🔍</div>
                            Placeholder: Search and filter functionality coming soon.
                        </div>
                    </div>
                </div>
            )}
        </SharedLayout>
    );
};

export default DashboardPage;
