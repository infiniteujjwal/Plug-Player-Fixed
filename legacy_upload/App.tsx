
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Role } from './types';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpPage from './pages/OtpPage';
import AdminPortal from './pages/AdminPortal';
import ClientPortal from './pages/ClientPortal';
import CandidatePortal from './pages/CandidatePortal';
import NotFoundPage from './pages/NotFoundPage';

// A wrapper component to protect routes based on user role
const ProtectedRoute: React.FC<{ roles: Role[]; children: React.ReactNode }> = ({ roles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!roles.includes(user.role)) {
    // If user is logged in but tries to access a page for another role, redirect them to their dashboard
    return <Navigate to="/dashboard" replace />;
  }


  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
            <Route path="/verify-otp" element={<OtpPage />} />
            
            <Route path="/admin/*" element={
                <ProtectedRoute roles={[Role.ADMIN]}>
                    <AdminPortal />
                </ProtectedRoute>
            } />
            <Route path="/client/*" element={
                <ProtectedRoute roles={[Role.CLIENT_ADMIN, Role.CLIENT_MEMBER]}>
                    <ClientPortal />
                </ProtectedRoute>
            } />
            <Route path="/candidate/*" element={
                <ProtectedRoute roles={[Role.CANDIDATE]}>
                    <CandidatePortal />
                </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              user ? (
                user.role === Role.ADMIN ? <Navigate to="/admin" /> :
                (user.role === Role.CLIENT_ADMIN || user.role === Role.CLIENT_MEMBER) ? <Navigate to="/client" /> :
                user.role === Role.CANDIDATE ? <Navigate to="/candidate" /> :
                <Navigate to="/login" />
              ) : <Navigate to="/login" />
            } />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
        <AuthProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AuthProvider>
    </ThemeProvider>
  );
};

export default App;