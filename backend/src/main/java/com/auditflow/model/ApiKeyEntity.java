package com.auditflow.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "api_keys")
public class ApiKeyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String keyPrefix;

    @Column(nullable = false, unique = true, length = 255)
    private String keyHash;

    @Column(nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Instant createdAt;

    public ApiKeyEntity() {}

    public ApiKeyEntity(Long id, String keyPrefix, String keyHash, String name, Role role, Boolean active, Instant createdAt) {
        this.id = id;
        this.keyPrefix = keyPrefix;
        this.keyHash = keyHash;
        this.name = name;
        this.role = role;
        this.active = active != null ? active : true;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getKeyPrefix() { return keyPrefix; }
    public void setKeyPrefix(String keyPrefix) { this.keyPrefix = keyPrefix; }

    public String getKeyHash() { return keyHash; }
    public void setKeyHash(String keyHash) { this.keyHash = keyHash; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static ApiKeyEntityBuilder builder() {
        return new ApiKeyEntityBuilder();
    }

    public static class ApiKeyEntityBuilder {
        private Long id;
        private String keyPrefix;
        private String keyHash;
        private String name;
        private Role role;
        private Boolean active = true;
        private Instant createdAt;

        public ApiKeyEntityBuilder id(Long id) { this.id = id; return this; }
        public ApiKeyEntityBuilder keyPrefix(String keyPrefix) { this.keyPrefix = keyPrefix; return this; }
        public ApiKeyEntityBuilder keyHash(String keyHash) { this.keyHash = keyHash; return this; }
        public ApiKeyEntityBuilder name(String name) { this.name = name; return this; }
        public ApiKeyEntityBuilder role(Role role) { this.role = role; return this; }
        public ApiKeyEntityBuilder active(Boolean active) { this.active = active; return this; }
        public ApiKeyEntityBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public ApiKeyEntity build() {
            return new ApiKeyEntity(id, keyPrefix, keyHash, name, role, active, createdAt);
        }
    }
}
