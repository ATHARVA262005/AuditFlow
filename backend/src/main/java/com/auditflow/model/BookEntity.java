package com.auditflow.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "books")
public class BookEntity {

    @Id
    private String id; // e.g. b_001

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String chapterIdsJson; // JSON array of chapter IDs

    @Column(nullable = false)
    private Integer version;

    @Column(nullable = false, length = 255)
    private String feature;

    @Column(length = 255)
    private String parentBookId; // Lineage pointer to previous edition

    @Column(columnDefinition = "TEXT")
    private String metadataJson;

    @Column(nullable = false)
    private Instant createdAt;

    public BookEntity() {}

    public BookEntity(String id, String title, String chapterIdsJson, Integer version, String feature, String parentBookId, String metadataJson, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.chapterIdsJson = chapterIdsJson;
        this.version = version;
        this.feature = feature;
        this.parentBookId = parentBookId;
        this.metadataJson = metadataJson;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (version == null) {
            version = 1;
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getChapterIdsJson() { return chapterIdsJson; }
    public void setChapterIdsJson(String chapterIdsJson) { this.chapterIdsJson = chapterIdsJson; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public String getFeature() { return feature; }
    public void setFeature(String feature) { this.feature = feature; }

    public String getParentBookId() { return parentBookId; }
    public void setParentBookId(String parentBookId) { this.parentBookId = parentBookId; }

    public String getMetadataJson() { return metadataJson; }
    public void setMetadataJson(String metadataJson) { this.metadataJson = metadataJson; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static BookEntityBuilder builder() {
        return new BookEntityBuilder();
    }

    public static class BookEntityBuilder {
        private String id;
        private String title;
        private String chapterIdsJson;
        private Integer version;
        private String feature;
        private String parentBookId;
        private String metadataJson;
        private Instant createdAt;

        public BookEntityBuilder id(String id) { this.id = id; return this; }
        public BookEntityBuilder title(String title) { this.title = title; return this; }
        public BookEntityBuilder chapterIdsJson(String chapterIdsJson) { this.chapterIdsJson = chapterIdsJson; return this; }
        public BookEntityBuilder version(Integer version) { this.version = version; return this; }
        public BookEntityBuilder feature(String feature) { this.feature = feature; return this; }
        public BookEntityBuilder parentBookId(String parentBookId) { this.parentBookId = parentBookId; return this; }
        public BookEntityBuilder metadataJson(String metadataJson) { this.metadataJson = metadataJson; return this; }
        public BookEntityBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public BookEntity build() {
            return new BookEntity(id, title, chapterIdsJson, version, feature, parentBookId, metadataJson, createdAt);
        }
    }
}
