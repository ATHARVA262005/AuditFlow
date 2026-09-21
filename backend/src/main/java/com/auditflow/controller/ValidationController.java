package com.auditflow.controller;

import com.auditflow.service.ValidationService;
import com.auditflow.validation.ValidationResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/validation")
public class ValidationController {

    private final ValidationService validationService;

    public ValidationController(ValidationService validationService) {
        this.validationService = validationService;
    }

    @PostMapping("/test")
    public ResponseEntity<ValidationResult> testValidation(@RequestBody Map<String, Object> payload) {
        String prompt = (String) payload.get("prompt");
        String result = (String) payload.get("result");
        String regexPattern = (String) payload.get("regexPattern");
        @SuppressWarnings("unchecked")
        List<String> requiredKeywords = (List<String>) payload.get("requiredKeywords");
        Boolean jsonFormatObj = (Boolean) payload.get("jsonFormat");
        boolean jsonFormat = jsonFormatObj != null && jsonFormatObj;

        ValidationResult res = validationService.validateText(prompt, result, regexPattern, requiredKeywords, jsonFormat);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/chapter/{id}")
    public ResponseEntity<?> validateChapter(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload) {
        try {
            String regexPattern = (String) payload.get("regexPattern");
            @SuppressWarnings("unchecked")
            List<String> requiredKeywords = (List<String>) payload.get("requiredKeywords");
            Boolean jsonFormatObj = (Boolean) payload.get("jsonFormat");
            boolean jsonFormat = jsonFormatObj != null && jsonFormatObj;

            ValidationResult res = validationService.validateChapter(id, regexPattern, requiredKeywords, jsonFormat);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
