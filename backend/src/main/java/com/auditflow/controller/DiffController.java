package com.auditflow.controller;

import com.auditflow.service.DiffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/diff")
public class DiffController {

    private final DiffService diffService;

    public DiffController(DiffService diffService) {
        this.diffService = diffService;
    }

    @GetMapping("/books")
    public ResponseEntity<?> diffBooks(
            @RequestParam String bookIdA,
            @RequestParam String bookIdB) {
        try {
            Map<String, Object> diff = diffService.diffBooks(bookIdA, bookIdB);
            return ResponseEntity.ok(diff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
