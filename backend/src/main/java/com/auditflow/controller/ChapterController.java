package com.auditflow.controller;

import com.auditflow.model.ChapterEntity;
import com.auditflow.service.ChapterService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chapters")
public class ChapterController {

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @PostMapping
    public ResponseEntity<?> createChapter(@RequestBody ChapterEntity chapter) {
        try {
            ChapterEntity created = chapterService.createChapter(chapter);
            return ResponseEntity.ok(Map.of("status", "created", "chapter", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ChapterEntity>> listChapters() {
        return ResponseEntity.ok(chapterService.getAllChapters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getChapterById(@PathVariable String id) {
        ChapterEntity chapter = chapterService.getChapterById(id);
        if (chapter == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(chapter);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ChapterEntity>> searchChapters(
            @RequestParam(required = false) String actor,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String after,
            @RequestParam(required = false) String before,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Instant afterTime = after != null ? Instant.parse(after) : null;
        Instant beforeTime = before != null ? Instant.parse(before) : null;

        Page<ChapterEntity> results = chapterService.searchChapters(actor, keyword, afterTime, beforeTime, page, size);
        return ResponseEntity.ok(results);
    }
}
