import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../api/eventService';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                // Simulate a slight delay for smoother animation if needed, 
                // but aim for < 2s total as per requirements.
                const data = await eventService.getEventById(id);
                setEvent(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch event:', err);
                if (err.response && err.response.status === 404) {
                    setError('Event not found');
                } else {
                    setError('Failed to load event details. Please try again later.');
                }
            } finally {
                // Minimum loading time for perception of "premium" processing
                setTimeout(() => setLoading(false), 600);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="h-8 w-32 bg-slate-800 animate-pulse rounded-lg mb-8"></div>
                <div className="h-[400px] md:h-[500px] w-full bg-slate-800 animate-pulse rounded-3xl mb-12"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="h-64 bg-slate-800 animate-pulse rounded-2xl"></div>
                        <div className="h-48 bg-slate-800 animate-pulse rounded-2xl"></div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="h-96 bg-slate-800 animate-pulse rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <FaInfoCircle className="text-red-500 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{error}</h2>
                <button 
                    onClick={() => navigate('/events')}
                    className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-transparent relative overflow-hidden"
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full z-0"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full z-0"></div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Back Button */}
                <motion.button 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => navigate('/events')}
                    className="flex items-center text-slate-400 hover:text-white mb-8 group transition-colors"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Events
                </motion.button>

                {/* Hero Section */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl group"
                >
                    <img 
                        src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-brand-500/20 backdrop-blur-md border border-brand-500/30 text-brand-400 rounded-full text-sm font-semibold tracking-wide uppercase">
                                {event.status || 'Upcoming'}
                            </span>
                            <span className="px-4 py-1.5 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 text-slate-300 rounded-full text-sm font-semibold">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(event.price || 0)}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                            {event.title}
                        </h1>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Description */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="glass-card p-8 md:p-10">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <FaInfoCircle className="mr-3 text-brand-500" />
                                About this Event
                            </h2>
                            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg">
                                {event.description || 'No description provided.'}
                            </div>
                        </div>

                        {/* Venue Section */}
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <FaMapMarkerAlt className="mr-3 text-brand-500" />
                                Venue Details
                            </h2>
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-full h-48 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors"></div>
                                    <FaMapMarkerAlt className="text-4xl text-slate-600 animate-bounce" />
                                    <p className="absolute bottom-4 text-sm text-slate-500 font-medium">Interactive map coming soon</p>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-xl font-semibold text-white">{event.venue || 'TBA'}</p>
                                    <p className="text-slate-400">Detailed location information will be provided after booking.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Event Info Card */}
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-8 space-y-6">
                            <div className="glass-card p-8 border-brand-500/20">
                                <h3 className="text-xl font-bold text-white mb-8 pb-4 border-b border-white/5">Event Summary</h3>
                                
                                <div className="space-y-6 mb-10">
                                    <div className="flex items-start group">
                                        <div className="p-3 bg-brand-500/10 rounded-xl mr-4 group-hover:bg-brand-500/20 transition-colors">
                                            <FaCalendarAlt className="text-brand-500 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Date & Time</p>
                                            <p className="text-lg text-slate-200">
                                                {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : 'Date TBA'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="p-3 bg-brand-500/10 rounded-xl mr-4 group-hover:bg-brand-500/20 transition-colors">
                                            <FaMapMarkerAlt className="text-brand-400 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                                            <p className="text-lg text-slate-200">{event.venue || 'Venue TBA'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="p-3 bg-brand-500/10 rounded-xl mr-4 group-hover:bg-brand-500/20 transition-colors">
                                            <FaEnvelope className="text-brand-500 text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Organizer Contact</p>
                                            <p className="text-lg text-slate-200">support@eventiya.com</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-primary flex items-center justify-center group shadow-lg shadow-brand-500/20 relative overflow-hidden">
                                    <span className="absolute inset-0 bg-white/10 translate-y-12 group-hover:translate-y-0 transition-transform duration-300"></span>
                                    <FaTicketAlt className="mr-3 group-hover:rotate-12 transition-transform relative z-10" />
                                    <span className="relative z-10">Book Ticket Now</span>
                                </button>
                                <p className="text-center text-slate-500 text-sm mt-4">
                                    Secured by Eventiya Payments
                                </p>
                            </div>

                            {/* Organizer Spotlight */}
                            <div className="glass p-6 rounded-2xl border border-white/5">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-full mr-4 overflow-hidden border border-white/10">
                                        <img src="https://ui-avatars.com/api/?name=Event+Organizer&background=14b8a6&color=fff" alt="Organizer" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">Event Organizer</p>
                                        <p className="text-slate-400 text-xs uppercase tracking-tighter">Verified Host</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    Hosted by our premium partners. Click to view more events from this organizer.
                                </p>
                                <button className="w-full text-brand-400 text-sm font-semibold hover:text-brand-300 transition-colors flex items-center justify-center">
                                    View Profile <span className="ml-1">→</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventDetail;
