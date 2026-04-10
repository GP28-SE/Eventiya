package com.eventiya.backend.controller;

import com.eventiya.backend.dto.BookingDTO;
import com.eventiya.backend.dto.BookingRequest;
import com.eventiya.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        String email = authentication.getName();
        BookingDTO booking = bookingService.createBooking(request.getEventId(), request.getTicketCount(), email);
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
}
