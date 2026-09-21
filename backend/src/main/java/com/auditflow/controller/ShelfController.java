package com.auditflow.controller;

import com.auditflow.model.BookEntity;
import com.auditflow.model.ShelfEntity;
import com.auditflow.service.ShelfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/shelves")
public class ShelfController {

    private final ShelfService shelfService;

    public ShelfController(ShelfService shelfService) {
        this.shelfService = shelfService;
    }

    @GetMapping
    public ResponseEntity<List<ShelfEntity>> getShelves() {
        return ResponseEntity.ok(shelfService.getAllShelves());
    }

    @GetMapping("/library")
    public ResponseEntity<Map<String, List<BookEntity>>> getLibrary() {
        return ResponseEntity.ok(shelfService.getLibraryByFeature());
    }
}
