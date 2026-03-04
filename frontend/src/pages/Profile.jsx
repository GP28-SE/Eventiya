import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Save, AlertCircle, CheckCircle, Shield, Activity, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ name: '', contact: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', msg: '' }

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/users/profile');
                setProfile({
                    name: res.data.name || '',
                    contact: res.data.contact || ''
                });
            } catch (err) {
                setStatus({ type: 'error', msg: 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (status) setStatus(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            await axios.put('http://localhost:8080/api/users/profile', profile);
            setStatus({ type: 'success', msg: 'Profile updated successfully!' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex-grow flex items-center justify-center min-h-screen pt-20">
            <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
        </div>
    );

    const isOrganizer = user?.role === 'ROLE_ORGANIZER' || user?.role === 'ROLE_ADMIN';

    return (
        <div className="max-w-6xl mx-auto w-full p-4 py-32 min-h-screen relative">
            {/* Background Effects */}
            <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center md:text-left"
            >
                <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-slate-400">Manage your personal information and preferences.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-4 space-y-6"
                >
                    <div className="glass-card p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-accent-500 rounded-full blur-[20px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <div className="relative w-full h-full bg-dark-panel border-2 border-white/10 rounded-full flex items-center justify-center shadow-xl z-10 overflow-hidden">
                                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-400 to-accent-400 tracking-tighter">
                                    {profile.name ? profile.name.charAt(0) : user?.sub?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-1">{profile.name || 'User'}</h2>
                        <p className="text-slate-400 text-sm mb-6">{user?.sub}</p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <Shield className={`w-4 h-4 ${isOrganizer ? 'text-accent-400' : 'text-brand-400'}`} />
                            <span className="text-sm font-medium text-slate-200">
                                {user?.role?.replace('ROLE_', '')}
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-2 text-slate-400">
                                <Activity className="w-4 h-4 text-brand-400" />
                                <span className="text-sm font-medium">Status</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span className="font-semibold text-white">Active</span>
                            </div>
                        </div>
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-2 text-slate-400">
                                <CalendarDays className="w-4 h-4 text-brand-400" />
                                <span className="text-sm font-medium">Member</span>
                            </div>
                            <div className="font-semibold text-white">Since 2026</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Edit Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-8 glass-card p-8"
                >
                    <h3 className="text-xl font-bold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
                        <div className="p-2 bg-brand-500/10 rounded-lg">
                            <User className="w-5 h-5 text-brand-400" />
                        </div>
                        General Information
                    </h3>

                    {status && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`p-4 rounded-xl mb-8 flex items-start gap-3 border backdrop-blur-sm ${status.type === 'success'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}
                        >
                            {status.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            <p className="text-sm">{status.msg}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={user?.sub || ''}
                                        disabled
                                        className="w-full bg-dark-bg/50 border border-white/5 rounded-xl px-4 py-3 pl-11 text-slate-400 cursor-not-allowed"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs text-slate-500">
                                        Non-editable
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300 ml-1">Display Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-brand-400 transition-colors" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        value={profile.name}
                                        onChange={handleChange}
                                        className="input-field pl-11"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300 ml-1">Contact Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-brand-400 transition-colors" />
                                    </div>
                                    <input
                                        name="contact"
                                        type="text"
                                        value={profile.contact}
                                        onChange={handleChange}
                                        className="input-field pl-11"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-white/10 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary w-full sm:w-auto min-w-[160px] flex justify-center items-center gap-2 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                                            Save Changes
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
