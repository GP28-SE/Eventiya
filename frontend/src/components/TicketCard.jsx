import React from 'react';
import { Calendar, MapPin, Ticket, CreditCard, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusBadge = ({ status }) => {
    const config = {
        PENDING: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock, label: 'Payment Pending' },
        PENDING_VERIFICATION: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Clock, label: 'Verifying Payment' },
        PAID: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2, label: 'Confirmed' },
        CANCELLED: { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: AlertCircle, label: 'Cancelled' },
        USED: { color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: Ticket, label: 'Attended' }
    };

    const { color, icon: Icon, label } = config[status] || config.PENDING;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
            <Icon size={12} />
            {label}
        </span>
    );
};

const TicketCard = ({ booking, onUploadReceipt }) => {
    const { 
        eventTitle, 
        eventDate: rawEventDate, 
        eventVenue, 
        ticketCount, 
        status, 
        referenceCode, 
        totalPrice 
    } = booking;
    
    const eventDate = new Date(rawEventDate);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden border-brand-500/10 group hover:border-brand-500/30 transition-all duration-300"
        >
            <div className="flex flex-col h-full">
                {/* Upper Section */}
                <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <StatusBadge status={status} />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-800/50 px-2 py-1 rounded">
                            #{referenceCode}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                        {eventTitle}
                    </h3>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-slate-400 text-sm gap-2">
                            <Calendar size={14} className="text-brand-500" />
                            {eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center text-slate-400 text-sm gap-2">
                            <MapPin size={14} className="text-brand-500" />
                            <span className="truncate">{eventVenue}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-brand-500/10">
                                <Ticket size={16} className="text-brand-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Tickets</p>
                                <p className="text-white font-semibold">{ticketCount}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Total Paid</p>
                            <p className="text-brand-400 font-bold">${totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="p-4 bg-slate-900/40 border-t border-slate-800 flex gap-2">
                    {status === 'PAID' ? (
                        <button className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2 group/btn">
                            View QR Code
                            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    ) : status === 'PENDING' ? (
                        <button 
                            onClick={() => onUploadReceipt(booking)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-brand-400 bg-brand-400/10 hover:bg-brand-400/20 rounded-xl border border-brand-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <CreditCard size={16} />
                            Upload Payment Proof
                        </button>
                    ) : (
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-400 bg-slate-800/50 rounded-xl cursor-default">
                           Details Viewed
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TicketCard;
