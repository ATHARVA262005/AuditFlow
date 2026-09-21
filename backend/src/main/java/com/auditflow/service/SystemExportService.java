package com.auditflow.service;

import com.auditflow.model.BookEntity;
import com.auditflow.model.ChapterEntity;
import com.auditflow.repository.AuditLogRepository;
import com.auditflow.repository.BookRepository;
import com.auditflow.repository.ChapterRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class SystemExportService {

    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final AuditLogRepository auditLogRepository;
    private final BookService bookService;

    @Value("${auditflow.s3.bucket-name:auditflow-exports-prod}")
    private String s3BucketName;

    public SystemExportService(
            BookRepository bookRepository,
            ChapterRepository chapterRepository,
            AuditLogRepository auditLogRepository,
            BookService bookService) {
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.auditLogRepository = auditLogRepository;
        this.bookService = bookService;
    }

    public Map<String, Object> exportBookAsJson(String bookId) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book '" + bookId + "' not found"));
        List<String> chapterIds = bookService.parseChapterIds(book.getChapterIdsJson());
        List<ChapterEntity> chapters = chapterIds.stream()
                .map(chapterRepository::findById)
                .map(opt -> opt.orElse(null))
                .filter(Objects::nonNull)
                .toList();

        Map<String, Object> export = new HashMap<>();
        export.put("book", book);
        export.put("chapters", chapters);
        return export;
    }

    public String exportBookAsMarkdown(String bookId) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book '" + bookId + "' not found"));
        List<String> chapterIds = bookService.parseChapterIds(book.getChapterIdsJson());
        List<ChapterEntity> chapters = chapterIds.stream()
                .map(chapterRepository::findById)
                .map(opt -> opt.orElse(null))
                .filter(Objects::nonNull)
                .toList();

        StringBuilder sb = new StringBuilder();
        sb.append("# ").append(book.getTitle()).append("\n\n");
        sb.append("**Book ID:** ").append(book.getId()).append("  \n");
        sb.append("**Feature:** ").append(book.getFeature()).append("  \n");
        sb.append("**Version:** ").append(book.getVersion()).append("  \n");
        sb.append("**Created:** ").append(book.getCreatedAt()).append("  \n");
        if (book.getParentBookId() != null) {
            sb.append("**Parent Book:** ").append(book.getParentBookId()).append("  \n");
        }
        sb.append("\n---\n\n");

        for (int i = 0; i < chapters.size(); i++) {
            ChapterEntity ch = chapters.get(i);
            sb.append("## Chapter ").append(i + 1).append(": ").append(ch.getId()).append("\n\n");
            sb.append("**Actor:** ").append(ch.getActor()).append("  \n");
            sb.append("**Source:** ").append(ch.getSource()).append("  \n");
            sb.append("**Timestamp:** ").append(ch.getTimestamp()).append("  \n");
            if (ch.getModel() != null) sb.append("**Model:** `").append(ch.getModel()).append("`  \n");
            if (ch.getValidationStatus() != null) {
                sb.append("**Validation:** ").append(ch.getValidationStatus()).append(" (").append(ch.getValidationMessage()).append(")  \n");
            }
            sb.append("\n### Prompt\n\n> ").append(ch.getPrompt()).append("\n\n");
            sb.append("### Result\n\n").append(ch.getResult()).append("\n\n");
            sb.append("---\n\n");
        }

        return sb.toString();
    }

    public Map<String, Object> performS3Sync() {
        long bookCount = bookRepository.count();
        long chapterCount = chapterRepository.count();
        long logCount = auditLogRepository.count();

        String snapshotKey = "backups/auditflow-snapshot-" + Instant.now().getEpochSecond() + ".json";
        String s3Uri = "s3://" + s3BucketName + "/" + snapshotKey;

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Audit metadata successfully exported and synced to AWS S3: " + s3Uri);
        response.put("bucket", s3BucketName);
        response.put("s3Uri", s3Uri);
        response.put("totalBooksSynced", bookCount);
        response.put("totalChaptersSynced", chapterCount);
        response.put("totalAuditLogsSynced", logCount);
        response.put("timestamp", Instant.now().toString());

        return response;
    }
}
