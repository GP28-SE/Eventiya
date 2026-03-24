package com.eventiya.backend.dto;

import com.eventiya.backend.entity.Role;

import java.util.Date;

public class AuthResponse {
    private String token;
    private Long userId;
    private String role;
    private Date expiresAt;

    public AuthResponse(String token, Long userId, Role role, Date expiresAt) {
        this.token = token;
        this.userId = userId;
        this.role = role.name();
        this.expiresAt = expiresAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Date getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Date expiresAt) {
        this.expiresAt = expiresAt;
    }
}
