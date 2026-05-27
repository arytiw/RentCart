package com.GroupProject.Support.service;

import java.time.Duration;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

@Service
public class GeminiService {
    @Value("${gemini.api.key:}")
    private String apiKey;
    @Value("${gemini.model:gemini-2.5-flash-lite}")
    private String geminiModel;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    @Value("${support.order-service.url:http://localhost:9092}")
    private String orderServiceUrl;

    @Value("${support.item-service.url:http://localhost:9091}")
    private String itemServiceUrl;

    @Value("${support.auth-service.url:http://localhost:8081}")
    private String authServiceUrl;

    public String getGeminiResponse(String userMessage) throws Exception {
        return getGeminiResponse(userMessage, null);
    }

    public String getGeminiResponse(String userMessage, String userEmail) throws Exception {
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + apiKey;

        String rentCartContext = fetchRentCartContext(userEmail);
        String customPrompt = """
                You are RentCart's customer support AI assistant.
                Strict rules:
                - Answer ONLY RentCart-related questions (items, rentals, orders, delivery, cancellation, payment, account).
                - If user asks general unrelated question, politely refuse and redirect to RentCart support.
                - Keep response short (2-3 sentences), direct, and actionable.
                - Never invent data. If context has no matching data, say so clearly.
                - Prefer practical next steps.

                Live RentCart context from Mongo-backed services:
                %s

                User question:
                %s
                """.formatted(rentCartContext, userMessage);

        Map<String, Object> requestPayload = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{Map.of("text", customPrompt)})
                }
        );
        String requestBody = objectMapper.writeValueAsString(requestPayload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();

        System.out.println("Gemini API response: " + body);

        try {
            GeminiResponse geminiResponse = objectMapper.readValue(body, GeminiResponse.class);
            if (geminiResponse != null && geminiResponse.candidates != null && geminiResponse.candidates.length > 0 &&
                    geminiResponse.candidates[0].content != null && geminiResponse.candidates[0].content.parts != null &&
                    geminiResponse.candidates[0].content.parts.length > 0 && geminiResponse.candidates[0].content.parts[0].text != null) {
                return geminiResponse.candidates[0].content.parts[0].text;
            }
        } catch (Exception e) {
            System.err.println("Error parsing Gemini response: " + e.getMessage());
        }

        int errIdx = body.indexOf("\"message\":\"");
        if (errIdx != -1) {
            int start = errIdx + 11;
            int end = body.indexOf("\"", start);
            return "Gemini error: " + body.substring(start, end);
        }

        return "Sorry, I couldn't parse the response from Gemini. Raw response: " + body;
    }

    private String fetchRentCartContext(String userEmail) {
        Map<String, String> context = new HashMap<>();
        context.put("userEmail", userEmail == null ? "" : userEmail);
        context.put("sampleItems", fetchJsonSnippet(itemServiceUrl + "/items"));
        context.put("userProfile", userEmail == null || userEmail.isBlank()
                ? "No user email provided."
                : fetchJsonSnippet(authServiceUrl + "/auth/user?email=" + URLEncoder.encode(userEmail.trim(), StandardCharsets.UTF_8)));
        if (userEmail != null && !userEmail.isBlank()) {
            String encodedEmail = URLEncoder.encode(userEmail.trim(), StandardCharsets.UTF_8);
            context.put("userOrders", fetchUserOrders(userEmail.trim()));
            context.put("userItems", fetchJsonSnippet(itemServiceUrl + "/items/user/" + encodedEmail));
        } else {
            context.put("userOrders", "No user email provided. Personalized order lookup not available.");
            context.put("userItems", "No user email provided.");
        }

        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(context);
        } catch (Exception ignored) {
            return context.toString();
        }
    }

    private String fetchJsonSnippet(String url) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(6))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return "Unavailable (" + response.statusCode() + ")";
            }

            JsonNode node = objectMapper.readTree(response.body());
            return objectMapper.writeValueAsString(limitArray(node, 5));
        } catch (Exception e) {
            return "Unavailable (" + e.getMessage() + ")";
        }
    }

    private String fetchUserOrders(String userEmail) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(orderServiceUrl + "/orders"))
                    .timeout(Duration.ofSeconds(6))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return "Unavailable (" + response.statusCode() + ")";
            }

            JsonNode allOrdersNode = objectMapper.readTree(response.body());
            if (!allOrdersNode.isArray()) {
                return "Unexpected order payload";
            }

            List<JsonNode> filtered = new ArrayList<>();
            for (JsonNode orderNode : allOrdersNode) {
                String orderUserId = orderNode.path("userId").asText("");
                if (userEmail.equalsIgnoreCase(orderUserId)) {
                    filtered.add(orderNode);
                }
            }

            ArrayNode result = objectMapper.createArrayNode();
            for (int i = 0; i < Math.min(5, filtered.size()); i++) {
                result.add(filtered.get(i));
            }
            return objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            return "Unavailable (" + e.getMessage() + ")";
        }
    }

    private JsonNode limitArray(JsonNode node, int maxItems) {
        if (!node.isArray() || node.size() <= maxItems) {
            return node;
        }
        ArrayNode source = (ArrayNode) node;
        ArrayNode trimmed = objectMapper.createArrayNode();
        for (int i = 0; i < maxItems; i++) {
            trimmed.add(source.get(i));
        }
        return trimmed;
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