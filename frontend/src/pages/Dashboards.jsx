import React, { useState, useEffect } from 'react';
import { LayoutGrid, Ticket, Search, AlertCircle, Loader2, Check, X, ImageIcon, DollarSign, Wallet, TrendingUp, Settings } from 'lucide-react';
import bookingService from '../api/bookingService';
import adminService from '../api/adminService';
import TicketCard from '../components/TicketCard';
import UploadProofModal from '../components/UploadProofModal';

const DashboardOverview = ({ title, description, children }) => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                <p className="text-slate-400">{description}</p>
            </div>
            {/* Quick Actions / Stats could go here */}
        </div>
        {children}
    </div>
);

export const AttendeeDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch (err) {
            setError("Failed to load your tickets. Please check your connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadReceipt = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleUploadSuccess = () => {
        fetchBookings(); // Refresh the list to show updated status
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
                <Loader2 size={40} className="animate-spin text-brand-500" />
                <p className="animate-pulse">Loading your ticket wallet...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="p-4 rounded-full bg-rose-500/10 mb-4">
                    <AlertCircle size={32} className="text-rose-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
                <p className="text-slate-400 mb-6 max-w-md">{error}</p>
                <button onClick={fetchBookings} className="btn-primary px-6">Retry Connection</button>
            </div>
        );
    }

    return (
        <DashboardOverview 
            title="My Ticket Wallet 🎟️" 
            description="Access your bookings, track payment status, and prepare for your next event."
        >
            {bookings.length === 0 ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-800">
                    <div className="p-4 rounded-full bg-slate-800/50 mb-4 text-slate-500">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
                    <p className="text-slate-400 mb-6 max-w-xs">You haven't booked any events yet. Start exploring the latest events in your city!</p>
                    <a href="/events" className="btn-primary px-8">Browse Events</a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookings.map(booking => (
                        <TicketCard 
                            key={booking.id} 
                            booking={booking} 
                            onUploadReceipt={handleUploadReceipt} 
                        />
                    ))}
                </div>
            )}

            <UploadProofModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bookingId={selectedBooking?.id}
                onSuccess={handleUploadSuccess}
            />
        </DashboardOverview>
    );
};

