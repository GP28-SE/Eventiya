package com.eventiya.backend.repository;

import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByStatusAndEventDateAfterOrderByEventDateAsc(EventStatus status, LocalDateTime eventDate,
            Pageable pageable);

    Page<Event> findByOrganizerId(Long organizerId, Pageable pageable);

    List<Event> findByTitleContainingIgnoreCase(String title);

    List<Event> findByCategoryIgnoreCase(String category);

    List<Event> findByEventDateBetween(LocalDateTime start, LocalDateTime end);
}