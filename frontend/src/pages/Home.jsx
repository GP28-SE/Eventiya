import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// ── Custom SVG Icons ───────────────────────────────────────────────────────────
const LightningIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M14.5 2H8.5L5 13H10L7.5 22L19 9H13L14.5 2Z"
            fill="url(#lightning_grad)" strokeLinejoin="round" />
        <defs>
            <linearGradient id="lightning_grad" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2dd4bf" />
                <stop offset="1" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
    </svg>
);

const TargetIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <circle cx="12" cy="12" r="9" stroke="url(#target_grad)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="5" stroke="url(#target_grad)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="1.5" fill="url(#target_grad)" />
        <line x1="12" y1="1" x2="12" y2="4" stroke="url(#target_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="12" y1="20" x2="12" y2="23" stroke="url(#target_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="1" y1="12" x2="4" y2="12" stroke="url(#target_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="20" y1="12" x2="23" y2="12" stroke="url(#target_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <defs>
            <linearGradient id="target_grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
        </defs>
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
            stroke="url(#shield_grad)" strokeWidth="1.8" strokeLinejoin="round" fill="url(#shield_fill)" />
        <path d="M9 12L11 14L15 10" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="shield_grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ade80" />
                <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="shield_fill" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ade80" stopOpacity="0.15" />
                <stop offset="1" stopColor="#22d3ee" stopOpacity="0.05" />
            </linearGradient>
        </defs>
    </svg>
);

const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="url(#cal_grad)" strokeWidth="1.8" />
        <line x1="3" y1="9" x2="21" y2="9" stroke="url(#cal_grad)" strokeWidth="1.8" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="url(#cal_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="url(#cal_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="7" y="13" width="3" height="3" rx="0.5" fill="url(#cal_grad)" />
        <rect x="14" y="13" width="3" height="3" rx="0.5" fill="url(#cal_grad)" />
        <defs>
            <linearGradient id="cal_grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#c084fc" />
                <stop offset="1" stopColor="#818cf8" />
            </linearGradient>
        </defs>
    </svg>
);

const UsersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <circle cx="9" cy="7" r="4" stroke="url(#users_grad)" strokeWidth="1.8" />
        <path d="M2 21C2 17.134 5.134 14 9 14" stroke="url(#users_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17" cy="9" r="3" stroke="url(#users_grad)" strokeWidth="1.8" />
        <path d="M22 21C22 18.239 19.761 16 17 16C15.597 16 14.328 16.573 13.413 17.5" stroke="url(#users_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 21C9 18.239 11.239 16 14 16H16" stroke="url(#users_grad)" strokeWidth="1.8" strokeLinecap="round" />
        <defs>
            <linearGradient id="users_grad" x1="2" y1="4" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f97316" />
                <stop offset="1" stopColor="#fb923c" />
            </linearGradient>
        </defs>
    </svg>
);

const StarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M12 2L14.9 9.3L22.6 9.9L17 14.8L18.8 22.3L12 18.3L5.2 22.3L7 14.8L1.4 9.9L9.1 9.3L12 2Z"
            fill="url(#star_fill)" stroke="url(#star_grad)" strokeWidth="0.8" strokeLinejoin="round" />
        <defs>
            <linearGradient id="star_grad" x1="1.4" y1="2" x2="22.6" y2="22.3" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="star_fill" x1="1.4" y1="2" x2="22.6" y2="22.3" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" stopOpacity="0.9" />
                <stop offset="1" stopColor="#f59e0b" stopOpacity="0.7" />
            </linearGradient>
        </defs>
    </svg>
);

