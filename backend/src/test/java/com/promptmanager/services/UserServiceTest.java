package com.promptmanager.services;

import com.promptmanager.dto.LoginResponse;
import com.promptmanager.dto.UserResponse;
import com.promptmanager.exceptions.PromptValidationException;
import com.promptmanager.models.User;
import com.promptmanager.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "hashedpassword", "test@example.com");
        testUser.setId(1L);
        testUser.setApiKey("api-key-uuid");
    }

    @Test
    void testRegisterUserSuccess() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserResponse response = userService.registerUser("newuser", "password123", "new@example.com");

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUserDuplicateUsername() {
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        assertThrows(PromptValidationException.class, () ->
            userService.registerUser("existinguser", "password123", "new@example.com")
        );

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testAuthenticateUserSuccess() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashedpassword")).thenReturn(true);

        LoginResponse response = userService.authenticateUser("testuser", "password123");

        assertNotNull(response);
        assertEquals("api-key-uuid", response.getApiKey());
    }

    @Test
    void testAuthenticateUserNotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(PromptValidationException.class, () ->
            userService.authenticateUser("nonexistent", "password123")
        );
    }

    @Test
    void testAuthenticateUserInvalidPassword() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "hashedpassword")).thenReturn(false);

        assertThrows(PromptValidationException.class, () ->
            userService.authenticateUser("testuser", "wrongpassword")
        );
    }

    @Test
    void testGetUserByApiKey() {
        when(userRepository.findByApiKey("api-key-uuid")).thenReturn(Optional.of(testUser));

        User user = userService.getUserByApiKey("api-key-uuid");

        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
    }

    @Test
    void testGetUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User user = userService.getUserById(1L);

        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
    }

    @Test
    void testFindByUsername() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        Optional<User> user = userService.findByUsername("testuser");

        assertTrue(user.isPresent());
        assertEquals("testuser", user.get().getUsername());
    }
}
