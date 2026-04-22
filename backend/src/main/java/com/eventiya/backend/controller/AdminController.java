package com.eventiya.backend.controller;

import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.entity.BookingStatus;
import com.eventiya.backend.repository.BookingRepository;
import com.eventiya.backend.service.AccountingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AccountingService accountingService;

    @PatchMapping("/verify-payment/{id}")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id, @RequestParam String action) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            if ("APPROVE".equalsIgnoreCase(action)) {
                accountingService.processPaymentVerification(booking);
                bookingRepository.save(booking);
                return ResponseEntity.ok("Booking " + id + " has been successfully APPROVED and confirmation email sent.");
            }

            else if ("REJECT".equalsIgnoreCase(action)) {
                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
                return ResponseEntity.ok("Booking " + id + " has been REJECTED.");
            }

            return ResponseEntity.badRequest().body("Invalid action. Use APPROVE or REJECT.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}