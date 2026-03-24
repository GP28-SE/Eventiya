import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // TODO: wire up to backend endpoint when available
            // await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
            await new Promise((res) => setTimeout(res, 800)); // simulate network
            setSubmitted(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex min-h-screen">
            {/* Left Decorative Panel — same as Login */}
            <div
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/5"
                style={{
                    backgroundImage: `url('/login-bg.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-[#0a0f1c]/60 z-0" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0f1c] to-transparent z-10" />

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
                            Reset your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
                                password
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-slate-400 text-lg max-w-md"
                        >
                            Enter your email and we'll send you a link to get back into your account.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Mobile back link */}
                                <Link to="/login" className="lg:hidden inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
                                    <ArrowLeft size={15} /> Back to Sign In
                                </Link>

                                <div className="mb-10">
                                    <h2 className="text-3xl font-bold text-white mb-3">Forgot password?</h2>
                                    <p className="text-slate-400">No worries — we'll send you reset instructions.</p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-4 rounded-xl mb-6 flex items-center gap-3"
                                    >
                                        <span className="block w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-300 ml-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-field"
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary mt-4 h-12 flex justify-center items-center group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Mail size={16} />
                                                    Send Reset Link
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <p className="mt-8 text-center text-slate-400 text-sm">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                                        Back to Sign In
                                    </Link>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-brand-400" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-3">Check your email</h2>
                                <p className="text-slate-400 mb-2">
                                    We've sent a password reset link to
                                </p>
                                <p className="font-medium text-white mb-8">{email}</p>
                                <p className="text-slate-500 text-sm mb-8">
                                    Didn't receive the email? Check your spam folder, or{' '}
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-brand-400 hover:text-brand-300 transition-colors"
                                    >
                                        try a different email address
                                    </button>
                                    .
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    <ArrowLeft size={15} /> Back to Sign In
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
