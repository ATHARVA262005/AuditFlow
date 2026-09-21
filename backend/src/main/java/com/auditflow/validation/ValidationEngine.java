package com.auditflow.validation;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ValidationEngine {

    private final Layer1SchemaValidator layer1;
    private final Layer2RegexValidator layer2;
    private final Layer3PiiDetector layer3;
    private final Layer4PromptInjectionDetector layer4;

    public ValidationEngine(
            Layer1SchemaValidator layer1,
            Layer2RegexValidator layer2,
            Layer3PiiDetector layer3,
            Layer4PromptInjectionDetector layer4) {
        this.layer1 = layer1;
        this.layer2 = layer2;
        this.layer3 = layer3;
        this.layer4 = layer4;
    }

    public ValidationResult validate(String prompt, String result) {
        return validate(prompt, result, null, null, false);
    }

    public ValidationResult validate(String prompt, String result, String regexPattern, List<String> requiredKeywords, boolean jsonFormat) {
        List<String> layerLogs = new ArrayList<>();
        List<String> threats = new ArrayList<>();
        List<String> piiFound = new ArrayList<>();
        boolean passed = true;

        // Layer 4: Prompt Injection Check
        List<String> promptThreats = layer4.detectInjections(prompt);
        if (!promptThreats.isEmpty()) {
            passed = false;
            threats.addAll(promptThreats);
            layerLogs.add("Layer 4 (Security): Threat detected in prompt - " + String.join(", ", promptThreats));
        } else {
            layerLogs.add("Layer 4 (Security): Passed");
        }

        // Layer 3: PII Detection in Prompt and Result
        List<String> piiPrompt = layer3.detectPii(prompt);
        List<String> piiResult = layer3.detectPii(result);
        piiFound.addAll(piiPrompt);
        piiFound.addAll(piiResult);
        if (!piiFound.isEmpty()) {
            layerLogs.add("Layer 3 (PII): Detected sensitive data - " + String.join(", ", piiFound));
        } else {
            layerLogs.add("Layer 3 (PII): Clean");
        }

        // Layer 2: Regex Gate Evaluation
        if (regexPattern != null && !regexPattern.isBlank()) {
            try {
                boolean matches = layer2.validatePattern(result, regexPattern, 1500);
                if (!matches) {
                    passed = false;
                    layerLogs.add("Layer 2 (Regex): Output failed pattern '" + regexPattern + "'");
                } else {
                    layerLogs.add("Layer 2 (Regex): Matched pattern '" + regexPattern + "'");
                }
            } catch (Exception e) {
                passed = false;
                layerLogs.add("Layer 2 (Regex Error): " + e.getMessage());
            }
        }

        // Layer 1: Schema / JSON Format check & Keyword checks
        if (jsonFormat) {
            if (!layer1.isJsonValid(result)) {
                passed = false;
                layerLogs.add("Layer 1 (Schema): Output is not valid JSON");
            } else {
                layerLogs.add("Layer 1 (Schema): Valid JSON format");
            }
        }

        if (requiredKeywords != null && !requiredKeywords.isEmpty() && result != null) {
            List<String> missing = new ArrayList<>();
            for (String kw : requiredKeywords) {
                if (!result.toLowerCase().contains(kw.toLowerCase())) {
                    missing.add(kw);
                }
            }
            if (!missing.isEmpty()) {
                passed = false;
                layerLogs.add("Layer 1 (Keywords): Missing mandatory keywords: " + String.join(", ", missing));
            } else {
                layerLogs.add("Layer 1 (Keywords): All required keywords present");
            }
        }

        String finalStatus = !threats.isEmpty() ? "THREAT_DETECTED" : (passed ? "PASSED" : "FAILED");
        String finalMsg = passed ? "Validation passed across all active layers." : String.join(" | ", layerLogs);

        return ValidationResult.builder()
                .passed(passed)
                .status(finalStatus)
                .message(finalMsg)
                .layerResults(layerLogs)
                .detectedThreats(threats)
                .piiEntitiesFound(piiFound)
                .build();
    }
}
