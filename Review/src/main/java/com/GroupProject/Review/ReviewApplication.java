package com.GroupProject.Review;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReviewApplication {

    private static final Logger logger = LoggerFactory.getLogger(ReviewApplication.class);

    public static void main(String[] args) {
        logger.info("Starting ReviewApplication...");
        SpringApplication.run(ReviewApplication.class, args);
        logger.info("ReviewApplication started successfully.");
    }
}
