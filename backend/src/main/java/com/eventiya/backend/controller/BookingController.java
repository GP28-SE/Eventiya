package com.eventiya.backend.controller;

import com.eventiya.backend.dto.BookingDTO;
import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
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

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(bookingService.getMyBookings(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(bookingService.getBookingById(id, email));
    }

    @PostMapping("/{id}/upload-receipt")
    public ResponseEntity<?> uploadReceipt(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            BookingDTO updatedBooking = bookingService.uploadPaymentProof(id, file, authentication.getName());
            return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}