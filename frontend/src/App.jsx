import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ManageEvents from './pages/ManageEvents';
import EventDetail from './pages/EventDetail';
import { AttendeeDashboard, OrganizerDashboard, AdminDashboard } from './pages/Dashboards';
import QRScanner from './pages/QRScanner';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Public-only Route Wrapper (redirects authenticated users away)
const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return null;

    if (isAuthenticated) {
        // Redirect based on role if logged in
        if (user?.role === 'ROLE_ADMIN') return <Navigate to="/dashboard/admin" replace />;
        if (user?.role === 'ROLE_ORGANIZER') return <Navigate to="/dashboard/organizer" replace />;
        return <Navigate to="/dashboard/attendee" replace />;
    }

    return children;
};

/**
 * Public Layout Wrapper (With Top Navbar)
 */
const PublicLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0f1c]">
        <Navbar />
        <main className="flex-grow flex flex-col z-10 pt-28">
            {children}
        </main>
    </div>
);

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
            <Route path="/events/:id" element={<PublicLayout><EventDetail /></PublicLayout>} />
            <Route path="/login" element={<PublicOnlyRoute><PublicLayout><Login /></PublicLayout></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><PublicLayout><Register /></PublicLayout></PublicOnlyRoute>} />
            <Route path="/forgot-password" element={<PublicOnlyRoute><PublicLayout><ForgotPassword /></PublicLayout></PublicOnlyRoute>} />

            {/* Authenticated Dashboard Routes */}
            <Route path="/dashboard/attendee" element={
                <ProtectedRoute allowedRoles={['ROLE_ATTENDEE', 'ROLE_ORGANIZER', 'ROLE_ADMIN']}>
                    <DashboardLayout><AttendeeDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />

            <Route path="/dashboard/tickets" element={
                <ProtectedRoute allowedRoles={['ROLE_ATTENDEE', 'ROLE_ORGANIZER', 'ROLE_ADMIN']}>
                    <DashboardLayout><AttendeeDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />
            
            <Route path="/dashboard/organizer" element={
                <ProtectedRoute allowedRoles={['ROLE_ORGANIZER', 'ROLE_ADMIN']}>
                    <DashboardLayout><OrganizerDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />

            <Route path="/dashboard/admin" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <DashboardLayout><AdminDashboard /></DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Existing Profile & Management - Wrapped in DashboardLayout for UI consistency */}
            <Route path="/profile" element={
                <ProtectedRoute>
                    <DashboardLayout><Profile /></DashboardLayout>
                </ProtectedRoute>
            } />

            <Route path="/manage-events" element={
                <ProtectedRoute allowedRoles={['ROLE_ORGANIZER', 'ROLE_ADMIN']}>
                    <DashboardLayout><ManageEvents /></DashboardLayout>
                </ProtectedRoute>
            } />

            <Route path="/scanner" element={
                <ProtectedRoute allowedRoles={['ROLE_ORGANIZER', 'ROLE_ADMIN']}>
                    <DashboardLayout><QRScanner /></DashboardLayout>
                </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
