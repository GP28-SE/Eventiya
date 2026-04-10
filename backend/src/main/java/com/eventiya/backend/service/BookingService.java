package com.eventiya.backend.service;

import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.entity.BookingStatus;
import com.eventiya.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Booking uploadPaymentProof(Long bookingId, MultipartFile file, String currentUsername) throws IOException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        // Note: For SCRUM-302 security, checking if the current user is the booking owner would go here.
        // if (!booking.getUser().getEmail().equals(currentUsername)) {
        //     throw new RuntimeException("You do not have permission to upload proof for this booking");
        // }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Upload failed: Booking is not in PENDING status.");
        }

        String fileName = fileStorageService.saveImage(file);
        
        booking.setReceiptUrl(fileName);
        booking.setStatus(BookingStatus.PENDING_VERIFICATION);
        
        return bookingRepository.save(booking);
    }
}
