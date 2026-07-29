package com.promptmanager.exceptions;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UnauthorizedExceptionTest {

    @Test
    void testUnauthorizedExceptionWithMessage() {
        String message = "You are not authorized";
        UnauthorizedException ex = new UnauthorizedException(message);

        assertEquals(message, ex.getMessage());
    }

    @Test
    void testUnauthorizedExceptionWithCause() {
        String message = "Unauthorized";
        Throwable cause = new RuntimeException("Root cause");
        UnauthorizedException ex = new UnauthorizedException(message, cause);

        assertEquals(message, ex.getMessage());
        assertEquals(cause, ex.getCause());
    }

    @Test
    void testUnauthorizedExceptionIsRuntimeException() {
        UnauthorizedException ex = new UnauthorizedException("Test");
        assertTrue(ex instanceof RuntimeException);
    }
}
