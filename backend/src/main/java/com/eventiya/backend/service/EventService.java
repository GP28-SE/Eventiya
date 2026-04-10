package com.eventiya.backend.service;

import com.eventiya.backend.dto.EventDTO;
import com.eventiya.backend.dto.EventRequest;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.EventStatus;
import com.eventiya.backend.entity.Role;
import com.eventiya.backend.entity.User;
import com.eventiya.backend.repository.EventRepository;
import com.eventiya.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Event createEvent(EventRequest request, String email) {
        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setEventDate(request.getEventDate());
        event.setVenue(request.getVenue());
        event.setCategory(request.getCategory());
        event.setPrice(request.getPrice() != null ? BigDecimal.valueOf(request.getPrice()) : null);
        event.setCapacity(request.getCapacity());
        event.setAvailableTickets(request.getCapacity());
        event.setOrganizer(organizer);
        event.setStatus(EventStatus.DRAFT);

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

    public Page<EventDTO> getAllEvents(Pageable pageable) {
        Page<Event> events = eventRepository.findAll(pageable);
        return events.map(this::convertToDTO);
    }

    public List<Event> filterEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByEventDateBetween(start, end);
    }

    public Page<EventDTO> getUpcomingPublishedEvents(Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        Page<Event> events = eventRepository.findByStatusAndEventDateAfterOrderByEventDateAsc(
                EventStatus.PUBLISHED, now, pageable);
        return events.map(this::convertToDTO);
    }

    public Page<EventDTO> getEventsByOrganizer(Long organizerId, Pageable pageable) {
        Page<Event> events = eventRepository.findByOrganizerId(organizerId, pageable);
        return events.map(this::convertToDTO);
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        return convertToDTO(event);
    }

    public com.eventiya.backend.entity.User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public EventDTO updateEvent(Long id, EventDTO eventDTO, String currentUsername) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getOrganizer().getEmail().equals(currentUsername) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("You do not have permission to update this event");
        }

        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setEventDate(eventDTO.getEventDate());
        event.setVenue(eventDTO.getVenue());
        event.setPrice(eventDTO.getPrice());
        event.setStatus(eventDTO.getStatus());
        event.setImageUrl(eventDTO.getImageUrl());
        event.setCapacity(eventDTO.getCapacity());
        event.setAvailableTickets(eventDTO.getAvailableTickets());

        Event updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    public void deleteEvent(Long id, String currentUsername) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getOrganizer().getEmail().equals(currentUsername) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("You do not have permission to delete this event");
        }

        eventRepository.delete(event);
    }

    public void updateEventImage(Long id, String imageUrl) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setImageUrl(imageUrl);
        eventRepository.save(event);
    }

    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setVenue(event.getVenue());
        dto.setPrice(event.getPrice());
        dto.setStatus(event.getStatus());
        dto.setImageUrl(event.getImageUrl());
        dto.setCapacity(event.getCapacity());
        dto.setAvailableTickets(event.getAvailableTickets());

        if (event.getOrganizer() != null) {
            dto.setOrganizerId(event.getOrganizer().getId());
            dto.setOrganizerName(event.getOrganizer().getName());
        }

        return dto;
    }
}