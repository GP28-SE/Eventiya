package com.eventiya.backend.service;

import com.eventiya.backend.dto.EventDTO;
import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.EventStatus;
import com.eventiya.backend.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUpcomingPublishedEvents_ShouldReturnPageOfDTOs() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Event event = new Event();
        event.setId(1L);
        event.setTitle("Test Event");
        event.setStatus(EventStatus.PUBLISHED);
        event.setEventDate(LocalDateTime.now().plusDays(1));
        event.setVenue("Test Venue");
        event.setPrice(new BigDecimal("100.00"));

        List<Event> events = Collections.singletonList(event);
        Page<Event> eventPage = new PageImpl<>(events, pageable, events.size());

        when(eventRepository.findByStatusAndEventDateAfterOrderByEventDateAsc(
                eq(EventStatus.PUBLISHED), any(LocalDateTime.class), eq(pageable)))
                .thenReturn(eventPage);

        // Act
        Page<EventDTO> result = eventService.getUpcomingPublishedEvents(pageable);

        // Assert
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Event", result.getContent().get(0).getTitle());
        assertEquals(1L, result.getContent().get(0).getId());
    }

    @Test
    void getUpcomingPublishedEvents_WithEmptyResults_ShouldReturnEmptyPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Event> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(eventRepository.findByStatusAndEventDateAfterOrderByEventDateAsc(
                eq(EventStatus.PUBLISHED), any(LocalDateTime.class), eq(pageable)))
                .thenReturn(emptyPage);

        // Act
        Page<EventDTO> result = eventService.getUpcomingPublishedEvents(pageable);

        // Assert
        assertEquals(0, result.getTotalElements());
    }
}
