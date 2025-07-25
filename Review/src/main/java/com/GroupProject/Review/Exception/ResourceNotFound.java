package com.GroupProject.Review.Exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ResourceNotFound extends RuntimeException {

    private static final Logger logger = LoggerFactory.getLogger(ResourceNotFound.class);

    public ResourceNotFound(String message) {
        super(message);
        logger.warn("ResourceNotFound Exception thrown: {}", message);
    }
}
