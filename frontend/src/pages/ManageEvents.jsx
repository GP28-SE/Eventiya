import { useState, useEffect } from 'react';
import { 
    Calendar, Plus, ShieldAlert, Activity, Search, Filter, 
    MoreVertical, Edit2, Trash2, X, Check, AlertTriangle, 
    Clock, MapPin, DollarSign 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import eventService from '../api/eventService';

export default function ManageEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        venue: '',
        price: '',
        imageUrl: '',
        status: 'PUBLISHED'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [rbacLoading, setRbacLoading] = useState(false);

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getMyEvents();
            setEvents(data.content || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (event) => {
        setCurrentEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate ? event.eventDate.substring(0, 16) : '',
            venue: event.venue,
            price: event.price,
            imageUrl: event.imageUrl || '',
            status: event.status
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (event) => {
        setCurrentEvent(event);
        setIsDeleteModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await eventService.updateEvent(currentEvent.id, formData);
            setIsEditModalOpen(false);
            fetchMyEvents(); // Refresh after update
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsSubmitting(true);
            await eventService.deleteEvent(currentEvent.id);
            setIsDeleteModalOpen(false);
            setEvents(events.filter(e => e.id !== currentEvent.id)); // Immediate local update
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const testRBACEndpoint = async () => {
        setRbacLoading(true);
        setTestResult(null);
        try {
            const res = await eventService.getMyEvents(); // Re-use my-events for RBAC test
            setTestResult({
                success: true,
                status: 200,
                data: res
            });
        } catch (err) {
            setTestResult({
                success: false,
                status: err.response?.status || 'Error',
                data: err.response?.data || err.message
            });
        } finally {
            setRbacLoading(false);
        }
    };

    const inputClasses = "w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all placeholder-slate-600";
    const labelClasses = "block text-sm font-medium text-slate-400 mb-2";

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto w-full p-4 py-28 min-h-screen relative">
            {/* Background Effects */}
            <div className="absolute top-40 left-20 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
            >
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Manage Events</h1>
                    <p className="text-slate-400">Oversee and organize all your upcoming experiences.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="btn-secondary h-12 px-4 flex items-center justify-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="btn-primary h-12 px-6 flex items-center justify-center gap-2 group shadow-lg shadow-brand-500/20">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Create Event
                    </button>
                </div>
            </motion.div>

            {/* Top Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center"
            >
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0a0f1c]/50 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                        placeholder="Search your events..."
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="whitespace-nowrap px-4 py-2 rounded-lg bg-brand-500/20 text-brand-400 text-sm font-medium border border-brand-500/30">
                        All Events ({loading ? '...' : events.length})
                    </button>
                </div>
            </motion.div>

            {/* RBAC Verification tool */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 mb-10 overflow-hidden relative group border-amber-500/20"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl">
                            <ShieldAlert className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-amber-400 mb-1">RBAC Validation Tool</h3>
                            <p className="text-sm text-slate-400">Verifying authorized access to restricted management endpoints.</p>
                        </div>
                    </div>

                    <button
                        onClick={testRBACEndpoint}
                        disabled={rbacLoading}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                    >
                        {rbacLoading ? <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /> : <Activity className="w-4 h-4" />}
                        Run Auth Test
                    </button>
                </div>
                {testResult && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs">
                        <div className={testResult.success ? 'text-emerald-400' : 'text-rose-400 italic'}>
                            [{testResult.success ? 'PASS' : 'FAIL'}] Status: {testResult.status}
                        </div>
                        <pre className="mt-2 text-slate-500 overflow-x-auto">{JSON.stringify(testResult.data, null, 2)}</pre>
                    </motion.div>
                )}
            </motion.div>

            {/* Event Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="glass-card h-80 animate-pulse bg-slate-800/20"></div>)}
                </div>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredEvents.map((event, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                key={event.id}
                                className="glass-card group flex flex-col overflow-hidden relative border-white/5 hover:border-brand-500/20"
                            >
                                <div className="relative h-44 bg-[#0a0f1c] overflow-hidden">
                                    <img src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800'} alt="" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border backdrop-blur-md
                                            ${event.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <button onClick={() => handleEditClick(event)} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 leading-tight group-hover:text-brand-400 transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                                            <Calendar className="w-4 h-4 text-brand-500/70" />
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                                            <MapPin className="w-4 h-4 text-brand-500/70" />
                                            <span className="line-clamp-1">{event.venue}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-white/5 mt-auto">
                                        <button 
                                            onClick={() => handleEditClick(event)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all active:scale-95"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Manage
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(event)}
                                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all active:scale-95"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                    <p className="text-slate-400">Try adjusting your search or create a new event.</p>
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#111827] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Edit Event</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleUpdate} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Event Title</label>
                                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={inputClasses} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Description</label>
                                        <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={inputClasses} required />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Date & Time</label>
                                        <div className="relative">
                                            <input type="datetime-local" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} className={inputClasses} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Price (USD)</label>
                                        <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className={inputClasses} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>Venue Location</label>
                                        <input type="text" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} className={inputClasses} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClasses}>High-Res Image URL</label>
                                        <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className={inputClasses} placeholder="https://unsplash..." />
                                    </div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-2xl flex justify-end gap-3 mt-8">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all">Cancel</button>
                                    <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[140px] flex items-center justify-center">
                                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#111827] border border-rose-500/20 rounded-3xl w-full max-w-md p-8 overflow-hidden shadow-2xl text-center">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="w-8 h-8 text-rose-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Delete Event?</h2>
                            <p className="text-slate-400 mb-8">Are you sure you want to delete <span className="text-white font-semibold">"{currentEvent?.title}"</span>? This action cannot be undone.</p>
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleDeleteConfirm} 
                                    disabled={isSubmitting}
                                    className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center"
                                >
                                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete Event'}
                                </button>
                                <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold h-12 rounded-xl border border-white/10 transition-all">Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
