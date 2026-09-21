package com.auditflow.service;

import com.auditflow.model.ChapterEntity;
import com.auditflow.repository.ChapterRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private long chapterCounter = 0;

    public ChapterService(ChapterRepository chapterRepository) {
        this.chapterRepository = chapterRepository;
    }

    private synchronized String generateNextChapterId() {
        chapterCounter++;
        return String.format("c_%03d", chapterCounter);
    }

    @Transactional
    public ChapterEntity createChapter(ChapterEntity chapter) {
        if (chapter.getId() == null || chapter.getId().isBlank()) {
            chapter.setId(generateNextChapterId());
        }
        return chapterRepository.save(chapter);
    }

    public ChapterEntity getChapterById(String id) {
        return chapterRepository.findById(id).orElse(null);
    }

    public List<ChapterEntity> getAllChapters() {
        return chapterRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    public Page<ChapterEntity> searchChapters(String actor, String keyword, Instant after, Instant before, int page, int size) {
        return chapterRepository.searchChapters(actor, keyword, after, before, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp")));
    }

    @Transactional
    public ChapterEntity updateValidationStatus(String id, String status, String message) {
        ChapterEntity chapter = getChapterById(id);
        if (chapter != null) {
            chapter.setValidationStatus(status);
            chapter.setValidationMessage(message);
            return chapterRepository.save(chapter);
        }
        return null;
    }
}
