package com.promptmanager.services;

import com.promptmanager.dto.CreatePromptRequest;
import com.promptmanager.dto.PageResponse;
import com.promptmanager.dto.PromptResponse;
import com.promptmanager.dto.UpdatePromptRequest;
import com.promptmanager.exceptions.PromptNotFoundException;
import com.promptmanager.models.Prompt;
import com.promptmanager.repositories.PromptRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Prompt operations.
 */
@Service
@Transactional
public class PromptService {

    private static final Logger logger = LoggerFactory.getLogger(PromptService.class);
    private static final String DEFAULT_AUTHOR = "system";
    private static final int MAX_PAGE_SIZE = 100;
    private static final int DEFAULT_PAGE_SIZE = 20;

    private final PromptRepository promptRepository;

    public PromptService(PromptRepository promptRepository) {
        this.promptRepository = promptRepository;
    }

    /**
     * Create a new prompt.
     */
    public PromptResponse createPrompt(CreatePromptRequest request) {
        logger.debug("Creating new prompt with title: {}", request.getTitle());

        Prompt prompt = new Prompt();
        prompt.setTitle(request.getTitle());
        prompt.setContent(request.getContent());
        prompt.setDescription(request.getDescription());
        prompt.setCategory(request.getCategory());
        prompt.setAuthor(DEFAULT_AUTHOR);

        Prompt savedPrompt = promptRepository.save(prompt);
        logger.info("Prompt created successfully with ID: {}", savedPrompt.getId());

        return mapToResponse(savedPrompt);
    }

    /**
     * Get a prompt by ID.
     */
    @Transactional(readOnly = true)
    public PromptResponse getPromptById(Long id) {
        logger.debug("Retrieving prompt with ID: {}", id);

        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new PromptNotFoundException(id));

        return mapToResponse(prompt);
    }

    /**
     * Get all prompts with pagination and sorting.
     */
    @Transactional(readOnly = true)
    public PageResponse<PromptResponse> getAllPrompts(int page, int size, String sortBy, String sortDirection) {
        logger.debug("Retrieving prompts - page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, sortDirection);

        // Validate and normalize parameters
        if (size <= 0 || size > MAX_PAGE_SIZE) {
            size = DEFAULT_PAGE_SIZE;
        }
        if (page < 0) {
            page = 0;
        }

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Prompt> pageResult = promptRepository.findAll(pageable);

        List<PromptResponse> content = pageResult.getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        logger.info("Retrieved {} prompts from page {} of {}", content.size(), page, pageResult.getTotalPages());

        return new PageResponse<>(
                content,
                page,
                size,
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
    }

    /**
     * Update an existing prompt.
     */
    public PromptResponse updatePrompt(Long id, UpdatePromptRequest request) {
        logger.debug("Updating prompt with ID: {}", id);

        Prompt prompt = promptRepository.findById(id)
                .orElseThrow(() -> new PromptNotFoundException(id));

        prompt.setTitle(request.getTitle());
        prompt.setContent(request.getContent());
        prompt.setDescription(request.getDescription());
        prompt.setCategory(request.getCategory());

        Prompt updatedPrompt = promptRepository.save(prompt);
        logger.info("Prompt with ID {} updated successfully", id);

        return mapToResponse(updatedPrompt);
    }

    /**
     * Delete a prompt by ID.
     */
    public void deletePrompt(Long id) {
        logger.debug("Deleting prompt with ID: {}", id);

        if (!promptRepository.existsById(id)) {
            throw new PromptNotFoundException(id);
        }

        promptRepository.deleteById(id);
        logger.info("Prompt with ID {} deleted successfully", id);
    }

    /**
     * Convert Prompt entity to PromptResponse DTO.
     */
    private PromptResponse mapToResponse(Prompt prompt) {
        return new PromptResponse(
                prompt.getId(),
                prompt.getTitle(),
                prompt.getContent(),
                prompt.getAuthor(),
                prompt.getDescription(),
                prompt.getCategory(),
                prompt.getCreatedAt(),
                prompt.getUpdatedAt(),
                prompt.getVersion()
        );
    }
}
