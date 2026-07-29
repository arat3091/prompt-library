package com.promptmanager.controllers;

import com.promptmanager.dto.LoginRequest;
import com.promptmanager.dto.LoginResponse;
import com.promptmanager.dto.RegisterUserRequest;
import com.promptmanager.dto.UserResponse;
import com.promptmanager.models.User;
import com.promptmanager.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST Controller for User management and authentication endpoints.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user.
     * POST /api/users/register
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegisterUserRequest request) {
        logger.info("POST /api/users/register - Registering new user: {}", request.getUsername());
        UserResponse response = userService.registerUser(request.getUsername(), request.getPassword(), request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login with username and password.
     * POST /api/users/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest request) {
        logger.info("POST /api/users/login - User login attempt: {}", request.getUsername());
        LoginResponse response = userService.authenticateUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    /**
     * Get current authenticated user.
     * GET /api/users/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        logger.info("GET /api/users/me - Retrieving current user");
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) authentication.getDetails();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserResponse response = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getApiKey(),
                user.getRole().name(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }
}
