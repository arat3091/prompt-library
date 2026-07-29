package com.promptmanager.exceptions;

/**
 * Exception thrown when a prompt is not found.
 */
public class PromptNotFoundException extends RuntimeException {

    public PromptNotFoundException(String message) {
        super(message);
    }

    public PromptNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public PromptNotFoundException(Long promptId) {
        super("Prompt with ID " + promptId + " not found");
    }
}
