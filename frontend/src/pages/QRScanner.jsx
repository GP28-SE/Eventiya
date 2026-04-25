import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle2, XCircle, Loader2, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/apiConfig';

export default function QRScanner() {
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanError, setScanError] = useState(null);
    const [scannerActive, setScannerActive] = useState(true);

    useEffect(() => {
        let scanner = null;
        if (scannerActive) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
            }
        };
    }, [scannerActive]);

    const onScanSuccess = async (decodedText, decodedResult) => {
        // Stop scanning to prevent multiple API calls
        setScannerActive(false);
        setLoading(true);
        setScanError(null);
        setScanResult(null);

        try {
            const response = await api.post('/tickets/validate', { token: decodedText });
            setScanResult(response.data);
            
            // Auto restart scanner after 3 seconds on success
            setTimeout(() => {
                resetScanner();
            }, 3000);
        } catch (error) {
            console.error("Validation Error:", error);
            setScanError(error.response?.data?.message || "Invalid or unreadable QR code");
        } finally {
            setLoading(false);
        }
    };

    const onScanFailure = (error) => {
        // We don't want to alert on every frame failure, just ignore or log debug if needed
    };

    const resetScanner = () => {
        setScanResult(null);
        setScanError(null);
        setScannerActive(true);
    };

    return (
        <div className="max-w-3xl mx-auto p-4 py-24 min-h-screen relative flex flex-col items-center">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[150px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center justify-center p-3 bg-brand-500/10 rounded-2xl mb-4 text-brand-400">
                    <ScanLine className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Ticket Scanner</h1>
                <p className="text-slate-400">Scan attendee QR codes to validate entry.</p>
            </motion.div>

            <div className="w-full max-w-md glass-card p-6 overflow-hidden relative min-h-[400px] flex flex-col items-center justify-center">
                {scannerActive && (
                    <div id="reader" className="w-full text-white bg-black/20 rounded-xl overflow-hidden [&_video]:rounded-xl [&_#reader__dashboard_section_csr_span]:text-slate-400 [&_select]:bg-[#0a0f1c] [&_select]:border [&_select]:border-white/10 [&_select]:rounded-lg [&_select]:p-2 [&_button]:bg-brand-500 [&_button]:hover:bg-brand-400 [&_button]:text-white [&_button]:px-4 [&_button]:py-2 [&_button]:rounded-lg [&_button]:mt-2"></div>
                )}

                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0a0f1c]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                        >
                            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
                            <p className="text-brand-400 font-medium">Validating Ticket...</p>
                        </motion.div>
                    )}

                    {scanResult && !loading && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20 text-center"
                        >
                            <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"
                            >
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mb-2">Access Granted</h2>
                            <p className="text-emerald-400 text-lg font-medium mb-1">
                                {scanResult.booking?.ticketCount} Ticket(s) Validated
                            </p>
                            <p className="text-slate-300">
                                {scanResult.message}
                            </p>
                            <p className="text-slate-500 text-sm mt-8 animate-pulse">
                                Ready for next scan...
                            </p>
                        </motion.div>
                    )}

                    {scanError && !loading && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 bg-rose-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20 text-center"
                        >
                            <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center mb-6"
                            >
                                <XCircle className="w-12 h-12 text-rose-500" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mb-2">Access Denied</h2>
                            <p className="text-rose-400 text-lg font-medium mb-6">
                                {scanError}
                            </p>
                            <button
                                onClick={resetScanner}
                                className="btn-primary bg-rose-500 hover:bg-rose-400 text-white w-full"
                            >
                                Scan Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
