package com.promptmanager.services;

import com.promptmanager.dto.LoginResponse;
import com.promptmanager.dto.UserResponse;
import com.promptmanager.exceptions.PromptValidationException;
import com.promptmanager.models.User;
import com.promptmanager.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;
import java.util.UUID;

/**
 * Service layer for User operations including registration, login, and authentication.
 */
@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new user.
     */
    public UserResponse registerUser(String username, String password, String email) {
        logger.debug("Registering new user: {}", username);

        // Check if username already exists
        if (userRepository.existsByUsername(username)) {
            logger.warn("Registration failed: username {} already exists", username);
            throw new PromptValidationException("Username already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setApiKey(UUID.randomUUID().toString());
        user.setRole(User.Role.USER);

        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", username);

        return mapToResponse(savedUser);
    }

    /**
     * Authenticate user and return API key.
     */
    public LoginResponse authenticateUser(String username, String password) {
        logger.debug("Authenticating user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("Authentication failed: user {} not found", username);
                    return new PromptValidationException("Invalid username or password");
                });

        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Authentication failed: invalid password for user {}", username);
            throw new PromptValidationException("Invalid username or password");
        }

        logger.info("User authenticated successfully: {}", username);
        return new LoginResponse(user.getApiKey());
    }

    /**
     * Get user by API key.
     */
    @Transactional(readOnly = true)
    public User getUserByApiKey(String apiKey) {
        logger.debug("Looking up user by API key");
        return userRepository.findByApiKey(apiKey).orElse(null);
    }

    /**
     * Get user by ID.
     */
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        logger.debug("Retrieving user with ID: {}", id);
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Get user by username.
     */
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Convert User entity to UserResponse DTO (excludes password).
     */
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getApiKey(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
