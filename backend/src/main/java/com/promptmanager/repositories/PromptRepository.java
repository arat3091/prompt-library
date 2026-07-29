package com.promptmanager.repositories;

import com.promptmanager.models.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Prompt entity with CRUD operations.
 */
@Repository
public interface PromptRepository extends JpaRepository<Prompt, Long> {

    /**
     * Find all prompts by author.
     */
    List<Prompt> findByAuthor(String author);

    /**
     * Find all prompts by category.
     */
    List<Prompt> findByCategory(String category);

    /**
     * Find prompts by title containing (case-insensitive).
     */
    List<Prompt> findByTitleContainingIgnoreCase(String title);
}
