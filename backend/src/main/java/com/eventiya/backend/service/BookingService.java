package com.eventiya.backend.service;

import com.eventiya.backend.dto.BookingDTO;
import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.entity.BookingStatus;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.User;
import com.eventiya.backend.repository.BookingRepository;
import com.eventiya.backend.repository.EventRepository;
import com.eventiya.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AccountingService accountingService; // SCRUM-105

    @Transactional
    public BookingDTO createBooking(Long eventId, Integer ticketCount, String userEmail) {
        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (event.getAvailableTickets() == null || event.getAvailableTickets() < ticketCount) {
                throw new RuntimeException("Not enough tickets available.");
            }

            // Deduct tickets from inventory
            event.setAvailableTickets(event.getAvailableTickets() - ticketCount);
            eventRepository.save(event);

            Booking booking = new Booking();
            booking.setUser(user);
            booking.setEvent(event);
            booking.setTicketCount(ticketCount);
            booking.setTotalPrice(event.getPrice().multiply(new BigDecimal(ticketCount)));
            booking.setStatus(BookingStatus.PENDING);
            booking.setReferenceCode("EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

            Booking savedBooking = bookingRepository.save(booking);
            return convertToDTO(savedBooking);
        } catch (Exception e) {
            logger.error("Booking failed for event {} and user {}: {}", eventId, userEmail, e.getMessage());
            throw e;
        }
    }

    // --- SCRUM-100 & SCRUM-105: Admin Verification Logic ---
    @Transactional
    public void verifyPaymentStatus(Long bookingId, String action) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        if ("APPROVE".equalsIgnoreCase(action)) {
            // Calculate revenue split (SCRUM-105)
            accountingService.calculateAndSetRevenue(booking);

            // Mark as PAID
            booking.setStatus(BookingStatus.PAID);

            logger.info("Booking ID {} APPROVED. Platform Fee: {}, Organizer Earning: {}",
                    bookingId, booking.getPlatformFee(), booking.getOrganizerEarning());
        } else if ("REJECT".equalsIgnoreCase(action)) {
            booking.setStatus(BookingStatus.REJECTED);

            // Note: In a real scenario, you might want to return tickets back to inventory here
            logger.info("Booking ID {} REJECTED by admin.", bookingId);
        }

        bookingRepository.save(booking);
    }

    public BookingDTO getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to booking");
        }
        
        return convertToDTO(booking);
    }

    @Transactional
    public BookingDTO uploadPaymentProof(Long bookingId, MultipartFile file, String currentUsername) throws IOException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getEmail().equals(currentUsername)) {
            throw new RuntimeException("You do not have permission to upload proof for this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Upload failed: Booking is not in PENDING status.");
        }

        String fileName = fileStorageService.saveImage(file);
        
        booking.setReceiptUrl(fileName);
        booking.setStatus(BookingStatus.PENDING_VERIFICATION);
        
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    @Transactional
    public BookingDTO validateTicket(Long bookingId, String userEmail, Long eventId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Invalid ticket ownership");
        }
        
        if (!booking.getEvent().getId().equals(eventId)) {
            throw new RuntimeException("Ticket is for a different event");
        }

        if (booking.getStatus() == BookingStatus.USED) {
            throw new RuntimeException("Ticket has already been used");
        }

        if (booking.getStatus() != BookingStatus.PAID && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Ticket is not active or paid");
        }

        booking.setStatus(BookingStatus.USED);
        Booking updatedBooking = bookingRepository.save(booking);
        
        logger.info("Ticket validated and used for booking ID: {}", bookingId);
        return convertToDTO(updatedBooking);
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setEventId(booking.getEvent().getId());
        dto.setEventTitle(booking.getEvent().getTitle());
        dto.setEventImageUrl(booking.getEvent().getImageUrl());
        dto.setEventDate(booking.getEvent().getEventDate());
        dto.setEventVenue(booking.getEvent().getVenue());
        dto.setTicketCount(booking.getTicketCount());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setReferenceCode(booking.getReferenceCode());
        dto.setReceiptUrl(booking.getReceiptUrl());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}