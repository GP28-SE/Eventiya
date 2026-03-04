package com.eventiya.backend.service;

import com.eventiya.backend.dto.ProfileResponse;
import com.eventiya.backend.dto.ProfileUpdateRequest;
import com.eventiya.backend.entity.User;
import com.eventiya.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ProfileResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getContact(),
                user.getRole().name());
    }

    @Transactional
    public ProfileResponse updateUserProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getContact() != null) {
            user.setContact(request.getContact());
        }

        userRepository.save(user);

        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getContact(),
                user.getRole().name());
    }
}
