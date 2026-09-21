package com.auditflow.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "shelves")
public class ShelfEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String feature;

    @Column(nullable = false)
    private Integer bookCount;

    @Column(nullable = false)
    private Integer latestVersion;

    @Column(nullable = false)
    private Instant updatedAt;

    public ShelfEntity() {}

    public ShelfEntity(Long id, String feature, Integer bookCount, Integer latestVersion, Instant updatedAt) {
        this.id = id;
        this.feature = feature;
        this.bookCount = bookCount;
        this.latestVersion = latestVersion;
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    @PrePersist
    @PreUpdate
    public void onSave() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFeature() { return feature; }
    public void setFeature(String feature) { this.feature = feature; }

    public Integer getBookCount() { return bookCount; }
    public void setBookCount(Integer bookCount) { this.bookCount = bookCount; }

    public Integer getLatestVersion() { return latestVersion; }
    public void setLatestVersion(Integer latestVersion) { this.latestVersion = latestVersion; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static ShelfEntityBuilder builder() {
        return new ShelfEntityBuilder();
    }

    public static class ShelfEntityBuilder {
        private Long id;
        private String feature;
        private Integer bookCount;
        private Integer latestVersion;
        private Instant updatedAt;

        public ShelfEntityBuilder id(Long id) { this.id = id; return this; }
        public ShelfEntityBuilder feature(String feature) { this.feature = feature; return this; }
        public ShelfEntityBuilder bookCount(Integer bookCount) { this.bookCount = bookCount; return this; }
        public ShelfEntityBuilder latestVersion(Integer latestVersion) { this.latestVersion = latestVersion; return this; }
        public ShelfEntityBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public ShelfEntity build() {
            return new ShelfEntity(id, feature, bookCount, latestVersion, updatedAt);
        }
    }
}
