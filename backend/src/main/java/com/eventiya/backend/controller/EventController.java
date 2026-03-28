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
import java.util.List;


@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventRequest request, Authentication authentication) {
        // authentication.getName() retrieves the username of the currently logged-in user
        Event createdEvent = eventService.createEvent(request, authentication.getName());

        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate) {

        List<Event> events;

        if (startDate != null && endDate != null) {
            events = eventService.filterEventsByDateRange(startDate, endDate);
        }

        else if (title != null && !title.isEmpty()) {
            events = eventService.searchEventsByTitle(title);
        }

        else if (category != null && !category.isEmpty()) {
            events = eventService.filterEventsByCategory(category);
        }

        else {
            events = eventService.getAllEvents();
        }

        return ResponseEntity.ok(events);
    }
}