package com.GroupProject.Support.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AiCallService {

    private final GeminiService geminiService;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String twilioAccountSid;
    private final String twilioAuthToken;
    private final String twilioFromNumber;
    private final String webhookBaseUrl;
    private final String authServiceUrl;
    private final boolean enabled;
    private final Map<String, String> callSidToEmail = new ConcurrentHashMap<>();
    private final Map<String, List<Map<String, String>>> callTranscripts = new ConcurrentHashMap<>();
    private final Map<String, String> callSidToPhone = new ConcurrentHashMap<>();

    public AiCallService(GeminiService geminiService,
                         @Value("${twilio.account.sid:}") String twilioAccountSid,
                         @Value("${twilio.auth.token:}") String twilioAuthToken,
                         @Value("${twilio.phone.number:}") String twilioFromNumber,
                         @Value("${support.public-base-url:}") String webhookBaseUrl,
                         @Value("${support.auth-service.url:http://localhost:8081}") String authServiceUrl,
                         @Value("${ai.call.agent.enabled:true}") boolean enabled) {
        this.geminiService = geminiService;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(8)).build();
        this.objectMapper = new ObjectMapper();
        this.twilioAccountSid = twilioAccountSid;
        this.twilioAuthToken = twilioAuthToken;
        this.twilioFromNumber = twilioFromNumber;
        this.webhookBaseUrl = webhookBaseUrl;
        this.authServiceUrl = authServiceUrl;
        this.enabled = enabled;
    }

    public Map<String, Object> triggerCall(String phoneNumber, String initialQuestion, String userEmail) throws Exception {
        if (!enabled) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "AI call agent integration is disabled");
        }

        String normalized = normalizePhoneNumber(phoneNumber);
        validateTwilioConfiguration();

        String resolvedUserEmail = (userEmail == null || userEmail.isBlank())
                ? resolveUserEmailByPhone(normalized)
                : userEmail.trim();

        String resolvedBaseUrl = getEffectiveWebhookBaseUrl();
        String voiceWebhookUrl = resolvedBaseUrl + "/api/support/voice";
        String statusWebhookUrl = resolvedBaseUrl + "/api/support/voice/status";
        String encodedTo = URLEncoder.encode(normalized, StandardCharsets.UTF_8);
        String encodedFrom = URLEncoder.encode(twilioFromNumber, StandardCharsets.UTF_8);
        String encodedUrl = URLEncoder.encode(voiceWebhookUrl, StandardCharsets.UTF_8);
        String encodedStatusUrl = URLEncoder.encode(statusWebhookUrl, StandardCharsets.UTF_8);

        String formBody = "To=" + encodedTo +
                "&From=" + encodedFrom +
                "&Url=" + encodedUrl +
                "&Method=POST" +
                "&StatusCallback=" + encodedStatusUrl +
                "&StatusCallbackMethod=POST" +
                "&StatusCallbackEvent=initiated" +
                "&StatusCallbackEvent=ringing" +
                "&StatusCallbackEvent=answered" +
                "&StatusCallbackEvent=completed";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + twilioAccountSid + "/Calls.json"))
                .header("Authorization", "Basic " + getTwilioBasicAuth())
                .header("Content-Type", "application/x-www-form-urlencoded")
                .timeout(Duration.ofSeconds(20))
                .POST(HttpRequest.BodyPublishers.ofString(formBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("Twilio call creation failed: HTTP " + response.statusCode() + " - " + response.body());
        }

        JsonNode node = objectMapper.readTree(response.body());
        String callSid = node.path("sid").asText("");
        if (!callSid.isBlank() && resolvedUserEmail != null && !resolvedUserEmail.isBlank()) {
            callSidToEmail.put(callSid, resolvedUserEmail);
        }
        if (!callSid.isBlank()) {
            callSidToPhone.put(callSid, normalized);
            appendTranscript(callSid, "system", "Call initiated to " + normalized);
        }

        return Map.of(
                "success", true,
                "mode", "twilio-live-call",
                "phoneNumber", normalized,
                "callSid", callSid,
                "userEmail", resolvedUserEmail == null ? "" : resolvedUserEmail,
                "publicBaseUrl", resolvedBaseUrl,
                "message", "Live AI support call started. You should receive a call shortly."
        );
    }

    public Map<String, Object> getStatus() {
        if (!enabled) {
            return Map.of("success", false, "message", "AI call agent integration is disabled");
        }

        return Map.of(
                "success", true,
                "mode", "twilio-live-call",
                "message", "Ready for live calls via Twilio with RentCart data context.",
                "configured", isTwilioConfigured(),
                "publicBaseUrl", getEffectiveWebhookBaseUrlSafe()
        );
    }

    public String buildVoiceGreetingTwiml(String callSid, String toPhone) {
        String userEmail = findUserEmailForCall(callSid, toPhone);
        String greeting = "Hello. Welcome to RentCart support. I can help with your orders, rentals, and listed items.";
        if (userEmail != null && !userEmail.isBlank()) {
            greeting += " I found your account and can answer using your RentCart details.";
        }
        if (callSid != null && !callSid.isBlank()) {
            appendTranscript(callSid, "assistant", greeting);
        }
        return buildGatherTwiml(greeting, "How can I help you today?");
    }

    public String buildVoiceReplyTwiml(String callSid, String toPhone, String speechInput) throws Exception {
        String input = speechInput == null ? "" : speechInput.trim();
        if (input.isBlank()) {
            return buildGatherTwiml("I did not catch that.", "Please repeat your RentCart question.");
        }
        if (callSid != null && !callSid.isBlank()) {
            appendTranscript(callSid, "user", input);
        }

        String lower = input.toLowerCase();
        if (lower.contains("bye") || lower.contains("goodbye") || lower.contains("stop")) {
            if (callSid != null && !callSid.isBlank()) {
                appendTranscript(callSid, "assistant", "Thanks for calling RentCart support. Goodbye.");
            }
            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response><Say>Thanks for calling RentCart support. Goodbye.</Say><Hangup/></Response>";
        }

        String userEmail = findUserEmailForCall(callSid, toPhone);
        String aiText = geminiService.getGeminiResponse(input, userEmail);
        String clean = sanitizeForSpeech(aiText);
        if (callSid != null && !callSid.isBlank()) {
            appendTranscript(callSid, "assistant", clean);
        }
        return buildGatherTwiml(clean, "Do you have another RentCart question?");
    }

    public void recordCallStatus(String callSid, String status) {
        if (callSid == null || callSid.isBlank() || status == null || status.isBlank()) {
            return;
        }
        appendTranscript(callSid, "system", "Call status: " + status);
    }

    public Map<String, Object> getCallTranscript(String callSid) {
        if (callSid == null || callSid.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "callSid is required");
        }
        List<Map<String, String>> transcript = callTranscripts.getOrDefault(callSid, List.of());
        return Map.of(
                "success", true,
                "callSid", callSid,
                "phoneNumber", callSidToPhone.getOrDefault(callSid, ""),
                "userEmail", callSidToEmail.getOrDefault(callSid, ""),
                "turns", transcript
        );
    }

    private String findUserEmailForCall(String callSid, String toPhone) {
        if (callSid != null && callSidToEmail.containsKey(callSid)) {
            return callSidToEmail.get(callSid);
        }
        String resolved = resolveUserEmailByPhone(normalizePhoneNumberSafe(toPhone));
        if (callSid != null && resolved != null && !resolved.isBlank()) {
            callSidToEmail.put(callSid, resolved);
        }
        return resolved;
    }

    private String buildGatherTwiml(String sayText, String followUpPrompt) {
        String action = getEffectiveWebhookBaseUrlSafe() + "/api/support/voice/handle";
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                + "<Response>"
                + "<Gather input=\"speech\" action=\"" + xmlEscape(action) + "\" method=\"POST\" language=\"en-US\" speechTimeout=\"auto\">"
                + "<Say voice=\"alice\">" + xmlEscape(sayText) + "</Say>"
                + "<Pause length=\"1\"/>"
                + "<Say voice=\"alice\">" + xmlEscape(followUpPrompt) + "</Say>"
                + "</Gather>"
                + "<Say voice=\"alice\">I did not receive any response. Goodbye.</Say>"
                + "</Response>";
    }

    private String sanitizeForSpeech(String text) {
        if (text == null || text.isBlank()) {
            return "I am sorry, I could not find that detail right now.";
        }
        return text
                .replace("**", "")
                .replace("*", "")
                .replace("`", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String resolveUserEmailByPhone(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return null;
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(authServiceUrl + "/auth/users"))
                    .timeout(Duration.ofSeconds(8))
                    .header("Accept", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return null;
            }

            JsonNode users = objectMapper.readTree(response.body());
            if (!users.isArray()) {
                return null;
            }

            for (JsonNode user : users) {
                String candidatePhone = normalizePhoneNumberSafe(user.path("phoneNumber").asText(""));
                if (candidatePhone != null && candidatePhone.equals(phoneNumber)) {
                    String email = user.path("emailId").asText("");
                    return email.isBlank() ? null : email;
                }
            }
            return null;
        } catch (Exception ignored) {
            return null;
        }
    }

    private String getTwilioBasicAuth() {
        String raw = twilioAccountSid + ":" + twilioAuthToken;
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    private void validateTwilioConfiguration() {
        if (!isTwilioConfigured()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER and provide SUPPORT_PUBLIC_BASE_URL or run ngrok."
            );
        }
    }

    private boolean isTwilioConfigured() {
        return !isBlank(twilioAccountSid) && !isBlank(twilioAuthToken) && !isBlank(twilioFromNumber);
    }

    private String getEffectiveWebhookBaseUrl() {
        if (!isBlank(webhookBaseUrl)) {
            return webhookBaseUrl.trim();
        }
        String detected = detectNgrokUrl();
        if (!isBlank(detected)) {
            return detected;
        }
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "No public URL available. Start ngrok for port 9093 or set SUPPORT_PUBLIC_BASE_URL."
        );
    }

    private String getEffectiveWebhookBaseUrlSafe() {
        if (!isBlank(webhookBaseUrl)) {
            return webhookBaseUrl.trim();
        }
        String detected = detectNgrokUrl();
        return isBlank(detected) ? "" : detected;
    }

    private String detectNgrokUrl() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://127.0.0.1:4040/api/tunnels"))
                    .timeout(Duration.ofSeconds(2))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return "";
            }
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode tunnels = root.path("tunnels");
            if (!tunnels.isArray()) {
                return "";
            }
            for (JsonNode tunnel : tunnels) {
                if ("https".equalsIgnoreCase(tunnel.path("proto").asText(""))) {
                    return tunnel.path("public_url").asText("");
                }
            }
            if (tunnels.size() > 0) {
                return tunnels.get(0).path("public_url").asText("");
            }
            return "";
        } catch (Exception ignored) {
            return "";
        }
    }

    private String normalizePhoneNumber(String phoneNumber) {
        String trimmed = phoneNumber.trim().replaceAll("\\s+", "");
        if (!trimmed.matches("^\\+?[0-9]{10,15}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid phone number. Use format like +919876543210");
        }
        return trimmed.startsWith("+") ? trimmed : "+" + trimmed;
    }

    private String normalizePhoneNumberSafe(String phoneNumber) {
        try {
            if (phoneNumber == null || phoneNumber.isBlank()) return null;
            return normalizePhoneNumber(phoneNumber);
        } catch (Exception ignored) {
            return null;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String xmlEscape(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }

    private void appendTranscript(String callSid, String role, String text) {
        if (callSid == null || callSid.isBlank() || text == null || text.isBlank()) {
            return;
        }
        callTranscripts.computeIfAbsent(callSid, key -> new CopyOnWriteArrayList<>());
        Map<String, String> turn = new LinkedHashMap<>();
        turn.put("timestamp", Instant.now().toString());
        turn.put("role", role);
        turn.put("text", text);
        callTranscripts.get(callSid).add(turn);
        trimTranscript(callSid);
    }

    private void trimTranscript(String callSid) {
        List<Map<String, String>> turns = callTranscripts.get(callSid);
        if (turns == null || turns.size() <= 100) {
            return;
        }
        List<Map<String, String>> trimmed = new ArrayList<>(turns.subList(turns.size() - 100, turns.size()));
        callTranscripts.put(callSid, new CopyOnWriteArrayList<>(trimmed));
    }
}
