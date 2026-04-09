package com.eventiya.backend.controller;

import com.eventiya.backend.dto.EventDTO;
import com.eventiya.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/")
    public ResponseEntity<Page<EventDTO>> getAllUpcomingEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDTO> events = eventService.getUpcomingPublishedEvents(pageable);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            EventDTO event = eventService.getEventById(id);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/my-events")
    public ResponseEntity<?> getMyEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            java.security.Principal principal) {
        
        try {
            com.eventiya.backend.entity.User currentUser = eventService.getUserByEmail(principal.getName());
            Pageable pageable = PageRequest.of(page, size);
            Page<EventDTO> events = eventService.getEventsByOrganizer(currentUser.getId(), pageable);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id, 
            @RequestBody EventDTO eventDTO, 
            java.security.Principal principal) {
        try {
            EventDTO updatedEvent = eventService.updateEvent(id, eventDTO, principal.getName());
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, java.security.Principal principal) {
        try {
            eventService.deleteEvent(id, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
