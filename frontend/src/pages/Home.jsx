import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Users, Star, ArrowRight, Zap, Target, Shield } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="glass-card p-6 rounded-2xl flex flex-col items-start gap-4 hover:shadow-brand-500/10"
    >
        <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">
            {description}
        </p>
    </motion.div>
);

const Home = () => {
    return (
        <div className="w-full min-h-screen pt-20 flex flex-col">
            {/* Hero Section */}
            <section className="relative px-6 pt-20 pb-32 lg:pt-32 lg:pb-40 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center">
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-[100px] -z-10 animate-blob"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-brand-400/10 border border-brand-400/20 text-brand-300 text-sm font-medium mb-6">
                        The New Standard in Event Management
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8">
                        Experience Events <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-500 text-glow">
                            Like Never Before
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Eventiya is the premium platform for organizing, discovering, and experiencing world-class events. Seamlessly connect with audiences globally.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto">
                            <button className="btn-primary flex items-center justify-center gap-2 group px-8 py-4 text-base">
                                Start Exploring
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="btn-secondary px-8 py-4 text-base">
                                Organizer Login
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative z-10 bg-dark-panel/50 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Elevated Functionality</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to create unforgettable experiences, packaged in a beautifully streamlined interface.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Zap}
                            title="Lightning Fast Setup"
                            description="Create and publish events in minutes with our intuitive, streamlined creation flow designed for modern organizers."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Target}
                            title="Precision Targeting"
                            description="Reach the exact right audience with advanced analytics and attendee profiling to maximize your event's success."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Bank-Grade Security"
                            description="Rest easy knowing user data and payments are secured with industry-leading encryption and robust infrastructure."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Smart Scheduling"
                            description="Manage multi-day conferences and simple meetups with the same effortless scheduling tools."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Users}
                            title="Community Building"
                            description="Foster deep connections with built-in networking tools designed to keep attendees engaged before and after."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={Star}
                            title="Premium Support"
                            description="Get dedicated assistance from our event experts who are committed to making your vision a reality."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
