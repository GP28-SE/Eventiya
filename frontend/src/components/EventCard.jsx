import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag } from 'lucide-react';

const EventCard = ({ event }) => {
    const { title, description, eventDate, venue, price, imageUrl } = event;
    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
    const formattedTime = new Date(eventDate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-card overflow-hidden group flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={imageUrl || '/event-placeholder.jpg'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-brand-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {price === 0 ? 'FREE' : `$${price}`}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Calendar size={14} />
                    <span>{formattedDate} • {formattedTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-400 transition-colors">
                    {title}
                </h3>
                
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {description}
                </p>

                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <MapPin size={14} className="text-brand-500" />
                        <span className="line-clamp-1">{venue}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