export const OrganizerDashboard = () => <DashboardOverview title="Organizer Insights" description="Track your event performance and manage attendee check-ins." />;
export const AdminDashboard = () => {
    const [pendingEvents, setPendingEvents] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    
    // Treasury Phase 2 variables
    const [financialStats, setFinancialStats] = useState({ totalSales: 0, netProfit: 0, organizerBalance: 0 });
    const [commissionRate, setCommissionRate] = useState('10.0');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eventsRes, paymentsRes, statsRes, commRes] = await Promise.all([
                adminService.getPendingEvents(),
                adminService.getPendingPayments(),
                adminService.getFinancialStats(),
                adminService.getCommissionRate()
            ]);
            setPendingEvents(eventsRes);
            setPendingPayments(paymentsRes);
            setFinancialStats(statsRes || { totalSales: 0, netProfit: 0, organizerBalance: 0 });
            setCommissionRate(commRes);
        } catch (err) {
            console.error(err);
            setError("Failed to load admin data.");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveEvent = async (id, action) => {
        try {
            await adminService.approveEvent(id, action);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleVerifyPayment = async (id, action) => {
        try {
            await adminService.verifyPayment(id, action);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleUpdateCommission = async (e) => {
        e.preventDefault();
        try {
            await adminService.updateCommissionRate(commissionRate);
            setIsSettingsModalOpen(false);
            fetchData();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading Dashboard...</div>;

    return (
        <DashboardOverview title="Verification Desk" description="Platform oversight and event verification.">
            {/* Top Toolbar: Settings */}
            <div className="flex justify-end mb-6">
                <button 
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-500/10 text-brand-400 rounded-xl hover:bg-brand-500/20 transition-all font-medium border border-brand-500/30"
                >
                    <Settings size={18} /> Platform Settings
                </button>
            </div>

            {/* Financial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 border-l-4 border-emerald-500 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] p-8 bg-emerald-500/5 rounded-full group-hover:scale-110 transition-transform"><DollarSign size={64} className="text-emerald-500/20" /></div>
                    <h3 className="text-slate-400 font-medium mb-1 relative z-10">Total Platform Sales</h3>
                    <div className="text-3xl font-bold text-white relative z-10">${Number(financialStats.totalSales).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-brand-500 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] p-8 bg-brand-500/5 rounded-full group-hover:scale-110 transition-transform"><TrendingUp size={64} className="text-brand-500/20" /></div>
                    <h3 className="text-slate-400 font-medium mb-1 relative z-10">Net Admin Profit (Treasury)</h3>
                    <div className="text-3xl font-bold text-white relative z-10">${Number(financialStats.netProfit).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-amber-500 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] p-8 bg-amber-500/5 rounded-full group-hover:scale-110 transition-transform"><Wallet size={64} className="text-amber-500/20" /></div>
                    <h3 className="text-slate-400 font-medium mb-1 relative z-10">Organizer Balance</h3>
                    <div className="text-3xl font-bold text-white relative z-10">${Number(financialStats.organizerBalance).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Pending Events Section */}
                <div className="glass-card p-6 border-amber-500/10">
                    <h3 className="text-xl font-bold text-white mb-4">Pending Events</h3>
                    {pendingEvents.length === 0 ? (
                        <p className="text-slate-400">No events pending approval.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700 text-slate-400 text-sm">
                                        <th className="p-3">Title</th>
                                        <th className="p-3">Venue</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingEvents.map(event => (
                                        <tr key={event.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                                            <td className="p-3 text-white font-medium">{event.title}</td>
                                            <td className="p-3 text-slate-400">{event.venue}</td>
                                            <td className="p-3 text-slate-400">{new Date(event.eventDate).toLocaleDateString()}</td>
                                            <td className="p-3 flex justify-end gap-2">
                                                <button onClick={() => handleApproveEvent(event.id, 'APPROVE')} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20"><Check size={18} /></button>
                                                <button onClick={() => handleApproveEvent(event.id, 'REJECT')} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20"><X size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pending Payments Section */}
                <div className="glass-card p-6 border-blue-500/10">
                    <h3 className="text-xl font-bold text-white mb-4">Pending Payments</h3>
                    {pendingPayments.length === 0 ? (
                        <p className="text-slate-400">No payments pending verification.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700 text-slate-400 text-sm">
                                        <th className="p-3">Booking Code</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Receipt</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingPayments.map(payment => (
                                        <tr key={payment.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                                            <td className="p-3 text-white font-mono text-sm">{payment.referenceCode}</td>
                                            <td className="p-3 text-emerald-400 font-bold">${payment.totalPrice}</td>
                                            <td className="p-3">
                                                <button onClick={() => setSelectedImage(payment.paymentProofUrl)} className="text-brand-400 hover:text-brand-300 flex items-center gap-2 text-xs font-semibold bg-brand-500/10 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                                                    <ImageIcon size={14} /> View Proof
                                                </button>
                                            </td>
                                            <td className="p-3 flex justify-end gap-2">
                                                <button onClick={() => handleVerifyPayment(payment.id, 'APPROVE')} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20"><Check size={18} /></button>
                                                <button onClick={() => handleVerifyPayment(payment.id, 'REJECT')} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20"><X size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Receipt Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl p-4 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h3 className="text-xl font-bold text-white">Payment Receipt</h3>
                            <button onClick={() => setSelectedImage(null)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-auto bg-black/50 rounded-xl flex items-center justify-center border border-white/5 p-2">
                            <img src={selectedImage} alt="Payment Proof" className="max-w-full max-h-full object-contain rounded-lg" />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Settings Modal */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsSettingsModalOpen(false)}>
                    <div className="bg-[#0a0f1c] border border-brand-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-brand-500/10 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Settings className="text-brand-400"/> Settings</h3>
                            <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleUpdateCommission}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Platform Commission Rate (%)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={commissionRate} 
                                        onChange={(e) => setCommissionRate(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">%</div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5"><AlertCircle size={12}/> Any future ticket purchases will automatically dynamically split the total sales according to this percentage.</p>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:bg-white/5 border border-white/10 rounded-xl transition-all">Cancel</button>
                                <button type="submit" className="flex items-center justify-center px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all font-medium">Save Configuration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardOverview>
    );    
};
