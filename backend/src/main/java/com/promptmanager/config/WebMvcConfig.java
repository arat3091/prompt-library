package com.promptmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration for API-only backend.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    // Use default configuration - Spring will route all requests to controllers
}
