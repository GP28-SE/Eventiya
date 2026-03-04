import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });

            login(response.data.token);
            navigate('/profile');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid credentials. Please try again.');
            } else {
                setError('An error occurred during login.');
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>

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
                            Welcome back to<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                                Eventiya
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-slate-400 text-lg max-w-md"
                        >
                            Sign in to manage your events, connect with audiences, and experience the extraordinary.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent-500/5 rounded-full blur-[150px] -z-10 lg:hidden"></div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center lg:text-left mb-10">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="p-3 bg-brand-500/10 rounded-2xl border border-brand-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                                <LogIn className="w-8 h-8 text-brand-400" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Sign in</h2>
                        <p className="text-slate-400">Enter your details to access your account.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-sm"
                        >
                            <span className="block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                            <div className="flex justify-end pt-1">
                                <a href="#" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</a>
                            </div>
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
                                ) : 'Sign In'}
                            </span>
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                            Create completely free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
