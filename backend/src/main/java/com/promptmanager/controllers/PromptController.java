package com.promptmanager.controllers;

import com.promptmanager.dto.CreatePromptRequest;
import com.promptmanager.dto.PageResponse;
import com.promptmanager.dto.PromptResponse;
import com.promptmanager.dto.UpdatePromptRequest;
import com.promptmanager.services.PromptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST Controller for Prompt API endpoints.
 */
@RestController
@RequestMapping("/prompts")
public class PromptController {

    private static final Logger logger = LoggerFactory.getLogger(PromptController.class);

    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    /**
     * Create a new prompt.
     * POST /api/prompts
     */
    @PostMapping
    public ResponseEntity<PromptResponse> createPrompt(@Valid @RequestBody CreatePromptRequest request) {
        logger.info("POST /api/prompts - Creating new prompt");
        PromptResponse response = promptService.createPrompt(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all prompts with pagination and sorting.
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
     * Get a single prompt by ID.
     * GET /api/prompts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PromptResponse> getPromptById(@PathVariable Long id) {
        logger.info("GET /api/prompts/{} - Retrieving prompt", id);
        PromptResponse response = promptService.getPromptById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update an existing prompt.
     * PUT /api/prompts/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<PromptResponse> updatePrompt(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePromptRequest request) {
        logger.info("PUT /api/prompts/{} - Updating prompt", id);
        PromptResponse response = promptService.updatePrompt(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a prompt by ID.
     * DELETE /api/prompts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrompt(@PathVariable Long id) {
        logger.info("DELETE /api/prompts/{} - Deleting prompt", id);
        promptService.deletePrompt(id);
        return ResponseEntity.noContent().build();
    }
}
