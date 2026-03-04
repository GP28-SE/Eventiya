import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ATTENDEE'
    });

    const [errorMsg, setErrorMsg] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear specific field error when typed
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setFieldErrors({});
        setLoading(true);

        try {
            await axios.post('http://localhost:8080/api/auth/register', formData);
            // Ensure smooth user experience - redirect to login on success
            navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        } catch (err) {
            if (err.response) {
                if (err.response.status === 409) {
                    setErrorMsg('An account with this email already exists.');
                } else if (err.response.status === 400 && err.response.data.details) {
                    setFieldErrors(err.response.data.details);
                    setErrorMsg('Please fix the errors below.');
                } else {
                    setErrorMsg(err.response.data.message || 'Registration failed.');
                }
            } else {
                setErrorMsg('Network error. Is the server running?');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex min-h-screen">
            {/* Left Decorative Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-900 border-r border-white/5">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0f1c] to-transparent z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/20 rounded-full blur-[150px] -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-20 flex flex-col justify-between p-16 h-full w-full">
                    <Link to="/" className="text-white flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>

                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl font-bold text-white mb-6 leading-tight"
                        >
                            Start your journey with<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-brand-400">
                                Eventiya
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-slate-400 text-lg max-w-md"
                        >
                            Join thousands of organizers and attendees creating unforgettable moments every day.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-500/5 rounded-full blur-[150px] -z-10 lg:hidden"></div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md my-auto pb-10 pt-20 lg:py-0"
                >
                    <div className="text-center lg:text-left mb-10">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="p-3 bg-brand-500/10 rounded-2xl border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                                <UserPlus className="w-8 h-8 text-brand-400" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Create an Account</h2>
                        <p className="text-slate-400">Fill in the details below to get started for free.</p>
                    </div>

                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-sm"
                        >
                            <span className="block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            {errorMsg}
                        </motion.div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={`input-field ${fieldErrors.name ? 'border-rose-500/50 focus:ring-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : ''}`}
                                placeholder="John Doe"
                            />
                            {fieldErrors.name && <p className="text-rose-400 text-xs mt-1.5 ml-1">{fieldErrors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field ${fieldErrors.email ? 'border-rose-500/50 focus:ring-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : ''}`}
                                placeholder="name@example.com"
                            />
                            {fieldErrors.email && <p className="text-rose-400 text-xs mt-1.5 ml-1">{fieldErrors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300 ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`input-field ${fieldErrors.password ? 'border-rose-500/50 focus:ring-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : ''}`}
                                placeholder="••••••••"
                            />
                            {fieldErrors.password ? (
                                <p className="text-rose-400 text-xs mt-1.5 ml-1 leading-snug">{fieldErrors.password}</p>
                            ) : (
                                <p className="text-slate-500 text-xs mt-1.5 ml-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300 ml-1">I want to...</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`input-field appearance-none cursor-pointer ${fieldErrors.role ? 'border-rose-500/50 focus:ring-rose-500 pl-4' : 'pl-4'}`}
                                >
                                    <option value="ATTENDEE" className="bg-dark-panel text-white">Attend Events (Attendee)</option>
                                    <option value="ORGANIZER" className="bg-dark-panel text-white">Host Events (Organizer)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {fieldErrors.role && <p className="text-rose-400 text-xs mt-1.5 ml-1">{fieldErrors.role}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary mt-8 h-12 flex justify-center items-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : 'Create Account'}
                            </span>
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
