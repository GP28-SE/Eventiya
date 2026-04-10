package com.eventiya.backend.service;

import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.entity.BookingStatus;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.User;
import com.eventiya.backend.repository.BookingRepository;
import com.eventiya.backend.repository.EventRepository;
import com.eventiya.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Booking createBooking(Long eventId, Integer ticketCount, String userEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (event.getAvailableTickets() < ticketCount) {
            throw new RuntimeException("Not enough tickets available");
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

        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByAttendee(user);
    }

    public Booking getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getAttendee().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to booking");
        }
        
        return booking;
    }
}
