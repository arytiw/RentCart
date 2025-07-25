package com.GroupProject.Support.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GroupProject.Support.service.GeminiService;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    public String chat(@RequestBody ChatRequest request) {
        logger.info("Received chat message: {}", request.getMessage());
        try {
            String response = geminiService.getGeminiResponse(request.getMessage());
            logger.info("Sending chat response: {}", response);
            return response;
        } catch (Exception e) {
            logger.error("Error processing chat request", e);
            return "Error: " + e.getMessage();
        }
    }

    public static class ChatRequest {
        private String message;
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
