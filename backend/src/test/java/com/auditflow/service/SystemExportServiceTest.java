package com.auditflow.service;

import com.auditflow.model.BookEntity;
import com.auditflow.model.ChapterEntity;
import com.auditflow.repository.AuditLogRepository;
import com.auditflow.repository.BookRepository;
import com.auditflow.repository.ChapterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SystemExportServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private ChapterRepository chapterRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private BookService bookService;

    @InjectMocks
    private SystemExportService systemExportService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Export Book as Markdown formats title, chapters, and validation status")
    void testExportBookAsMarkdown() {
        BookEntity book = BookEntity.builder()
                .id("b_001")
                .title("Risk Workflow v1")
                .chapterIdsJson("[\"c_001\"]")
                .version(1)
                .feature("finance")
                .build();

        ChapterEntity chapter = ChapterEntity.builder()
                .id("c_001")
                .prompt("Analyze quarterly ROI")
                .result("ROI is 18.4%")
                .actor("fin-agent")
                .source("prod-pipeline")
                .validationStatus("PASSED")
                .validationMessage("Clean")
                .build();

        when(bookRepository.findById("b_001")).thenReturn(Optional.of(book));
        when(bookService.parseChapterIds(book.getChapterIdsJson())).thenReturn(List.of("c_001"));
        when(chapterRepository.findById("c_001")).thenReturn(Optional.of(chapter));

        String markdown = systemExportService.exportBookAsMarkdown("b_001");

        assertNotNull(markdown);
        assertTrue(markdown.contains("# Risk Workflow v1"));
        assertTrue(markdown.contains("Analyze quarterly ROI"));
        assertTrue(markdown.contains("ROI is 18.4%"));
    }

    @Test
    @DisplayName("S3 Sync generates bucket snapshot key and aggregates total counts")
    void testPerformS3Sync() {
        when(bookRepository.count()).thenReturn(4L);
        when(chapterRepository.count()).thenReturn(5L);
        when(auditLogRepository.count()).thenReturn(12L);

        Map<String, Object> result = systemExportService.performS3Sync();

        assertNotNull(result);
        assertEquals("success", result.get("status"));
        assertEquals(4L, result.get("totalBooksSynced"));
        assertEquals(5L, result.get("totalChaptersSynced"));
        assertEquals(12L, result.get("totalAuditLogsSynced"));
        assertTrue(result.get("s3Uri").toString().startsWith("s3://"));
    }
}
