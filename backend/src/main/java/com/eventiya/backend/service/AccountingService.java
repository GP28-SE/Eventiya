package com.eventiya.backend.service;

import com.eventiya.backend.entity.Booking;
import com.eventiya.backend.entity.BookingStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class AccountingService {

    @Autowired
    private EmailService emailService;

    private static final BigDecimal DEFAULT_COMMISSION_RATE = new BigDecimal("10.00");

    public void processPaymentVerification(Booking booking) {
        calculateAndSetRevenue(booking);
        booking.setStatus(BookingStatus.PAID);

        String customerEmail = booking.getUser().getEmail();
        String customerName = booking.getUser().getEmail();
        String eventName = (booking.getEvent() != null) ? booking.getEvent().getTitle() : "Event";

        emailService.sendBookingConfirmation(
                customerEmail,
                customerName,
                eventName,
                booking.getTotalPrice().doubleValue()
        );
    }

    private void calculateAndSetRevenue(Booking booking) {
        BigDecimal totalPrice = booking.getTotalPrice();

        BigDecimal platformFee = totalPrice
                .multiply(DEFAULT_COMMISSION_RATE)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal organizerEarning = totalPrice.subtract(platformFee);

        booking.setPlatformFee(platformFee);
        booking.setOrganizerEarning(organizerEarning);
    }
}