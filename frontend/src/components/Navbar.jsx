import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, LogIn, UserPlus, Settings, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { isAuthenticated, isOrganizerOrAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const isHome = location.pathname === '/';

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl transition-colors duration-300 ${isHome
                    ? 'bg-transparent border-b border-transparent'
                    : 'glass border-b border-white/5 bg-[#0a0f1c]/70'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-28">
                    {/* Logo Section */}
                    <Link to="/" className="flex-shrink-0 flex items-center group">
                        <img
                            src="/logo.png"
                            alt="Eventiya Logo"
                            className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link
                            to="/events"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/events') ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Calendar className="w-4 h-4" /> Browse Events
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/profile') ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <User className="w-4 h-4" /> Profile
                                </Link>
                                {isOrganizerOrAdmin && (
                                    <Link
                                        to="/manage-events"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/manage-events') ? 'bg-white/10 text-white shadow-inner border border-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                    </Link>
                                )}
                                <div className="w-px h-6 bg-white/10 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-400 hover:text-rose-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 hover:bg-rose-500/10"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5 flex items-center gap-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-brand-500 text-white hover:bg-brand-400 px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
