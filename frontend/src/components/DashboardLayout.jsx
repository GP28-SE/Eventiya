import React from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200">
            {/* Sidebar Overlay for mobile could be added here later */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="pl-72 min-h-screen">
                <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
