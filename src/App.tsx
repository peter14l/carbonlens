import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Calculator from './pages/Calculator';
import Insights from './pages/Insights';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

function AppRoutes() {
  const profile = useAppStore((s) => s.profile);

  if (!profile.onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <a href="#/main-content" className="skip-to-content">
          Skip to main content
        </a>
        <AppRoutes />
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
