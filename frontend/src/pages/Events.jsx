import React from 'react';
import { motion } from 'framer-motion';
import EventList from '../components/EventList';

const Events = () => {
    return (
        <div className="w-full min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col mb-12 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-brand-400 font-bold uppercase tracking-[0.2em] text-xs mb-3 block">
                            Discovery
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Explore <span className="text-brand-400">Events</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
                            Discover world-class experiences, conferences, and meetups from organizers around the globe.
                        </p>
                    </motion.div>
                    
                    {/* Decorative blurred blob */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px] -z-10"></div>
                </div>

                {/* Event List Component */}
                <EventList />
            </div>
        </div>
    );
};

export default Events;
