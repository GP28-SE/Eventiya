import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import eventService from '../api/eventService';
import EventCard from './EventCard';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const size = 9; // 3x3 grid

    useEffect(() => {
        fetchEvents();
    }, [page]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await eventService.getUpcomingEvents(page, size);
            setEvents(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setError(null);
        } catch (err) {
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && page === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                <p className="text-slate-400 animate-pulse">Loading amazing events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 px-4">
                <div className="glass-card p-10 max-w-lg mx-auto">
                    <p className="text-rose-400 mb-6">{error}</p>
                    <button 
                        onClick={fetchEvents}
                        className="btn-primary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <SearchX className="text-slate-500 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No upcoming events</h3>
                <p className="text-slate-400 max-w-sm">
                    We couldn't find any upcoming public events at the moment. Check back later!
                </p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <AnimatePresence mode="popLayout">
                    {events.map((event, index) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-8">
                    <button
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className="p-3 rounded-xl glass border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                                    page === i 
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={page === totalPages - 1}
                        className="p-3 rounded-xl glass border border-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventList;
