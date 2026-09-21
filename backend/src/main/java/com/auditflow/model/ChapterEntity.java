package com.auditflow.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "chapters")
public class ChapterEntity {

    @Id
    private String id; // e.g. c_001

    @Column(nullable = false, length = 50000, updatable = false)
    private String prompt;

    @Column(nullable = false, length = 50000, updatable = false)
    private String result;

    @Column(nullable = false, length = 255, updatable = false)
    private String actor;

    @Column(nullable = false, length = 255, updatable = false)
    private String source;

    @Column(length = 255, updatable = false)
    private String model;

    @Column(updatable = false)
    private Double temperature;

    @Column(updatable = false)
    private Long seed;

    @Column(length = 50)
    private String validationStatus;

    @Column(length = 2000)
    private String validationMessage;

    @Column(columnDefinition = "TEXT")
    private String metadataJson;

    @Column(nullable = false, updatable = false)
    private Instant timestamp;

    public ChapterEntity() {}

    public ChapterEntity(String id, String prompt, String result, String actor, String source, String model, Double temperature, Long seed, String validationStatus, String validationMessage, String metadataJson, Instant timestamp) {
        this.id = id;
        this.prompt = prompt;
        this.result = result;
        this.actor = actor;
        this.source = source;
        this.model = model;
        this.temperature = temperature;
        this.seed = seed;
        this.validationStatus = validationStatus;
        this.validationMessage = validationMessage;
        this.metadataJson = metadataJson;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    @PrePersist
    public void onCreate() {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
        if (actor == null) {
            actor = "anonymous";
        }
        if (source == null) {
            source = "manual";
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Long getSeed() { return seed; }
    public void setSeed(Long seed) { this.seed = seed; }

    public String getValidationStatus() { return validationStatus; }
    public void setValidationStatus(String validationStatus) { this.validationStatus = validationStatus; }

    public String getValidationMessage() { return validationMessage; }
    public void setValidationMessage(String validationMessage) { this.validationMessage = validationMessage; }

    public String getMetadataJson() { return metadataJson; }
    public void setMetadataJson(String metadataJson) { this.metadataJson = metadataJson; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public static ChapterEntityBuilder builder() {
        return new ChapterEntityBuilder();
    }

    public static class ChapterEntityBuilder {
        private String id;
        private String prompt;
        private String result;
        private String actor;
        private String source;
        private String model;
        private Double temperature;
        private Long seed;
        private String validationStatus;
        private String validationMessage;
        private String metadataJson;
        private Instant timestamp;

        public ChapterEntityBuilder id(String id) { this.id = id; return this; }
        public ChapterEntityBuilder prompt(String prompt) { this.prompt = prompt; return this; }
        public ChapterEntityBuilder result(String result) { this.result = result; return this; }
        public ChapterEntityBuilder actor(String actor) { this.actor = actor; return this; }
        public ChapterEntityBuilder source(String source) { this.source = source; return this; }
        public ChapterEntityBuilder model(String model) { this.model = model; return this; }
        public ChapterEntityBuilder temperature(Double temperature) { this.temperature = temperature; return this; }
        public ChapterEntityBuilder seed(Long seed) { this.seed = seed; return this; }
        public ChapterEntityBuilder validationStatus(String validationStatus) { this.validationStatus = validationStatus; return this; }
        public ChapterEntityBuilder validationMessage(String validationMessage) { this.validationMessage = validationMessage; return this; }
        public ChapterEntityBuilder metadataJson(String metadataJson) { this.metadataJson = metadataJson; return this; }
        public ChapterEntityBuilder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }

        public ChapterEntity build() {
            return new ChapterEntity(id, prompt, result, actor, source, model, temperature, seed, validationStatus, validationMessage, metadataJson, timestamp);
        }
    }
}
