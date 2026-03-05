-- Create database
CREATE DATABASE IF NOT EXISTS eventiya;
USE eventiya;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert an initial test ADMIN user (Password is: Password1!)
INSERT INTO users (email, password_hash, name, role) 
VALUES (
    'admin@example.com', 
    '$2a$10$tZ2E1pZt.OZbv0I8E9XW.OJ.tXN6Q8T4H.K5fXyXQzXqNn.gQhU.S', 
    'System Admin', 
    'ROLE_ADMIN'
) ON DUPLICATE KEY UPDATE email=email;
