package com.eventiya.backend.entity;

public enum BookingStatus {
    PENDING,                // Reservation created (waiting for payment proof upload)
    PENDING_VERIFICATION,   // Proof uploaded (waiting for Admin to approve)
    PAID,                   // Admin approved (QR code generated)
    CONFIRMED,              // Same as PAID or confirmed by admin
    CANCELLED,              // Timeout or manual cancellation
    USED                    // Ticket scanned at venue
}
