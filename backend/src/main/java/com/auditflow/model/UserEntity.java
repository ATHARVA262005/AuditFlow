package com.auditflow.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Instant createdAt;

    public UserEntity() {}

    public UserEntity(Long id, String username, String password, String email, Role role, Boolean active, Instant createdAt) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
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

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static UserEntityBuilder builder() {
        return new UserEntityBuilder();
    }

    public static class UserEntityBuilder {
        private Long id;
        private String username;
        private String password;
        private String email;
        private Role role;
        private Boolean active = true;
        private Instant createdAt;

        public UserEntityBuilder id(Long id) { this.id = id; return this; }
        public UserEntityBuilder username(String username) { this.username = username; return this; }
        public UserEntityBuilder password(String password) { this.password = password; return this; }
        public UserEntityBuilder email(String email) { this.email = email; return this; }
        public UserEntityBuilder role(Role role) { this.role = role; return this; }
        public UserEntityBuilder active(Boolean active) { this.active = active; return this; }
        public UserEntityBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public UserEntity build() {
            return new UserEntity(id, username, password, email, role, active, createdAt);
        }
    }
}
