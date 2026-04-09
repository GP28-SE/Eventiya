package com.eventiya.backend.service;

import com.eventiya.backend.dto.EventDTO;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.EventStatus;
import com.eventiya.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Page<EventDTO> getUpcomingPublishedEvents(Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        Page<Event> events = eventRepository.findByStatusAndEventDateAfterOrderByEventDateAsc(
                EventStatus.PUBLISHED, now, pageable);
        
        return events.map(this::convertToDTO);
    }

    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        return convertToDTO(event);
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
        return dto;
    }
}
