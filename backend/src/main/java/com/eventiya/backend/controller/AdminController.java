package com.eventiya.backend.controller;

import com.eventiya.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private BookingService bookingService;

    @PatchMapping("/verify-payment/{id}")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id, @RequestParam String action) {
        try {
            bookingService.verifyPaymentStatus(id, action);
            return ResponseEntity.ok("Booking " + id + " has been successfully " + action + "ED.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}