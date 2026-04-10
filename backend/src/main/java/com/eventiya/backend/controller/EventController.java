package com.eventiya.backend.controller;

import com.eventiya.backend.dto.EventDTO;
import com.eventiya.backend.dto.EventRequest;
import com.eventiya.backend.service.EventService;
import com.eventiya.backend.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    // 1. Get All Events (paginated)
    @GetMapping("/")
    public ResponseEntity<Page<EventDTO>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDTO> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(events);
    }

    // 2. Get Single Event by ID
    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // 3. Get My Events (Organizer only)
    @GetMapping("/my-events")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public ResponseEntity<Page<EventDTO>> getMyEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        
        com.eventiya.backend.entity.User currentUser = eventService.getUserByEmail(principal.getName());
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDTO> events = eventService.getEventsByOrganizer(currentUser.getId(), pageable);
        return ResponseEntity.ok(events);
    }

    // 4. Create Event (Organizer/Admin only)
    @PostMapping("/create")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public ResponseEntity<?> createEvent(
            @RequestBody @Valid EventRequest eventRequest,
            Authentication authentication) {
        try {
            eventService.createEvent(eventRequest, authentication.getName());
            return new ResponseEntity<>(Map.of("message", "Event created successfully"), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating event: " + e.getMessage()));
        }
    }

    // 5. Update Event
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public ResponseEntity<EventDTO> updateEvent(
            @PathVariable Long id,
            @RequestBody EventDTO eventDTO,
            Principal principal) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDTO, principal.getName()));
    }

    // 6. Delete Event
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, Principal principal) {
        eventService.deleteEvent(id, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }
}