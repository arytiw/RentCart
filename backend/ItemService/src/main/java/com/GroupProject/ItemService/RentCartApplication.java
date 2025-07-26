package com.GroupProject.ItemService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RentCartApplication {

	private static final Logger logger = LoggerFactory.getLogger(RentCartApplication.class);

	public static void main(String[] args) {
		logger.info("Starting RentCartApplication...");
		SpringApplication.run(RentCartApplication.class, args);
		logger.info("RentCartApplication started successfully.");
	}
}
