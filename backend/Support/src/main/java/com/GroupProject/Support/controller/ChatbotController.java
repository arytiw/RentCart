package com.GroupProject.Support.controller;

import com.GroupProject.Support.service.GeminiService;
import com.GroupProject.Support.service.AiCallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
public class ChatbotController {
    @Autowired
    private GeminiService geminiService;
    @Autowired
    private AiCallService aiCallService;

    @PostMapping("/chat")
    public String chat(@RequestBody ChatRequest request) {
        try {
            return geminiService.getGeminiResponse(request.getMessage(), request.getUserEmail());
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/call")
    public ResponseEntity<Map<String, Object>> requestAiCall(@RequestBody CallRequest request) {
        if (request == null || request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "phoneNumber is required"
            ));
        }

        try {
            Map<String, Object> result = aiCallService.triggerCall(
                    request.getPhoneNumber().trim(),
                    request.getQuestion(),
                    request.getUserEmail()
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of(
                    "success", false,
                    "message", "Failed to connect AI call agent",
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/call/status")
    public ResponseEntity<Map<String, Object>> getAiCallStatus() {
        try {
            return ResponseEntity.ok(aiCallService.getStatus());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of(
                    "success", false,
                    "message", "Failed to fetch AI call agent status",
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping(value = "/voice", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> voiceWebhook(@RequestParam(value = "CallSid", required = false) String callSid,
                                               @RequestParam(value = "To", required = false) String toPhone) {
        String twiml = aiCallService.buildVoiceGreetingTwiml(callSid, toPhone);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_XML).body(twiml);
    }

    @PostMapping(value = "/voice/handle", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> voiceHandleWebhook(@RequestParam(value = "CallSid", required = false) String callSid,
                                                     @RequestParam(value = "To", required = false) String toPhone,
                                                     @RequestParam(value = "SpeechResult", required = false) String speechResult) {
        try {
            String twiml = aiCallService.buildVoiceReplyTwiml(callSid, toPhone, speechResult);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_XML).body(twiml);
        } catch (Exception e) {
            String fallback = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response><Say>Sorry, I hit an error while processing your request. Please try again later.</Say><Hangup/></Response>";
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_XML).body(fallback);
        }
    }

    @PostMapping("/voice/status")
    public ResponseEntity<Void> voiceStatusWebhook(@RequestParam(value = "CallSid", required = false) String callSid,
                                                   @RequestParam(value = "CallStatus", required = false) String callStatus) {
        aiCallService.recordCallStatus(callSid, callStatus);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/call/transcript")
    public ResponseEntity<Map<String, Object>> getCallTranscript(@RequestParam("callSid") String callSid) {
        return ResponseEntity.ok(aiCallService.getCallTranscript(callSid));
    }

    public static class ChatRequest {
        private String message;
        private String userEmail;
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    }

    public static class CallRequest {
        private String phoneNumber;
        private String question;
        private String userEmail;

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getUserEmail() {
            return userEmail;
        }

        public void setUserEmail(String userEmail) {
            this.userEmail = userEmail;
        }
    }
} 