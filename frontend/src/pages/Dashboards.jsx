import React, { useState, useEffect } from 'react';
import { LayoutGrid, Ticket, Search, AlertCircle, Loader2 } from 'lucide-react';
import bookingService from '../api/bookingService';
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
export const AdminDashboard = () => <DashboardOverview title="Superadmin Panel" description="Platform oversight, financial monitoring, and event verification." />;
