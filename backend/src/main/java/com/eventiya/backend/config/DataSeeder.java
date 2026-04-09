package com.eventiya.backend.config;

import com.eventiya.backend.entity.Event;
import com.eventiya.backend.entity.EventStatus;
import com.eventiya.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private com.eventiya.backend.repository.UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (eventRepository.count() == 0) {
            seedEvents();
        }
    }

    private void seedEvents() {
        LocalDateTime now = LocalDateTime.now();

        // Ensure at least one organizer exists
        com.eventiya.backend.entity.User organizer = userRepository.findByEmail("organizer@eventiya.com").orElseGet(() -> {
            com.eventiya.backend.entity.User newUser = new com.eventiya.backend.entity.User();
            newUser.setName("Default Organizer");
            newUser.setEmail("organizer@eventiya.com");
            newUser.setPasswordHash("$2a$10$8.UnVuG9HHgffUDAlk8Kn.2NvEnJZyT.q6b4.E3QkPjiD.M.7ZSu."); // password: password
            newUser.setRole(com.eventiya.backend.entity.Role.ROLE_ORGANIZER);
            return userRepository.save(newUser);
        });

        Event event1 = new Event();
        event1.setTitle("Tech Innovators Conference 2026");
        event1.setOrganizer(organizer);
        event1.setDescription("Join the brightest minds in tech for a two-day conference on AI, cloud computing, and the future of work.");
        event1.setEventDate(now.plusDays(10).withHour(9).withMinute(0));
        event1.setVenue("Silicon Valley Convention Center");
        event1.setPrice(new BigDecimal("299.00"));
        event1.setStatus(EventStatus.PUBLISHED);
        event1.setImageUrl("https://images.unsplash.com/photo-1540575861501-7ad05823c951?auto=format&fit=crop&q=80&w=1000");

        Event event2 = new Event();
        event2.setTitle("Underground Jazz Night");
        event2.setOrganizer(organizer);
        event2.setDescription("An intimate evening of smooth jazz and soul in the heart of the city. Featuring local legends and rising stars.");
        event2.setEventDate(now.plusDays(5).withHour(20).withMinute(30));
        event2.setVenue("The Blue Note Lounge");
        event2.setPrice(new BigDecimal("45.00"));
        event2.setStatus(EventStatus.PUBLISHED);
        event2.setImageUrl("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000");

        Event event3 = new Event();
        event3.setTitle("Modern Art Exhibition");
        event3.setOrganizer(organizer);
        event3.setDescription("Explore contemporary masterpieces and experimental installations from upcoming artists in our special spring showcase.");
        event3.setEventDate(now.plusDays(15).withHour(10).withMinute(0));
        event3.setVenue("Metropolitan Gallery of Art");
        event3.setPrice(new BigDecimal("15.00"));
        event3.setStatus(EventStatus.PUBLISHED);
        event3.setImageUrl("https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?auto=format&fit=crop&q=80&w=1000");

        Event event4 = new Event();
        event4.setTitle("Global Food Festival");
        event4.setOrganizer(organizer);
        event4.setDescription("Taste flavors from around the world! Over 50 vendors serving authentic dishes, plus live cooking demonstrations.");
        event4.setEventDate(now.plusDays(20).withHour(11).withMinute(0));
        event4.setVenue("City Central Park");
        event4.setPrice(BigDecimal.ZERO);
        event4.setStatus(EventStatus.PUBLISHED);
        event4.setImageUrl("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000");

        Event event5 = new Event();
        event5.setTitle("Startup Pitch Night");
        event5.setOrganizer(organizer);
        event5.setDescription("Watch the next generation of entrepreneurs pitch their ideas to a panel of expert investors and industry leaders.");
        event5.setEventDate(now.plusDays(2).withHour(18).withMinute(0));
        event5.setVenue("Innovation Hub Co-working");
        event5.setPrice(new BigDecimal("10.00"));
        event5.setStatus(EventStatus.PUBLISHED);
        event5.setImageUrl("https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000");

        Event event6 = new Event();
        event6.setTitle("Wellness & Yoga Retreat");
        event6.setOrganizer(organizer);
        event6.setDescription("Rejuvenate your body and mind with our weekend retreat featuring yoga sessions, meditation, and healthy organic meals.");
        event6.setEventDate(now.plusDays(30).withHour(8).withMinute(0));
        event6.setVenue("Serenity Lake Resort");
        event6.setPrice(new BigDecimal("150.00"));
        event6.setStatus(EventStatus.PUBLISHED);
        event6.setImageUrl("https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000");

        eventRepository.saveAll(Arrays.asList(event1, event2, event3, event4, event5, event6));
        System.out.println("DataSeeder: 6 sample events seeded.");
    }
}
