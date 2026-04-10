import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Ticket, 
    History, 
    User, 
    LogOut, 
    Calendar,
    ShieldCheck,
    Wallet,
    PlusCircle,
    Users,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SidebarLink = ({ to, icon: Icon, label, isActive }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ x: 5 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'group-hover:text-white'}`} />
            <span className="font-medium text-sm">{label}</span>
            {isActive && (
                <motion.div 
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
            )}
        </motion.div>
    </Link>
);

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    
    const role = user?.role;
    const isActive = (path) => location.pathname === path;

    const navItems = {
        ROLE_ATTENDEE: [
            { to: '/dashboard/attendee', icon: LayoutDashboard, label: 'Overview' },
            { to: '/dashboard/tickets', icon: Ticket, label: 'My Tickets' },
            { to: '/dashboard/history', icon: History, label: 'Booking History' },
            { to: '/profile', icon: User, label: 'Account Settings' },
        ],
        ROLE_ORGANIZER: [
            { to: '/dashboard/organizer', icon: LayoutDashboard, label: 'Event Insights' },
            { to: '/manage-events', icon: PlusCircle, label: 'Manage Events' },
            { to: '/dashboard/attendees', icon: Users, label: 'Attendee List' },
            { to: '/dashboard/payouts', icon: Wallet, label: 'Payouts' },
            { to: '/profile', icon: User, label: 'Profile' },
        ],
        ROLE_ADMIN: [
            { to: '/dashboard/admin', icon: LayoutDashboard, label: 'Platform Stats' },
            { to: '/dashboard/verify-events', icon: ShieldCheck, label: 'Verification' },
            { to: '/dashboard/treasury', icon: TrendingUp, label: 'Platform Treasury' },
            { to: '/dashboard/users', icon: Users, label: 'User Management' },
            { to: '/profile', icon: User, label: 'Admin Settings' },
        ],
    };

    const currentNav = navItems[role] || [];

    return (
        <aside className="w-72 h-screen fixed left-0 top-0 z-40 bg-[#0d121f] border-r border-white/5 flex flex-col pt-8 pb-6 px-4">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 mb-10 group cursor-pointer" onClick={() => window.location.href = '/'}>
                <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Calendar className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Eventiya<span className="text-brand-500">.</span></h1>
            </div>

            {/* Navigation */}
            <nav className="flex-grow space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                <div className="px-4 mb-4">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Main Menu</p>
                </div>
                {currentNav.map((item) => (
                    <SidebarLink 
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        isActive={isActive(item.to)}
                    />
                ))}
            </nav>

            {/* Bottom Profile Section */}
            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="px-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-brand-400 font-bold">
                        {user?.sub?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user?.sub}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{role?.replace('ROLE_', '')}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
