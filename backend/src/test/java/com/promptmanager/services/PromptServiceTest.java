package com.promptmanager.services;

import com.promptmanager.dto.CreatePromptRequest;
import com.promptmanager.dto.PageResponse;
import com.promptmanager.dto.PromptResponse;
import com.promptmanager.dto.UpdatePromptRequest;
import com.promptmanager.exceptions.PromptNotFoundException;
import com.promptmanager.exceptions.UnauthorizedException;
import com.promptmanager.models.Prompt;
import com.promptmanager.repositories.PromptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PromptServiceTest {

    @Mock
    private PromptRepository promptRepository;

    @InjectMocks
    private PromptService promptService;

    private Prompt testPrompt;
    private CreatePromptRequest createRequest;
    private UpdatePromptRequest updateRequest;

    @BeforeEach
    void setUp() {
        testPrompt = new Prompt("Test Prompt", "This is test content", "user-1", 1L);
        testPrompt.setId(1L);

        createRequest = new CreatePromptRequest();
        createRequest.setTitle("New Prompt");
        createRequest.setContent("New Content");
        createRequest.setDescription("New Description");
        createRequest.setCategory("Testing");

        updateRequest = new UpdatePromptRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setContent("Updated Content");
        updateRequest.setDescription("Updated Description");
        updateRequest.setCategory("Updated");
    }

    @Test
    void testCreatePromptSuccess() {
        when(promptRepository.save(any(Prompt.class))).thenReturn(testPrompt);

        PromptResponse response = promptService.createPrompt(createRequest, 1L);

        assertNotNull(response);
        assertEquals("Test Prompt", response.getTitle());
        assertEquals(1L, response.getUserId());
        verify(promptRepository, times(1)).save(any(Prompt.class));
    }

    @Test
    void testGetPromptByIdSuccess() {
        when(promptRepository.findById(1L)).thenReturn(Optional.of(testPrompt));

        PromptResponse response = promptService.getPromptById(1L);

        assertNotNull(response);
        assertEquals("Test Prompt", response.getTitle());
        assertEquals(1L, response.getUserId());
    }

    @Test
    void testGetPromptByIdNotFound() {
        when(promptRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(PromptNotFoundException.class, () ->
            promptService.getPromptById(999L)
        );
    }

    @Test
    void testGetAllPromptsSuccess() {
        Prompt prompt1 = new Prompt("Prompt 1", "Content 1", "user-1", 1L);
        Prompt prompt2 = new Prompt("Prompt 2", "Content 2", "user-2", 2L);

        Page<Prompt> page = new PageImpl<>(Arrays.asList(prompt1, prompt2));
        when(promptRepository.findAll(any(Pageable.class))).thenReturn(page);

        PageResponse<PromptResponse> response = promptService.getAllPrompts(0, 20, "createdAt", "desc");

        assertNotNull(response);
        assertEquals(2, response.getContent().size());
        assertEquals(0, response.getCurrentPage());
    }

    @Test
    void testUpdatePromptSuccess() {
        when(promptRepository.findById(1L)).thenReturn(Optional.of(testPrompt));
        when(promptRepository.save(any(Prompt.class))).thenReturn(testPrompt);

        PromptResponse response = promptService.updatePrompt(1L, updateRequest, 1L);

        assertNotNull(response);
        verify(promptRepository, times(1)).save(any(Prompt.class));
    }

    @Test
    void testUpdatePromptNotFound() {
        when(promptRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(PromptNotFoundException.class, () ->
            promptService.updatePrompt(999L, updateRequest, 1L)
        );
    }

    @Test
    void testUpdatePromptUnauthorized() {
        when(promptRepository.findById(1L)).thenReturn(Optional.of(testPrompt));

        assertThrows(UnauthorizedException.class, () ->
            promptService.updatePrompt(1L, updateRequest, 999L)
        );

        verify(promptRepository, never()).save(any(Prompt.class));
    }

    @Test
    void testDeletePromptSuccess() {
        when(promptRepository.findById(1L)).thenReturn(Optional.of(testPrompt));

        promptService.deletePrompt(1L, 1L);

        verify(promptRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeletePromptNotFound() {
        when(promptRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(PromptNotFoundException.class, () ->
            promptService.deletePrompt(999L, 1L)
        );

        verify(promptRepository, never()).deleteById(any());
    }

    @Test
    void testDeletePromptUnauthorized() {
        when(promptRepository.findById(1L)).thenReturn(Optional.of(testPrompt));

        assertThrows(UnauthorizedException.class, () ->
            promptService.deletePrompt(1L, 999L)
        );

        verify(promptRepository, never()).deleteById(any());
    }
}
