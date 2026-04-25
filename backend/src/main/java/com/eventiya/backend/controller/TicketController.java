package com.eventiya.backend.controller;

import com.eventiya.backend.dto.BookingDTO;
import com.eventiya.backend.service.BookingService;
import com.eventiya.backend.service.QRCodeService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private QRCodeService qrCodeService;

    @Autowired
    private BookingService bookingService;

    @PostMapping("/validate")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public ResponseEntity<?> validateTicket(@RequestBody Map<String, String> payload) {
        try {
            String token = payload.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Token is missing"));
            }

            // Decode the JWT token
            Claims claims = qrCodeService.validateTicketToken(token);
            
            Long bookingId = Long.parseLong(claims.getSubject());
            String userEmail = claims.get("userEmail", String.class);
            Long eventId = claims.get("eventId", Long.class);

            // Update the booking status to USED
            BookingDTO validatedBooking = bookingService.validateTicket(bookingId, userEmail, eventId);

            return ResponseEntity.ok(Map.of(
                    "message", "Ticket successfully validated and checked in.",
                    "booking", validatedBooking
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid or already used ticket: " + e.getMessage()));
        }
    }
}
