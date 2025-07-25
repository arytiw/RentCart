package com.GroupProject.Support.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getGeminiResponse(String userMessage) throws Exception {
        logger.info("Sending message to Gemini API: {}", userMessage);

        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey;
        String requestBody = "{ \"contents\": [{ \"parts\": [{ \"text\": \"" + userMessage.replace("\"", "\\\"") + "\" }] }] }";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();

        logger.info("Received Gemini API response: {}", body);

        try {
            GeminiResponse geminiResponse = objectMapper.readValue(body, GeminiResponse.class);
            if (geminiResponse != null && geminiResponse.candidates != null && geminiResponse.candidates.length > 0 &&
                    geminiResponse.candidates[0].content != null && geminiResponse.candidates[0].content.parts != null &&
                    geminiResponse.candidates[0].content.parts.length > 0 && geminiResponse.candidates[0].content.parts[0].text != null) {
                String result = geminiResponse.candidates[0].content.parts[0].text;
                logger.info("Parsed Gemini response text: {}", result);
                return result;
            }
        } catch (Exception e) {
            logger.error("Error parsing Gemini response", e);
        }

        int errIdx = body.indexOf("\"message\":\"");
        if (errIdx != -1) {
            int start = errIdx + 11;
            int end = body.indexOf("\"", start);
            String errorMessage = "Gemini error: " + body.substring(start, end);
            logger.warn(errorMessage);
            return errorMessage;
        }

        String fallback = "Sorry, I couldn't parse the response from Gemini. Raw response: " + body;
        logger.warn(fallback);
        return fallback;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GeminiResponse {
        public Candidate[] candidates;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Candidate {
        public Content content;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Content {
        public Part[] parts;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Part {
        public String text;
    }
}
