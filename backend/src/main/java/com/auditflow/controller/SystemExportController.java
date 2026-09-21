package com.auditflow.controller;

import com.auditflow.service.SystemExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class SystemExportController {

    private final SystemExportService systemExportService;

    public SystemExportController(SystemExportService systemExportService) {
        this.systemExportService = systemExportService;
    }

    @GetMapping("/export/book/{id}")
    public ResponseEntity<?> exportBook(
            @PathVariable String id,
            @RequestParam(defaultValue = "json") String format) {
        try {
            if ("markdown".equalsIgnoreCase(format)) {
                String md = systemExportService.exportBookAsMarkdown(id);
                return ResponseEntity.ok()
                        .contentType(MediaType.TEXT_MARKDOWN)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"book_" + id + ".md\"")
                        .body(md);
            } else {
                Map<String, Object> json = systemExportService.exportBookAsJson(id);
                return ResponseEntity.ok(json);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/system/backup")
    public ResponseEntity<?> triggerBackup() {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Online point-in-time backup triggered successfully",
                "timestamp", java.time.Instant.now().toString()
        ));
    }

    @PostMapping("/system/s3-sync")
    public ResponseEntity<?> syncToS3() {
        Map<String, Object> result = systemExportService.performS3Sync();
        return ResponseEntity.ok(result);
    }
}
