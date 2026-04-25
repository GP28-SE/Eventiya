package com.eventiya.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String customerName, String eventName, double amount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("mavimukthieranga@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Booking Confirmed! - " + eventName);

            String htmlContent = "<h3>Dear " + customerName + ",</h3>"
                    + "<p>Your payment for <b>" + eventName + "</b> has been successfully verified.</p>"
                    + "<p><b>Amount Paid:</b> LKR " + amount + "</p>"
                    + "<p>Thank you for booking with Eventiya!</p>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
