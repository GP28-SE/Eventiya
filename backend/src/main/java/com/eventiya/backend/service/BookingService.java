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

    @Transactional
    public BookingDTO createBooking(Long eventId, Integer ticketCount, String userEmail) {
        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (event.getAvailableTickets() == null) {
                throw new RuntimeException("Event ticket availability not initialized");
            }

            if (event.getAvailableTickets() < ticketCount) {
                throw new RuntimeException("Not enough tickets available. Only " + event.getAvailableTickets() + " left.");
            }

            if (event.getPrice() == null) {
                throw new RuntimeException("Event price not set. Cannot book tickets.");
            }

            // Deduct tickets
            event.setAvailableTickets(event.getAvailableTickets() - ticketCount);
            eventRepository.save(event);

            Booking booking = new Booking();
            booking.setAttendee(user);
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

    public List<BookingDTO> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByAttendee(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getAttendee().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to booking");
        }
        
        return convertToDTO(booking);
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setEventId(booking.getEvent().getId());
        dto.setEventTitle(booking.getEvent().getTitle());
        dto.setEventImageUrl(booking.getEvent().getImageUrl());
        dto.setTicketCount(booking.getTicketCount());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setReferenceCode(booking.getReferenceCode());
        dto.setReceiptUrl(booking.getReceiptUrl());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
