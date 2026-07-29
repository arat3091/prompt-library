package com.promptmanager.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Prompt entity.
 */
class PromptTest {

    @Test
    void testPromptCreation() {
        Prompt prompt = new Prompt("Test Title", "Test Content", "author");

        assertNotNull(prompt);
        assertEquals("Test Title", prompt.getTitle());
        assertEquals("Test Content", prompt.getContent());
        assertEquals("author", prompt.getAuthor());
    }

    @Test
    void testPromptWithDescription() {
        Prompt prompt = new Prompt();
        prompt.setTitle("Title");
        prompt.setContent("Content");
        prompt.setDescription("Description");
        prompt.setCategory("Category");

        assertEquals("Description", prompt.getDescription());
        assertEquals("Category", prompt.getCategory());
    }

    @Test
    void testPromptVersion() {
        Prompt prompt = new Prompt();
        assertEquals(1, prompt.getVersion());
    }

    @Test
    void testPromptEquality() {
        Prompt prompt1 = new Prompt();
        prompt1.setId(1L);

        Prompt prompt2 = new Prompt();
        prompt2.setId(1L);

        assertEquals(prompt1, prompt2);
    }

    @Test
    void testPromptInequality() {
        Prompt prompt1 = new Prompt();
        prompt1.setId(1L);

        Prompt prompt2 = new Prompt();
        prompt2.setId(2L);

        assertNotEquals(prompt1, prompt2);
    }
}
