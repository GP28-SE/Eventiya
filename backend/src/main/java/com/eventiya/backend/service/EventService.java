package com.eventiya.backend.service;

import com.eventiya.backend.dto.EventRequest;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.User;
import com.eventiya.backend.repository.EventRepository;
import com.eventiya.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/*
 * Service class handling the business logic for Event management.
 * Ensures data integrity and handles relationship mapping between Event and Organizer.
 */
@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    /*
     * Creates a new event and assigns the currently logged-in user as the organizer.
     * Sets the default status to 'DRAFT' as per the Definition of Done.
     */
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
}