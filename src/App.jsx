import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import MediumTemplate from './templates/Medium';
import ModernTemplate from './templates/Modern';
import Dashboard from './components/Dashboard';
import EditControl from './components/EditControl';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import DashboardPage from './pages/DashboardPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import { savePortfolio, getPortfolio, publishPortfolio } from './services/portfolioService';
import { initialData as defaultTemplate } from './data/initialData';
import Loader from './components/Loader';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import RecruiterUserPreviewPage from './pages/RecruiterUserPreviewPage';

// AppContent handles the main logic requiring AuthContext
const AppContent = () => {
	const { user, loading: authLoading } = useAuth();
	const { addToast } = useToast();
	const [userData, setUserData] = useState(null);
	const [dataLoading, setDataLoading] = useState(false);
	const [fetchError, setFetchError] = useState(null); // Stop infinite loops
	const [isEditing, setIsEditing] = useState(false);
	const isFetchingRef = useRef(false);

	// UX State
	const [isSaving, setIsSaving] = useState(false);
	const [isDeploying, setIsDeploying] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	// Theme State
	const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

	// Theme Effect
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme(prev => prev === 'light' ? 'dark' : 'light');
	};

	// Edit Mode Effect
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		if (params.get('edit') === 'true') {
			setIsEditing(true);
		} else {
			setIsEditing(false);
		}
	}, [location]);

	// Data Fetching Effect
	useEffect(() => {
		const fetchPortfolio = async () => {
			// Use ref to prevent double-fetching in StrictMode or rapid re-renders
			if (user && !userData && !dataLoading && !isFetchingRef.current && !fetchError) {
				isFetchingRef.current = true;
				setDataLoading(true);
				try {
					const responseData = await getPortfolio();


					// Handle potential array wrapper
					let dataToProcess = Array.isArray(responseData) ? responseData[0] : responseData;

					// Try to find portfolio object in various locations
					const portfolio = dataToProcess?.portfolio || dataToProcess?.userData?.portfolio;

					if (portfolio) {
						const pData = portfolio.data || {};
						// Extract properties with fallbacks
						const slug = portfolio.publicSlug || portfolio.slug || pData.slug;
						const isPublished = portfolio.published || !!portfolio.publicSlug || !!pData.slug;
						const activeTemplate = portfolio.activeTemplate || pData.activeTemplate || 'medium';

						console.log("DEBUG: Found portfolio data:", portfolio);
						setUserData({
							...pData,
							_id: dataToProcess.id || dataToProcess.userData?.id,
							slug: slug,
							isPublished: isPublished,
							activeTemplate: activeTemplate
						});
					}
					else if (responseData && responseData.data === null) {
						setUserData(defaultTemplate);
					}
					else if (responseData && responseData.data) {
						// Merge root properties (slug, _id) with the portfolio data
						// Check for slug in root OR nested in data (as user JSON suggests inconsistent structure)
						const slug = responseData.slug || responseData.data.slug;
						const activeTemplate = responseData.activeTemplate || responseData.data.activeTemplate;

						console.log("DEBUG: getPortfolio Response:", responseData);
						console.log("DEBUG: Extracted activeTemplate:", activeTemplate, "Slug:", slug);

						setUserData({
							...responseData.data,
							slug: slug,
							_id: responseData._id,
							activeTemplate: activeTemplate,
							isPublished: !!slug
						});
					}
					else if (responseData && responseData.hero) {
						setUserData(responseData);
					}
					else {
						setUserData(defaultTemplate);
					}
				} catch (err) {
					console.error("Global fetch failed", err);
					if (err.response?.status === 404) {
						setUserData(defaultTemplate);
					} else {
						setFetchError(err); // Stop further retries
					}
				} finally {
					setDataLoading(false);
					isFetchingRef.current = false;
				}
			}
		};

		if (!authLoading && user) {
			fetchPortfolio();
		}
	}, [user, authLoading, userData, dataLoading, fetchError]);


	const toggleEditMode = () => {
		if (isEditing) {
			const url = new URL(window.location);
			url.searchParams.delete('edit');
			window.history.pushState({}, '', url);
			setIsEditing(false);
		} else {
			const url = new URL(window.location);
			url.searchParams.set('edit', 'true');
			window.history.pushState({}, '', url);
			setIsEditing(true);
		}
	};

	const saveToSource = async () => {
		if (!userData) return;
		setIsSaving(true);
		try {
			await savePortfolio(userData);
			addToast("Portfolio saved successfully!", "success");
			// Exit edit mode and go to dashboard
			const url = new URL(window.location);
			url.searchParams.delete('edit');
			window.history.pushState({}, '', url);
			setIsEditing(false);
			navigate('/dashboard');
		} catch (error) {
			console.error("Error saving portfolio:", error);
			const msg = error.response?.data?.errorMessage || error.message || "Failed to save portfolio.";
			addToast(msg, "error");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeploy = async () => {
		if (!userData) return;
		setIsDeploying(true);
		// 1. Auto-save first
		try {
			await savePortfolio(userData);
		} catch (err) {
			addToast("Failed to save before deploying.", "error");
			setIsDeploying(false);
			return;
		}

		// 2. Publish
		try {
			const result = await publishPortfolio();

			let slug = result.slug;
			if (!slug && result.publicUrl) {
				const parts = result.publicUrl.split('/');
				slug = parts[parts.length - 1] || parts[parts.length - 2];
			}

			setUserData(prev => ({
				...prev,
				slug: slug,
				isPublished: true
			}));

			addToast("Portfolio deployed successfully!", "success");
		} catch (error) {
			console.error("Deploy failed", error);
			addToast("Failed to deploy portfolio.", "error");
		} finally {
			setIsDeploying(false);
		}
	};

	const updateData = (section, field, value) => {
		setUserData(prev => {
			const newData = {
				...prev,
				[section]: {
					...prev[section],
					[field]: value
				}
			};

			if (section === 'header' && field === 'name') {
				if (newData.hero) newData.hero.name = value;
			}

			if (section === 'hero' && field === 'name') {
				if (newData.header) newData.header.name = value;
			}

			return newData;
		});
	};

	const setActiveTemplate = (templateId) => {
		setUserData(prev => ({
			...prev,
			activeTemplate: templateId
		}));
	};

	// derived state for Template
	const queryParams = new URLSearchParams(location.search);
	const previewTemplateId = queryParams.get('portfolioStyle');
	const contextTemplateId = previewTemplateId || userData?.activeTemplate || 'medium';
	const Template = contextTemplateId === 'modern' ? ModernTemplate : MediumTemplate;

	// Global Loading State
	if (authLoading) {
		return <Loader fullScreen={true} size="large" />;
	}

	// If fetching initial data
	if (user && dataLoading && !userData) {
		return <Loader fullScreen={true} size="large" />;
	}

	return (
		<div className="App">
			{isEditing && userData && (
				<EditControl
					onSave={saveToSource}
					onExport={() => { }}
					toggleTheme={toggleTheme}
					theme={theme}
					onExitEdit={toggleEditMode}
					isSaving={isSaving}
					isDeploying={isDeploying}
					onDeploy={handleDeploy}
					publicUrl={userData.slug ? `/p/${userData.slug}` : null}
				/>
			)}

			<Routes>
				{/* Public Routes */}
				<Route path="/login" element={<LoginPage theme={theme} toggleTheme={toggleTheme} />} />
				<Route path="/register" element={<RegisterPage theme={theme} toggleTheme={toggleTheme} />} />
				<Route path="/verify-otp" element={<VerifyOtpPage theme={theme} toggleTheme={toggleTheme} />} />

				{/* Protected Dashboard */}
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<DashboardPage
								theme={theme}
								toggleTheme={toggleTheme}
								userData={userData}
								setUserData={setUserData}
								setActiveTemplate={setActiveTemplate}
							/>
						</PrivateRoute>
					}
				/>

				{/* Recruiter Routes */}
				<Route
					path="/recruiter/dashboard"
					element={
						<PrivateRoute>
							<RecruiterDashboardPage theme={theme} toggleTheme={toggleTheme} />
						</PrivateRoute>
					}
				/>
				<Route
					path="/recruiter/user/:id"
					element={
						<PrivateRoute>
							<RecruiterUserPreviewPage theme={theme} toggleTheme={toggleTheme} />
						</PrivateRoute>
					}
				/>

				{/* Public Portfolio Route */}
				<Route path="/p/:slug" element={<PublicPortfolioPage />} />

				{/* Portfolio View (Authenticated Preview) */}
				<Route path="/" element={
					userData ? (
						<Template
							data={userData}
							isEditing={isEditing}
							updateData={updateData}
							setUserData={setUserData}
							theme={theme}
							toggleTheme={toggleTheme}
							onArrayUpdate={() => { }}
						/>
					) : (
						user ? (
							<Navigate to="/dashboard" replace />
						) : (
							<Navigate to="/login" replace />
						)
					)
				} />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</div >
	);
};

import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught error", error, errorInfo);
		this.setState({ errorInfo });
	}

	render() {
		if (this.state.hasError) {
			return (
				<div style={{ padding: '20px', color: 'red', whiteSpace: 'pre-wrap' }}>
					<h1>Something went wrong.</h1>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo && this.state.errorInfo.componentStack}
					</details>
				</div>
			);
		}

		return this.props.children;
	}
}

function App() {
	return (
		<ErrorBoundary>
			<AuthProvider>
				<ToastProvider>
					<AppContent />
				</ToastProvider>
			</AuthProvider>
		</ErrorBoundary>
	);
}

export default App;
