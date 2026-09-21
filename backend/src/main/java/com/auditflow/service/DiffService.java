package com.auditflow.service;

import com.auditflow.model.BookEntity;
import com.auditflow.model.ChapterEntity;
import com.auditflow.repository.BookRepository;
import com.auditflow.repository.ChapterRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DiffService {

    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final BookService bookService;

    public DiffService(BookRepository bookRepository, ChapterRepository chapterRepository, BookService bookService) {
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.bookService = bookService;
    }

    public Map<String, Object> diffChapters(String chapterIdA, String chapterIdB) {
        ChapterEntity chA = chapterRepository.findById(chapterIdA).orElse(null);
        ChapterEntity chB = chapterRepository.findById(chapterIdB).orElse(null);

        Map<String, Object> diff = new HashMap<>();
        diff.put("chapterAId", chapterIdA);
        diff.put("chapterBId", chapterIdB);
        if (chA != null && chB != null) {
            boolean isPromptEqual = Objects.equals(chA.getPrompt(), chB.getPrompt());
            boolean isResultEqual = Objects.equals(chA.getResult(), chB.getResult());
            diff.put("isPromptEqual", isPromptEqual);
            diff.put("isResultEqual", isResultEqual);
            diff.put("promptDiff", computeLineDiff(chA.getPrompt(), chB.getPrompt()));
            diff.put("resultDiff", computeLineDiff(chA.getResult(), chB.getResult()));
        } else {
            diff.put("isPromptEqual", false);
            diff.put("isResultEqual", false);
        }
        return diff;
    }

    public Map<String, Object> diffBooks(String bookIdA, String bookIdB) {
        BookEntity bookA = bookRepository.findById(bookIdA)
                .orElseThrow(() -> new IllegalArgumentException("Book '" + bookIdA + "' not found"));
        BookEntity bookB = bookRepository.findById(bookIdB)
                .orElseThrow(() -> new IllegalArgumentException("Book '" + bookIdB + "' not found"));

        List<String> idsA = bookService.parseChapterIds(bookA.getChapterIdsJson());
        List<String> idsB = bookService.parseChapterIds(bookB.getChapterIdsJson());

        Set<String> setA = new HashSet<>(idsA);
        Set<String> setB = new HashSet<>(idsB);

        List<String> keptIds = new ArrayList<>(setA);
        keptIds.retainAll(setB);

        List<String> addedIds = new ArrayList<>(setB);
        addedIds.removeAll(setA);

        List<String> removedIds = new ArrayList<>(setA);
        removedIds.removeAll(setB);

        List<Map<String, Object>> stepComparisons = new ArrayList<>();
        int minSteps = Math.min(idsA.size(), idsB.size());

        for (int i = 0; i < minSteps; i++) {
            String idA = idsA.get(i);
            String idB = idsB.get(i);

            ChapterEntity chA = chapterRepository.findById(idA).orElse(null);
            ChapterEntity chB = chapterRepository.findById(idB).orElse(null);

            if (chA != null && chB != null) {
                boolean identical = Objects.equals(chA.getPrompt(), chB.getPrompt()) && Objects.equals(chA.getResult(), chB.getResult());
                
                Map<String, Object> step = new HashMap<>();
                step.put("stepNumber", i + 1);
                step.put("chapterA", chA);
                step.put("chapterB", chB);
                step.put("areIdentical", identical);
                step.put("promptDiff", computeLineDiff(chA.getPrompt(), chB.getPrompt()));
                step.put("resultDiff", computeLineDiff(chA.getResult(), chB.getResult()));
                stepComparisons.add(step);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("bookA", bookA);
        result.put("bookB", bookB);
        result.put("kept", keptIds);
        result.put("added", addedIds);
        result.put("removed", removedIds);
        result.put("stepComparisons", stepComparisons);
        return result;
    }

    private List<String> computeLineDiff(String textA, String textB) {
        if (textA == null) textA = "";
        if (textB == null) textB = "";

        List<String> diffLines = new ArrayList<>();
        String[] linesA = textA.split("\\r?\\n");
        String[] linesB = textB.split("\\r?\\n");

        int i = 0, j = 0;
        while (i < linesA.length || j < linesB.length) {
            if (i < linesA.length && j < linesB.length && linesA[i].equals(linesB[j])) {
                diffLines.add("  " + linesA[i]);
                i++; j++;
            } else {
                if (i < linesA.length) {
                    diffLines.add("- " + linesA[i]);
                    i++;
                }
                if (j < linesB.length) {
                    diffLines.add("+ " + linesB[j]);
                    j++;
                }
            }
        }
        return diffLines;
    }
}
