package com.auditflow.service;

import com.auditflow.model.BookEntity;
import com.auditflow.model.ShelfEntity;
import com.auditflow.repository.BookRepository;
import com.auditflow.repository.ChapterRepository;
import com.auditflow.repository.ShelfRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final ShelfRepository shelfRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private long bookCounter = 0;

    public BookService(BookRepository bookRepository, ChapterRepository chapterRepository, ShelfRepository shelfRepository) {
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.shelfRepository = shelfRepository;
    }

    private synchronized String generateNextBookId() {
        bookCounter++;
        return String.format("b_%03d", bookCounter);
    }

    @Transactional
    public BookEntity createBook(String title, List<String> chapterIds, String feature) {
        // Validate all chapters exist
        for (String cid : chapterIds) {
            if (!chapterRepository.existsById(cid)) {
                throw new IllegalArgumentException("Chapter '" + cid + "' not found");
            }
        }

        String bookId = generateNextBookId();
        String jsonChapterIds;
        try {
            jsonChapterIds = objectMapper.writeValueAsString(chapterIds);
        } catch (JsonProcessingException e) {
            jsonChapterIds = "[]";
        }

        String featureName = (feature != null && !feature.isBlank()) ? feature : title;

        BookEntity book = BookEntity.builder()
                .id(bookId)
                .title(title)
                .chapterIdsJson(jsonChapterIds)
                .version(1)
                .feature(featureName)
                .createdAt(Instant.now())
                .build();

        bookRepository.save(book);
        updateShelfSummary(featureName);
        return book;
    }

    @Transactional
    public BookEntity createEdition(String parentBookId, String newTitle, List<String> newChapterIds) {
        BookEntity parent = bookRepository.findById(parentBookId)
                .orElseThrow(() -> new IllegalArgumentException("Parent book '" + parentBookId + "' not found"));

        List<String> chapterIds = (newChapterIds != null && !newChapterIds.isEmpty()) ? newChapterIds : parseChapterIds(parent.getChapterIdsJson());
        for (String cid : chapterIds) {
            if (!chapterRepository.existsById(cid)) {
                throw new IllegalArgumentException("Chapter '" + cid + "' not found");
            }
        }

        String title = (newTitle != null && !newTitle.isBlank()) ? newTitle : parent.getTitle();
        String bookId = generateNextBookId();
        String jsonChapterIds;
        try {
            jsonChapterIds = objectMapper.writeValueAsString(chapterIds);
        } catch (JsonProcessingException e) {
            jsonChapterIds = "[]";
        }

        BookEntity newBook = BookEntity.builder()
                .id(bookId)
                .title(title)
                .chapterIdsJson(jsonChapterIds)
                .version(parent.getVersion() + 1)
                .feature(parent.getFeature())
                .parentBookId(parent.getId())
                .createdAt(Instant.now())
                .build();

        bookRepository.save(newBook);
        updateShelfSummary(parent.getFeature());
        return newBook;
    }

    public BookEntity getBookById(String id) {
        return bookRepository.findById(id).orElse(null);
    }

    public List<BookEntity> getAllBooks() {
        return bookRepository.findAll();
    }

    public List<BookEntity> getBooksByFeature(String feature) {
        return bookRepository.findByFeatureOrderByVersionAsc(feature);
    }

    private void updateShelfSummary(String feature) {
        List<BookEntity> featureBooks = bookRepository.findByFeatureOrderByVersionAsc(feature);
        int maxVersion = featureBooks.stream().mapToInt(BookEntity::getVersion).max().orElse(1);

        Optional<ShelfEntity> shelfOpt = shelfRepository.findByFeature(feature);
        ShelfEntity shelf = shelfOpt.orElseGet(() -> ShelfEntity.builder().feature(feature).build());
        shelf.setBookCount(featureBooks.size());
        shelf.setLatestVersion(maxVersion);
        shelfRepository.save(shelf);
    }

    @SuppressWarnings("unchecked")
    public List<String> parseChapterIds(String json) {
        try {
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }
}
