package com.eventiya.backend.service;

import com.eventiya.backend.dto.EventRequest;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.User;
import com.eventiya.backend.repository.EventRepository;
import com.eventiya.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;


@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public Event createEvent(EventRequest request, String email) {
        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));


        // Mapping DTO data to the Entity
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setEventDate(request.getEventDate());
        event.setVenue(request.getVenue());
        event.setCategory(request.getCategory());
        event.setPrice(request.getPrice());
        event.setCapacity(request.getCapacity());

        // Setting the relationship and default status
        event.setOrganizer(organizer);
        event.setStatus("DRAFT");

        return eventRepository.save(event);
    }

    public List<Event> searchEventsByTitle(String title) {
        return eventRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Event> filterEventsByCategory(String category) {
        return eventRepository.findByCategoryIgnoreCase(category);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> filterEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByEventDateBetween(start, end);
    }
}