// ── Feature data ───────────────────────────────────────────────────────────────
const features = [
    {
        id: 'lightning',
        Icon: LightningIcon,
        title: 'Lightning Fast Setup',
        description: 'Create and publish events in minutes with our intuitive creation flow designed for modern organizers. No learning curve, just results.',
        iconBg: 'linear-gradient(135deg, rgba(45,212,191,0.25) 0%, rgba(14,165,233,0.15) 100%)',
        iconBorder: 'rgba(45,212,191,0.3)',
        dotColor: '#2dd4bf',
        colSpan: 'lg:col-span-2',
    },
    {
        id: 'target',
        Icon: TargetIcon,
        title: 'Precision Targeting',
        description: 'Reach the exact right audience with advanced analytics and attendee profiling to maximise your event.',
        iconBg: 'linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(99,102,241,0.15) 100%)',
        iconBorder: 'rgba(168,85,247,0.3)',
        dotColor: '#a855f7',
        colSpan: 'lg:col-span-1',
    },
    {
        id: 'shield',
        Icon: ShieldIcon,
        title: 'Bank-Grade Security',
        description: 'User data and payments are secured with industry-leading encryption and robust infrastructure.',
        iconBg: 'linear-gradient(135deg, rgba(74,222,128,0.25) 0%, rgba(34,211,238,0.15) 100%)',
        iconBorder: 'rgba(74,222,128,0.3)',
        dotColor: '#4ade80',
        colSpan: 'lg:col-span-1',
    },
    {
        id: 'calendar',
        Icon: CalendarIcon,
        title: 'Smart Scheduling',
        description: 'Manage multi-day conferences and simple meetups with the same effortless scheduling tools.',
        iconBg: 'linear-gradient(135deg, rgba(192,132,252,0.25) 0%, rgba(129,140,248,0.15) 100%)',
        iconBorder: 'rgba(192,132,252,0.3)',
        dotColor: '#c084fc',
        colSpan: 'lg:col-span-1',
    },
    {
        id: 'users',
        Icon: UsersIcon,
        title: 'Community Building',
        description: 'Foster deep connections with built-in networking tools that keep attendees engaged before and after events.',
        iconBg: 'linear-gradient(135deg, rgba(249,115,22,0.25) 0%, rgba(251,146,60,0.15) 100%)',
        iconBorder: 'rgba(249,115,22,0.3)',
        dotColor: '#f97316',
        colSpan: 'lg:col-span-1',
    },
    {
        id: 'star',
        Icon: StarIcon,
        title: 'Premium Support',
        description: 'Dedicated assistance from real event experts committed to making your vision a reality — 24 / 7.',
        iconBg: 'linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(245,158,11,0.15) 100%)',
        iconBorder: 'rgba(251,191,36,0.3)',
        dotColor: '#fbbf24',
        colSpan: 'lg:col-span-2',
    },
];

// ── Card component ────────────────────────────────────────────────────────────
const FeatureCard = ({ feature, delay }) => {
    const { Icon, title, description, iconBg, iconBorder, dotColor } = feature;
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative group rounded-2xl p-7 flex flex-col gap-5 cursor-default h-full overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
            }}
        >
            {/* Hover border glow */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ border: `1px solid ${dotColor}33` }}
            />

            {/* Icon container */}
            <div
                className="w-14 h-14 flex items-center justify-center rounded-xl shrink-0"
                style={{
                    background: iconBg,
                    border: `1px solid ${iconBorder}`,
                }}
            >
                <Icon />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-white tracking-[-0.01em]">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>

            {/* Corner neon dot */}
            <div
                className="absolute bottom-4 right-4 w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: dotColor,
                    boxShadow: `0 0 8px 2px ${dotColor}88`,
                }}
            />
        </motion.div>
    );
};

const Home = () => {
    return (
        <div className="w-full min-h-screen pt-20 flex flex-col">
            {/* Hero Section */}
            <div className="relative w-full flex flex-col items-center justify-center">
                {/* Background Image & Overlay */}
                <div
                    className="absolute inset-0 z-[-20] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
                    style={{ backgroundImage: "url('/hero-bg.png')" }}
                ></div>
                <div className="absolute inset-0 z-[-15] bg-gradient-to-b from-[#0a0f1c]/90 via-transparent to-[#0a0f1c]"></div>

                <section className="relative px-6 pt-20 pb-32 lg:pt-32 lg:pb-40 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center">
                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-[100px] -z-10 animate-blob"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8">
                            Experience Events <br />
                            <span className="text-brand-400">
                                Like Never Before
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                            Eventiya is the premium platform for organizing, discovering, and experiencing world-class events. Seamlessly connect with audiences globally.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/events" className="w-full sm:w-auto">
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
            </div>

            {/* Features Section */}
            <section className="py-28 relative z-10 overflow-hidden border-t border-white/5">
                {/* Section ambient background */}
                <div className="absolute inset-0 -z-10"
                    style={{ background: 'linear-gradient(180deg, #080c18 0%, #0d1225 50%, #080c18 100%)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[140px] -z-10 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, rgba(20,184,166,0.06) 50%, transparent 70%)' }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
                            Elevated Functionality
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
                            Everything you need to create unforgettable experiences,
                            packaged in a beautifully streamlined interface.
                        </p>
                    </motion.div>

                    {/* Grid — Row 1: large (2-col) + 2 normal; Row 2: 2 normal + large (2-col) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                        {/* Lightning Fast — large */}
                        <div className="lg:col-span-2">
                            <FeatureCard feature={features[0]} delay={0.08} />
                        </div>
                        {/* Precision Targeting */}
                        <div className="lg:col-span-1">
                            <FeatureCard feature={features[1]} delay={0.16} />
                        </div>
                        {/* Bank-Grade Security */}
                        <div className="lg:col-span-1">
                            <FeatureCard feature={features[2]} delay={0.24} />
                        </div>
                        {/* Smart Scheduling */}
                        <div className="lg:col-span-1">
                            <FeatureCard feature={features[3]} delay={0.32} />
                        </div>
                        {/* Community Building */}
                        <div className="lg:col-span-1">
                            <FeatureCard feature={features[4]} delay={0.40} />
                        </div>
                        {/* Premium Support — large */}
                        <div className="lg:col-span-2">
                            <FeatureCard feature={features[5]} delay={0.48} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
