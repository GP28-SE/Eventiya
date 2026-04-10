import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import bookingService from '../api/bookingService';

const UploadProofModal = ({ isOpen, onClose, bookingId, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validation
        if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
            setError("Invalid file type. Only JPG and PNG are allowed.");
            setFile(null);
            setPreview(null);
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            setFile(null);
            setPreview(null);
            return;
        }

        setError(null);
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleUpload = async () => {
        if (!file || !bookingId) return;

        setLoading(true);
        setError(null);

        try {
            const updatedBooking = await bookingService.uploadReceipt(bookingId, file);
            onSuccess(updatedBooking);
            onClose();
        } catch (err) {
            setError("Failed to upload the receipt. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#0a0f1c]/80 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-6 glass-card border border-brand-500/20"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Upload Payment Proof</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors"
                                disabled={loading}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {error && (
                                <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${preview ? 'border-brand-500/50 bg-brand-500/5' : 'border-slate-700 hover:border-brand-500/30'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={loading}
                                />

                                {preview ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-32 rounded-lg overflow-hidden border border-brand-500/20">
                                            <img src={preview} alt="Receipt preview" className="h-full w-full object-cover" />
                                        </div>
                                        <p className="text-sm text-brand-300 flex items-center gap-2">
                                            <CheckCircle size={16} /> Image selected
                                        </p>
                                        <p className="text-xs text-slate-400">Click to change file</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                            <UploadCloud size={24} />
                                        </div>
                                        <div>
                                            <p className="text-slate-200 font-medium">Click to upload or drag and drop</p>
                                            <p className="text-slate-400 text-sm mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${file && !loading
                                        ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <span>Submit Proof</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UploadProofModal;
