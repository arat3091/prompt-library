package com.promptmanager.controllers;

import com.promptmanager.dto.CreatePromptRequest;
import com.promptmanager.dto.PageResponse;
import com.promptmanager.dto.PromptResponse;
import com.promptmanager.dto.UpdatePromptRequest;
import com.promptmanager.models.User;
import com.promptmanager.services.PromptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST Controller for Prompt API endpoints.
 */
@RestController
@RequestMapping("/api/prompts")
public class PromptController {

    private static final Logger logger = LoggerFactory.getLogger(PromptController.class);

    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    /**
     * Create a new prompt (requires authentication).
     * POST /api/prompts
     */
    @PostMapping
    public ResponseEntity<PromptResponse> createPrompt(
            @Valid @RequestBody CreatePromptRequest request,
            Authentication authentication) {
        logger.info("POST /api/prompts - Creating new prompt");
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) authentication.getDetails();
        PromptResponse response = promptService.createPrompt(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all prompts with pagination and sorting (public).
     * GET /api/prompts?page=0&size=20&sort=createdAt&direction=desc
     */
    @GetMapping
    public ResponseEntity<PageResponse<PromptResponse>> getAllPrompts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        logger.info("GET /api/prompts - Retrieving prompts with page={}, size={}, sort={}, direction={}", page, size, sort, direction);
        PageResponse<PromptResponse> response = promptService.getAllPrompts(page, size, sort, direction);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a single prompt by ID (public).
     * GET /api/prompts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PromptResponse> getPromptById(@PathVariable Long id) {
        logger.info("GET /api/prompts/{} - Retrieving prompt", id);
        PromptResponse response = promptService.getPromptById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update an existing prompt (requires authentication and ownership).
     * PUT /api/prompts/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<PromptResponse> updatePrompt(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePromptRequest request,
            Authentication authentication) {
        logger.info("PUT /api/prompts/{} - Updating prompt", id);
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) authentication.getDetails();
        PromptResponse response = promptService.updatePrompt(id, request, user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a prompt by ID (requires authentication and ownership).
     * DELETE /api/prompts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrompt(
            @PathVariable Long id,
            Authentication authentication) {
        logger.info("DELETE /api/prompts/{} - Deleting prompt", id);
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) authentication.getDetails();
        promptService.deletePrompt(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
