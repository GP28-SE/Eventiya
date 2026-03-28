package com.eventiya.backend.repository;

import com.eventiya.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {


    List<Event> findByTitleContainingIgnoreCase(String title);

    List<Event> findByCategoryIgnoreCase(String category);

    List<Event> findByEventDateBetween(LocalDateTime start, LocalDateTime end);
}