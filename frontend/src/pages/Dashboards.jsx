import React from 'react';

const DashboardOverview = ({ title, description }) => (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-slate-400">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border-brand-500/20">
                <h3 className="text-slate-400 text-sm font-medium mb-1 capitalize">Total Analytics</h3>
                <p className="text-2xl font-bold text-white">Coming Soon</p>
            </div>
            {/* Additional cards as placeholders */}
        </div>
    </div>
);

export const AttendeeDashboard = () => <DashboardOverview title="Welcome back! 👋" description="Manage your booked events and discover new experiences." />;
export const OrganizerDashboard = () => <DashboardOverview title="Organizer Insights" description="Track your event performance and manage attendee check-ins." />;
export const AdminDashboard = () => <DashboardOverview title="Superadmin Panel" description="Platform oversight, financial monitoring, and event verification." />;
