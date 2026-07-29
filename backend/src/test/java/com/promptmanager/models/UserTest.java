package com.promptmanager.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testUserCreation() {
        User user = new User("testuser", "password123", "test@example.com");
        
        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
        assertEquals("password123", user.getPassword());
        assertEquals("test@example.com", user.getEmail());
        assertEquals(User.Role.USER, user.getRole());
        assertTrue(user.getIsActive());
    }

    @Test
    void testUserFields() {
        User user = new User();
        user.setId(1L);
        user.setUsername("john");
        user.setPassword("hashedpassword");
        user.setEmail("john@example.com");
        user.setApiKey("api-key-123");
        user.setRole(User.Role.ADMIN);
        user.setIsActive(false);

        assertEquals(1L, user.getId());
        assertEquals("john", user.getUsername());
        assertEquals("hashedpassword", user.getPassword());
        assertEquals("john@example.com", user.getEmail());
        assertEquals("api-key-123", user.getApiKey());
        assertEquals(User.Role.ADMIN, user.getRole());
        assertFalse(user.getIsActive());
    }

    @Test
    void testUserEquality() {
        User user1 = new User("user1", "pass", "email");
        User user2 = new User("user1", "pass", "email");
        User user3 = new User("user3", "pass", "email");

        user1.setId(1L);
        user2.setId(1L);
        user3.setId(2L);

        assertEquals(user1, user2);
        assertNotEquals(user1, user3);
    }

    @Test
    void testUserToString() {
        User user = new User("testuser", "password", "test@example.com");
        user.setId(5L);
        
        String toString = user.toString();
        assertTrue(toString.contains("testuser"));
        assertTrue(toString.contains("User{"));
    }
}
