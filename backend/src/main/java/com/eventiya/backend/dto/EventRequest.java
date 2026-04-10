package com.eventiya.backend.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class EventRequest {

    @NotBlank(message = "Event title is required")
    private String title;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future") // AC: Date must be in the future
    private LocalDateTime eventDate;

    @NotBlank(message = "Venue location is required")
    private String venue;

    @NotBlank(message = "Event category is required")
    private String category;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price cannot be a negative value")
    private Double price;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be a positive integer") // AC: Capacity must be positive
    private Integer capacity;

    // Default Constructor
    public EventRequest() {}

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}