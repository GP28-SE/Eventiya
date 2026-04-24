package com.eventiya.backend.controller;

import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.entity.BookingStatus;
import com.eventiya.backend.repository.BookingRepository;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.EventStatus;
import com.eventiya.backend.repository.EventRepository;
import com.eventiya.backend.service.AccountingService;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.math.BigDecimal;
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

    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/financial-stats")
    public ResponseEntity<Map<String, BigDecimal>> getFinancialStats() {
        List<Booking> paidBookings = bookingRepository.findByStatus(BookingStatus.PAID);
        BigDecimal totalSales = BigDecimal.ZERO;
        BigDecimal netProfit = BigDecimal.ZERO;
        BigDecimal organizerBalance = BigDecimal.ZERO;

        for (Booking b : paidBookings) {
            if (b.getTotalPrice() != null) totalSales = totalSales.add(b.getTotalPrice());
            if (b.getPlatformFee() != null) netProfit = netProfit.add(b.getPlatformFee());
            if (b.getOrganizerEarning() != null) organizerBalance = organizerBalance.add(b.getOrganizerEarning());
        }

        Map<String, BigDecimal> stats = new HashMap<>();
        stats.put("totalSales", totalSales);
        stats.put("netProfit", netProfit);
        stats.put("organizerBalance", organizerBalance);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/pending-payments")
    public ResponseEntity<List<Booking>> getPendingPayments() {
        return ResponseEntity.ok(bookingRepository.findByStatus(BookingStatus.PENDING_VERIFICATION));
    }

    @GetMapping("/pending-events")
    public ResponseEntity<List<Event>> getPendingEvents() {
        return ResponseEntity.ok(eventRepository.findByStatus(EventStatus.PENDING_APPROVAL));
    }

    @PatchMapping("/approve-event/{id}")
    public ResponseEntity<?> approveEvent(@PathVariable Long id, @RequestParam String action) {
        try {
            Event event = eventRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

            if ("APPROVE".equalsIgnoreCase(action)) {
                event.setStatus(EventStatus.APPROVED);
                eventRepository.save(event);
                return ResponseEntity.ok("Event " + id + " has been successfully APPROVED.");
            } else if ("REJECT".equalsIgnoreCase(action)) {
                event.setStatus(EventStatus.REJECTED);
                eventRepository.save(event);
                return ResponseEntity.ok("Event " + id + " has been REJECTED.");
            }
            return ResponseEntity.badRequest().body("Invalid action. Use APPROVE or REJECT.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

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