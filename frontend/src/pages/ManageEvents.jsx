import { useState } from 'react';
import axios from 'axios';
import { Calendar, Plus, ShieldAlert, Activity, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ManageEvents() {
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // This is a test harness to verify RBAC constraints
    const testRBACEndpoint = async () => {
        setLoading(true);
        setTestResult(null);
        try {
            const res = await axios.post('http://localhost:8080/api/events', {
                title: "Sample Event",
                description: "Testing Authorization"
            });
            setTestResult({
                success: true,
                status: res.status,
                data: res.data
            });
        } catch (err) {
            setTestResult({
                success: false,
                status: err.response?.status || 'Network Error',
                data: err.response?.data || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto w-full p-4 py-28 min-h-screen relative">
            {/* Background Effects */}
            <div className="absolute top-40 left-20 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
            >
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Manage Events</h1>
                    <p className="text-slate-400">Oversee and organize all your upcoming experiences.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="btn-secondary flex-1 md:flex-none h-12 px-4 flex items-center justify-center gap-2 text-slate-300">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="btn-primary flex-1 md:flex-none h-12 px-6 flex items-center justify-center gap-2 group">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Create Event
                    </button>
                </div>
            </motion.div>

            {/* Top Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center"
            >
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-[#0a0f1c]/50 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                        placeholder="Search events by name or location..."
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    <button className="whitespace-nowrap px-4 py-2 rounded-lg bg-brand-500/20 text-brand-400 text-sm font-medium border border-brand-500/30">All Events (3)</button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-lg hover:bg-white/5 text-slate-400 text-sm font-medium transition-colors">Drafts (1)</button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-lg hover:bg-white/5 text-slate-400 text-sm font-medium transition-colors">Past (12)</button>
                </div>
            </motion.div>


            {/* RBAC Verification tool explicitly requested in user story 3 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-6 mb-10 overflow-hidden relative group border-amber-500/20"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2 text-amber-400 mb-2">
                            <ShieldAlert className="w-5 h-5" /> RBAC Validation Tool
                        </h3>
                        <p className="text-sm text-slate-400">
                            Test the <code className="bg-[#0a0f1c] px-2 py-1 rounded-md border border-white/10 text-brand-300">POST /api/events</code> endpoint. Only ORGANIZER roles should receive a 201 Created.
                        </p>
                    </div>

                    <button
                        onClick={testRBACEndpoint}
                        disabled={loading}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-[200px]"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                        ) : (
                            <>
                                <Activity className="w-4 h-4" />
                                Run Authorization Test
                            </>
                        )}
                    </button>
                </div>

                {testResult && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-6 p-4 rounded-xl bg-[#0a0f1c]/80 border font-mono text-sm overflow-x-auto
                        ${testResult.success ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}
                    >
                        <div className="font-bold mb-3 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${testResult.success ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'}`}></div>
                            Status: {testResult.status} {testResult.success ? 'SUCCESS' : 'FORBIDDEN'}
                        </div>
                        <pre className="text-slate-300 text-xs leading-relaxed">
                            {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                    </motion.div>
                )}
            </motion.div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Tech Innovators Summit 2026", date: "Oct 15, 2026", status: "Published", attendees: 1250 },
                    { title: "Design Systems Workshop", date: "Nov 02, 2026", status: "Draft", attendees: 0 },
                    { title: "Future of AI Conference", date: "Dec 10, 2026", status: "Published", attendees: 3400 }
                ].map((event, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                        key={i}
                        className="glass-card group flex flex-col overflow-hidden"
                    >
                        <div className="relative h-48 bg-[#0a0f1c] p-6 flex flex-col justify-between border-b border-white/5 overflow-hidden">
                            {/* Abstract gradient backgrounds for event cards */}
                            <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500
                                ${i === 0 ? 'bg-gradient-to-br from-brand-500/40 to-transparent' :
                                    i === 1 ? 'bg-gradient-to-br from-purple-500/40 to-transparent' :
                                        'bg-gradient-to-br from-accent-500/40 to-transparent'}`}>
                            </div>

                            <div className="relative z-10 flex justify-between items-start">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border
                                    ${event.status === 'Published'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                    {event.status}
                                </span>
                                <button className="p-2 bg-[#0a0f1c]/50 hover:bg-white/10 rounded-lg text-slate-400 transition-colors backdrop-blur-md">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="relative z-10 text-xl font-bold text-white line-clamp-2 leading-tight">
                                {event.title}
                            </h3>
                        </div>

                        <div className="p-5 flex-grow flex flex-col justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <Calendar className="w-4 h-4 text-brand-400" />
                                    {event.date}
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <Activity className="w-4 h-4 text-accent-400" />
                                    {event.attendees.toLocaleString()} Registered
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-white/5">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors">
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button className="p-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
