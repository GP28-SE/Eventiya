import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ManageEvents from './pages/ManageEvents';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireOrganizer = false }) => {
    const { isAuthenticated, isOrganizerOrAdmin } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireOrganizer && !isOrganizerOrAdmin) {
        return <Navigate to="/profile" replace />; // Fallback if regular user tries to access
    }

    return children;
};

// Public-only Route Wrapper (redirects authenticated users away)
const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-dark-bg">
            <Navbar />
            <main className="flex-grow flex flex-col z-10">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                    <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
                    <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/manage-events" element={
                        <ProtectedRoute requireOrganizer={true}>
                            <ManageEvents />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
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
