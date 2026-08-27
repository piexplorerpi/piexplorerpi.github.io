import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useI18n } from './i18n/I18nContext';

import Home from './pages/Home';
import Dig from './pages/Dig';
import TasksPage from './pages/Engagement/TasksPage';
import SignIn from './components/SignIn';
import PiPaymentPanel from './components/PiPaymentPanel';
import History from './components/History';
import Success from './components/Success';
import LanguageSwitcher from './components/LanguageSwitcher';

// Pi Explorer: Apps pages (NEW)
import AppsPage from './pages/Apps/AppsPage';
import AppDetailsPage from './pages/Apps/AppDetailsPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();
  const { t } = useI18n();

  if (!auth || auth.loading === undefined) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#fff',
          background: '#311b92',
          fontFamily: 'sans-serif',
        }}
      >
        <p>{t('connectingToServer')}</p>
      </div>
    );
  }

  const { isAuthenticated, loading } = auth;

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#fff',
          background: '#311b92',
          fontFamily: 'sans-serif',
        }}
      >
        {t('loading')}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

const HistoryAny = History as any;

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* You said Dig is separate; we can remove later */}
        <Route path="/dig" element={<Dig />} />

        <Route
          path="/login"
          element={
            <>
              <LanguageSwitcher />
              <SignIn />
            </>
          }
        />

        <Route
          path="/success"
          element={
            <>
              <LanguageSwitcher />
              <Success />
            </>
          }
        />

        {/* Payment - protected */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PiPaymentPanel />
            </ProtectedRoute>
          }
        />

        {/* History - protected */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryAny onPaymentSuccess={() => {}} onPaymentError={() => {}} />
            </ProtectedRoute>
          }
        />

        {/* Pi Explorer: Apps Directory + Details (protected) */}
        <Route
          path="/apps"
          element={
            <ProtectedRoute>
              <AppsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apps/:id"
          element={
            <ProtectedRoute>
              <AppDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Backward compatibility */}
        <Route path="/shop" element={<Navigate to="/apps" replace />} />

        {/* Tasks - protected */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
