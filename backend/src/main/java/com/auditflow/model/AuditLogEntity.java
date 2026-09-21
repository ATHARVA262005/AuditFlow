package com.auditflow.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_logs")
public class AuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String actor;

    @Column(nullable = false, length = 255)
    private String action;

    @Column(nullable = false, length = 255)
    private String resource;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(length = 255)
    private String details;

    @Column(length = 100)
    private String ipAddress;

    @Column(nullable = false)
    private Instant timestamp;

    public AuditLogEntity() {}

    public AuditLogEntity(Long id, String actor, String action, String resource, String status, String details, String ipAddress, Instant timestamp) {
        this.id = id;
        this.actor = actor;
        this.action = action;
        this.resource = resource;
        this.status = status;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    @PrePersist
    public void onCreate() {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public static AuditLogEntityBuilder builder() {
        return new AuditLogEntityBuilder();
    }

    public static class AuditLogEntityBuilder {
        private Long id;
        private String actor;
        private String action;
        private String resource;
        private String status;
        private String details;
        private String ipAddress;
        private Instant timestamp;

        public AuditLogEntityBuilder id(Long id) { this.id = id; return this; }
        public AuditLogEntityBuilder actor(String actor) { this.actor = actor; return this; }
        public AuditLogEntityBuilder action(String action) { this.action = action; return this; }
        public AuditLogEntityBuilder resource(String resource) { this.resource = resource; return this; }
        public AuditLogEntityBuilder status(String status) { this.status = status; return this; }
        public AuditLogEntityBuilder details(String details) { this.details = details; return this; }
        public AuditLogEntityBuilder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }
        public AuditLogEntityBuilder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }

        public AuditLogEntity build() {
            return new AuditLogEntity(id, actor, action, resource, status, details, ipAddress, timestamp);
        }
    }
}
