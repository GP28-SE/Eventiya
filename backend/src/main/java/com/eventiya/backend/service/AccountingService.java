package com.eventiya.backend.service;

import com.eventiya.backend.entity.Booking;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class AccountingService {

    private static final BigDecimal DEFAULT_COMMISSION_RATE = new BigDecimal("10.00");

    public void calculateAndSetRevenue(Booking booking) {
        BigDecimal totalPrice = booking.getTotalPrice();

        BigDecimal platformFee = totalPrice
                .multiply(DEFAULT_COMMISSION_RATE)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal organizerEarning = totalPrice.subtract(platformFee);

        booking.setPlatformFee(platformFee);
        booking.setOrganizerEarning(organizerEarning);
    }
}

