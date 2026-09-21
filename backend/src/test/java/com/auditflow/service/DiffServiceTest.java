package com.auditflow.service;

import com.auditflow.model.ChapterEntity;
import com.auditflow.repository.BookRepository;
import com.auditflow.repository.ChapterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class DiffServiceTest {

    @Mock
    private ChapterRepository chapterRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private DiffService diffService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Diff Chapters returns equal flags when prompts match")
    void testDiffChaptersIdentical() {
        ChapterEntity chapterA = ChapterEntity.builder()
                .id("c_001")
                .prompt("System instructions v1")
                .result("Output result v1")
                .build();

        ChapterEntity chapterB = ChapterEntity.builder()
                .id("c_002")
                .prompt("System instructions v1")
                .result("Output result v1")
                .build();

        when(chapterRepository.findById("c_001")).thenReturn(Optional.of(chapterA));
        when(chapterRepository.findById("c_002")).thenReturn(Optional.of(chapterB));

        Map<String, Object> diff = diffService.diffChapters("c_001", "c_002");

        assertTrue((Boolean) diff.get("isPromptEqual"));
        assertTrue((Boolean) diff.get("isResultEqual"));
        assertEquals("c_001", diff.get("chapterAId"));
        assertEquals("c_002", diff.get("chapterBId"));
    }
}
