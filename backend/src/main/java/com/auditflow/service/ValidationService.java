package com.auditflow.service;

import com.auditflow.validation.ValidationEngine;
import com.auditflow.validation.ValidationResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ValidationService {

    private final ValidationEngine validationEngine;
    private final ChapterService chapterService;

    public ValidationService(ValidationEngine validationEngine, ChapterService chapterService) {
        this.validationEngine = validationEngine;
        this.chapterService = chapterService;
    }

    public ValidationResult validateText(String prompt, String result, String regexPattern, List<String> requiredKeywords, boolean jsonFormat) {
        return validationEngine.validate(prompt, result, regexPattern, requiredKeywords, jsonFormat);
    }

    public ValidationResult validateChapter(String chapterId, String regexPattern, List<String> requiredKeywords, boolean jsonFormat) {
        var chapter = chapterService.getChapterById(chapterId);
        if (chapter == null) {
            throw new IllegalArgumentException("Chapter '" + chapterId + "' not found");
        }
        ValidationResult res = validationEngine.validate(chapter.getPrompt(), chapter.getResult(), regexPattern, requiredKeywords, jsonFormat);
        chapterService.updateValidationStatus(chapterId, res.getStatus(), res.getMessage());
        return res;
    }
}
