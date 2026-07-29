package com.promptmanager.exceptions;

/**
 * Exception thrown when prompt validation fails.
 */
public class PromptValidationException extends RuntimeException {

    public PromptValidationException(String message) {
        super(message);
    }

    public PromptValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
