package com.eventiya.backend.service;

import com.eventiya.backend.dto.AuthResponse;
import com.eventiya.backend.dto.LoginRequest;
import com.eventiya.backend.dto.RegisterRequest;
import com.eventiya.backend.entity.Role;
import com.eventiya.backend.entity.User;
import com.eventiya.backend.exception.EmailAlreadyExistsException;
import com.eventiya.backend.repository.UserRepository;
import com.eventiya.backend.security.JwtUtils;
import com.eventiya.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Convert string role to enum
        Role userRole = Role.valueOf("ROLE_" + request.getRole());
        user.setRole(userRole);

        userRepository.save(user);
    }

    public AuthResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken((UserDetailsImpl) authentication.getPrincipal());

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Calculate expiration derived from token creation config
        Date expiresAt = new Date(System.currentTimeMillis() + 86400000); // 24 hours

        return new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getRole(),
                expiresAt);
    }
}
