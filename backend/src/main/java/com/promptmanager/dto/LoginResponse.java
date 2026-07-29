package com.promptmanager.dto;

/**
 * Data Transfer Object for login response (API key only).
 */
public class LoginResponse {

    private String apiKey;

    // Constructors
    public LoginResponse() {
    }

    public LoginResponse(String apiKey) {
        this.apiKey = apiKey;
    }

    // Getters and Setters
    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
