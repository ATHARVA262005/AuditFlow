package com.auditflow.controller;

import com.auditflow.model.BookEntity;
import com.auditflow.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            @SuppressWarnings("unchecked")
            List<String> chapterIds = (List<String>) payload.get("chapterIds");
            String feature = (String) payload.get("feature");

            BookEntity book = bookService.createBook(title, chapterIds, feature);
            return ResponseEntity.ok(Map.of("status", "created", "book", book));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<BookEntity>> listBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable String id) {
        BookEntity book = bookService.getBookById(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book);
    }

    @PostMapping("/{id}/edition")
    public ResponseEntity<?> createEdition(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        try {
            String title = (String) payload.get("title");
            @SuppressWarnings("unchecked")
            List<String> chapterIds = (List<String>) payload.get("chapterIds");

            BookEntity newEdition = bookService.createEdition(id, title, chapterIds);
            return ResponseEntity.ok(Map.of("status", "created", "book", newEdition));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
