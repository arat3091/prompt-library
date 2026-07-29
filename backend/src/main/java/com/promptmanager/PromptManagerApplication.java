package com.promptmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Main entry point for Prompt Manager Spring Boot application.
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.promptmanager"})
public class PromptManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PromptManagerApplication.class, args);
    }

}
