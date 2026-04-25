package com.eventiya.backend.controller;

import com.eventiya.backend.dto.BookingDTO;
import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create/{eventId}")
    public ResponseEntity<BookingDTO> createBooking(
            @PathVariable Long eventId,
            @RequestParam Integer ticketCount,
            Principal principal) {

        BookingDTO booking = bookingService.createBooking(eventId, ticketCount, principal.getName());
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{id}/upload-receipt")
    public ResponseEntity<?> uploadReceipt(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            Booking booking = bookingService.uploadPaymentProof(id, file);
            return ResponseEntity.ok("Receipt uploaded successfully for booking: " + id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(Principal principal) {
        List<BookingDTO> bookings = bookingService.getMyBookings(principal.getName());
        return ResponseEntity.ok(bookings);
    }
}