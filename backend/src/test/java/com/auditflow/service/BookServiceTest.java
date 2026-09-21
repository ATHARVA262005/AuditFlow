package com.auditflow.service;

import com.auditflow.model.BookEntity;
import com.auditflow.repository.BookRepository;
import com.auditflow.repository.ChapterRepository;
import com.auditflow.repository.ShelfRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private ChapterRepository chapterRepository;

    @Mock
    private ShelfRepository shelfRepository;

    @InjectMocks
    private BookService bookService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Create Book initializes ID and sets version 1")
    void testCreateBook() {
        when(chapterRepository.existsById(anyString())).thenReturn(true);
        when(bookRepository.save(any(BookEntity.class))).thenAnswer(i -> i.getArgument(0));

        BookEntity saved = bookService.createBook("Customer Onboarding Workflow v1", Arrays.asList("c_001", "c_002"), "onboarding");

        assertNotNull(saved.getId());
        assertTrue(saved.getId().startsWith("b_"));
        assertEquals("onboarding", saved.getFeature());
        verify(bookRepository, times(1)).save(any(BookEntity.class));
    }

    @Test
    @DisplayName("Create new Edition creates a child Book referencing parent lineage ID")
    void testCreateEdition() {
        BookEntity parent = BookEntity.builder()
                .id("b_001")
                .title("Support Bot Edition 1")
                .chapterIdsJson("[\"c_001\"]")
                .version(1)
                .feature("support-bot")
                .build();

        when(bookRepository.findById("b_001")).thenReturn(Optional.of(parent));
        when(chapterRepository.existsById(anyString())).thenReturn(true);
        when(bookRepository.save(any(BookEntity.class))).thenAnswer(i -> i.getArgument(0));

        List<String> newChapterIds = Arrays.asList("c_001", "c_003");
        BookEntity child = bookService.createEdition("b_001", "Support Bot Edition 2", newChapterIds);

        assertNotNull(child.getId());
        assertEquals("b_001", child.getParentBookId());
        assertEquals(2, child.getVersion());
        assertEquals("support-bot", child.getFeature());
    }
}
