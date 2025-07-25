package com.GroupProject.Support;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SupportApplication {

    private static final Logger logger = LoggerFactory.getLogger(SupportApplication.class);

    public static void main(String[] args) {
        logger.info("Starting SupportApplication...");
        SpringApplication.run(SupportApplication.class, args);
        logger.info("SupportApplication started successfully.");
    }

}
