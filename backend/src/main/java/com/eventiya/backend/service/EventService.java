package com.eventiya.backend.service;

import com.eventiya.backend.dto.EventDTO;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.EventStatus;
import com.eventiya.backend.entity.Role;
import com.eventiya.backend.entity.User;
import com.eventiya.backend.repository.EventRepository;
import com.eventiya.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

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

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public EventDTO updateEvent(Long id, EventDTO eventDTO, String currentUsername) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        // Security check: Only owner or admin can update
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

        Event updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    public void deleteEvent(Long id, String currentUsername) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        // Security check: Only owner or admin can delete
        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getOrganizer().getEmail().equals(currentUsername) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("You do not have permission to delete this event");
        }

        eventRepository.delete(event);
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
        
        if (event.getOrganizer() != null) {
            dto.setOrganizerId(event.getOrganizer().getId());
            dto.setOrganizerName(event.getOrganizer().getName());
        }
        
        return dto;
    }
}
