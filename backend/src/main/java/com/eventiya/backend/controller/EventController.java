package com.eventiya.backend.controller;

import com.eventiya.backend.dto.EventRequest;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/*
 * REST Controller for managing Event-related operations.
 * Provides endpoints for creating and managing events with role-based access control.
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /*
     * Endpoint for creating a new event.
     * Restricted to users with the 'ORGANIZER' role.
     * * @param request The event details validated via EventRequest DTO.
     * @param authentication The security context containing the logged-in user's details.
     * @return The created Event entity with a 201 Created status.
     */
    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventRequest request, Authentication authentication) {
        // authentication.getName() retrieves the username of the currently logged-in user
        Event createdEvent = eventService.createEvent(request, authentication.getName());

        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }
}