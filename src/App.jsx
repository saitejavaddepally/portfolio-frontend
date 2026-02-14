import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import MediumTemplate from './templates/Medium';
import ModernTemplate from './templates/Modern';
import Dashboard from './components/Dashboard';
import EditControl from './components/EditControl';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import { savePortfolio, getPortfolio } from './services/portfolioService';
import { initialData as defaultTemplate } from './data/initialData';

// AppContent handles the main logic requiring AuthContext
const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

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
      // If user is logged in (specifically a professional) and we don't have data, fetch it.
      // Recruiters don't have portfolios yet, so maybe skip?
      // For now, let's treat "Professional" as the only one with data.
      if (user && !userData && !dataLoading) {
        // Only fetch if role suggests they have a portfolio. 
        // Or just fetch and handle 404 (handled by portfolioService/Dashboard logic previously).
        // Let's adopt the logic: Try fetch. If 404/Empty -> Default.

        setDataLoading(true);
        try {
          const responseData = await getPortfolio();

          // Handle various response structures
          // 1. { data: null } -> No portfolio, use default
          if (responseData && responseData.data === null) {
            setUserData(defaultTemplate);
          }
          // 2. { data: {...} } -> Wrapped portfolio
          else if (responseData && responseData.data) {
            setUserData(responseData.data);
          }
          // 3. {...} -> Direct portfolio object (check for a known key like hero)
          else if (responseData && responseData.hero) {
            setUserData(responseData);
          }
          // 4. Default fallback
          else {
            setUserData(defaultTemplate);
          }
        } catch (err) {
          console.error("Global fetch failed", err);
          // If 404, default template. Else, maybe keep null and let page handle error?
          if (err.response?.status === 404) {
            setUserData(defaultTemplate);
          }
          // If other error, we might leave userData as null 
          // and the page will show empty or we can rely on DashboardPage to show retry.
        } finally {
          setDataLoading(false);
        }
      }
    };

    if (!authLoading && user) {
      fetchPortfolio();
    }
  }, [user, authLoading, userData, dataLoading]);


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
    try {
      await savePortfolio(userData);
      alert("Portfolio saved successfully!");
    } catch (error) {
      console.error("Error saving portfolio:", error);
      const msg = error.response?.data?.errorMessage || error.message || "Failed to save portfolio.";
      alert(msg);
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

      // Sync header.name and hero.name
      // If we update header name, also update hero name
      if (section === 'header' && field === 'name') {
        if (newData.hero) newData.hero.name = value;
      }

      // If we update hero name, also update header name
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
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Loading Auth...</div>;
  }

  // If fetching initial data
  if (user && dataLoading && !userData) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Loading Portfolio...</div>;
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
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/register" element={<RegisterPage theme={theme} toggleTheme={toggleTheme} />} />

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
              // If logged in but no userData (and not loading), maybe failed to load?
              // Or user is a recruiter?
              // Redirect to dashboard to handle "No Portfolio" state or Recruiter view
              <Navigate to="/dashboard" replace />
            ) : (
              // Guest: Should show a landing page or login. 
              // Per requirements, we assume auth-centric for now.
              <Navigate to="/login" replace />
            )
          )
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
