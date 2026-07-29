package com.promptmanager.services;

import com.promptmanager.dto.CreatePromptRequest;
import com.promptmanager.dto.PageResponse;
import com.promptmanager.dto.PromptResponse;
import com.promptmanager.dto.UpdatePromptRequest;
import com.promptmanager.exceptions.PromptNotFoundException;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for PromptService.
 */
@ExtendWith(MockitoExtension.class)
class PromptServiceTest {

    @Mock
    private PromptRepository promptRepository;

    @InjectMocks
    private PromptService promptService;

    private CreatePromptRequest createRequest;
    private UpdatePromptRequest updateRequest;
    private Prompt mockPrompt;

    @BeforeEach
    void setUp() {
        createRequest = new CreatePromptRequest();
        createRequest.setTitle("Test Title");
        createRequest.setContent("Test Content");
        createRequest.setDescription("Test Description");
        createRequest.setCategory("Test Category");

        updateRequest = new UpdatePromptRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setContent("Updated Content");
        updateRequest.setDescription("Updated Description");
        updateRequest.setCategory("Updated Category");

        mockPrompt = new Prompt();
        mockPrompt.setId(1L);
        mockPrompt.setTitle("Test Title");
        mockPrompt.setContent("Test Content");
        mockPrompt.setAuthor("system");
        mockPrompt.setCreatedAt(LocalDateTime.now());
        mockPrompt.setUpdatedAt(LocalDateTime.now());
        mockPrompt.setVersion(1);
    }

    @Test
    void testCreatePrompt() {
        when(promptRepository.save(any(Prompt.class))).thenReturn(mockPrompt);

        PromptResponse response = promptService.createPrompt(createRequest);

        assertNotNull(response);
        assertEquals("Test Title", response.getTitle());
        assertEquals("Test Content", response.getContent());
        verify(promptRepository, times(1)).save(any(Prompt.class));
    }

    @Test
    void testGetPromptById() {
        when(promptRepository.findById(1L)).thenReturn(Optional.of(mockPrompt));

        PromptResponse response = promptService.getPromptById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Title", response.getTitle());
        verify(promptRepository, times(1)).findById(1L);
    }

    @Test
    void testGetPromptByIdNotFound() {
        when(promptRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(PromptNotFoundException.class, () -> promptService.getPromptById(999L));
        verify(promptRepository, times(1)).findById(999L);
    }

    @Test
    void testGetAllPrompts() {
        List<Prompt> prompts = new ArrayList<>();
        prompts.add(mockPrompt);

        Page<Prompt> page = new PageImpl<>(prompts, PageRequest.of(0, 20), 1);
        when(promptRepository.findAll(any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        PageResponse<PromptResponse> response = promptService.getAllPrompts(0, 20, "createdAt", "desc");

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(0, response.getCurrentPage());
        assertEquals(20, response.getPageSize());
        verify(promptRepository, times(1)).findAll(any(org.springframework.data.domain.Pageable.class));
    }

    @Test
    void testUpdatePrompt() {
        when(promptRepository.findById(1L)).thenReturn(Optional.of(mockPrompt));
        when(promptRepository.save(any(Prompt.class))).thenReturn(mockPrompt);

        PromptResponse response = promptService.updatePrompt(1L, updateRequest);

        assertNotNull(response);
        assertEquals("Updated Title", response.getTitle());
        verify(promptRepository, times(1)).findById(1L);
        verify(promptRepository, times(1)).save(any(Prompt.class));
    }

    @Test
    void testUpdatePromptNotFound() {
        when(promptRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(PromptNotFoundException.class, () -> promptService.updatePrompt(999L, updateRequest));
        verify(promptRepository, times(1)).findById(999L);
    }

    @Test
    void testDeletePrompt() {
        when(promptRepository.existsById(1L)).thenReturn(true);

        promptService.deletePrompt(1L);

        verify(promptRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeletePromptNotFound() {
        when(promptRepository.existsById(999L)).thenReturn(false);

        assertThrows(PromptNotFoundException.class, () -> promptService.deletePrompt(999L));
        verify(promptRepository, times(0)).deleteById(any());
    }
}
