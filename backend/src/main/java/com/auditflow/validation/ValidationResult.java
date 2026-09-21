package com.auditflow.validation;

import java.util.ArrayList;
import java.util.List;

public class ValidationResult {
    private boolean passed;
    private String status; // PASSED, FAILED, THREAT_DETECTED, SKIPPED
    private String message;
    private List<String> layerResults = new ArrayList<>();
    private List<String> detectedThreats = new ArrayList<>();
    private List<String> piiEntitiesFound = new ArrayList<>();

    public ValidationResult() {}

    public ValidationResult(boolean passed, String status, String message, List<String> layerResults, List<String> detectedThreats, List<String> piiEntitiesFound) {
        this.passed = passed;
        this.status = status;
        this.message = message;
        this.layerResults = layerResults != null ? layerResults : new ArrayList<>();
        this.detectedThreats = detectedThreats != null ? detectedThreats : new ArrayList<>();
        this.piiEntitiesFound = piiEntitiesFound != null ? piiEntitiesFound : new ArrayList<>();
    }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getLayerResults() { return layerResults; }
    public void setLayerResults(List<String> layerResults) { this.layerResults = layerResults; }

    public List<String> getDetectedThreats() { return detectedThreats; }
    public void setDetectedThreats(List<String> detectedThreats) { this.detectedThreats = detectedThreats; }

    public List<String> getPiiEntitiesFound() { return piiEntitiesFound; }
    public void setPiiEntitiesFound(List<String> piiEntitiesFound) { this.piiEntitiesFound = piiEntitiesFound; }

    public static ValidationResultBuilder builder() {
        return new ValidationResultBuilder();
    }

    public static class ValidationResultBuilder {
        private boolean passed;
        private String status;
        private String message;
        private List<String> layerResults = new ArrayList<>();
        private List<String> detectedThreats = new ArrayList<>();
        private List<String> piiEntitiesFound = new ArrayList<>();

        public ValidationResultBuilder passed(boolean passed) { this.passed = passed; return this; }
        public ValidationResultBuilder status(String status) { this.status = status; return this; }
        public ValidationResultBuilder message(String message) { this.message = message; return this; }
        public ValidationResultBuilder layerResults(List<String> layerResults) { this.layerResults = layerResults; return this; }
        public ValidationResultBuilder detectedThreats(List<String> detectedThreats) { this.detectedThreats = detectedThreats; return this; }
        public ValidationResultBuilder piiEntitiesFound(List<String> piiEntitiesFound) { this.piiEntitiesFound = piiEntitiesFound; return this; }

        public ValidationResult build() {
            return new ValidationResult(passed, status, message, layerResults, detectedThreats, piiEntitiesFound);
        }
    }
}
