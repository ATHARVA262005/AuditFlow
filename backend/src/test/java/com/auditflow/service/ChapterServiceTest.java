package com.auditflow.service;

import com.auditflow.model.ChapterEntity;
import com.auditflow.repository.ChapterRepository;
import com.auditflow.validation.ValidationEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ChapterServiceTest {

    @Mock
    private ChapterRepository chapterRepository;

    @Mock
    private ValidationEngine validationEngine;

    @InjectMocks
    private ChapterService chapterService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Create immutable Chapter sets ID and saves entity")
    void testCreateChapter() {
        ChapterEntity chapter = ChapterEntity.builder()
                .prompt("Generate summary report")
                .result("Summary report generated successfully")
                .actor("developer-agent")
                .source("automated-test")
                .model("gpt-4o")
                .build();

        when(chapterRepository.save(any(ChapterEntity.class))).thenAnswer(i -> i.getArgument(0));

        ChapterEntity saved = chapterService.createChapter(chapter);

        assertNotNull(saved.getId());
        assertTrue(saved.getId().startsWith("c_"));
        verify(chapterRepository, times(1)).save(any(ChapterEntity.class));
    }

    @Test
    @DisplayName("Get Chapter by ID returns entity when found")
    void testGetChapterById() {
        ChapterEntity chapter = ChapterEntity.builder()
                .id("c_100")
                .prompt("Test prompt")
                .result("Test result")
                .build();

        when(chapterRepository.findById("c_100")).thenReturn(Optional.of(chapter));

        ChapterEntity result = chapterService.getChapterById("c_100");

        assertNotNull(result);
        assertEquals("c_100", result.getId());
    }
}
