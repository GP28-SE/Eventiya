package com.eventiya.backend.repository;

import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByAttendee(User attendee);
    List<Booking> findByEventId(Long eventId);
    Optional<Booking> findByReferenceCode(String referenceCode);
}
