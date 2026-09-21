package com.auditflow.service;

import com.auditflow.model.BookEntity;
import com.auditflow.model.ShelfEntity;
import com.auditflow.repository.BookRepository;
import com.auditflow.repository.ShelfRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ShelfService {

    private final ShelfRepository shelfRepository;
    private final BookRepository bookRepository;

    public ShelfService(ShelfRepository shelfRepository, BookRepository bookRepository) {
        this.shelfRepository = shelfRepository;
        this.bookRepository = bookRepository;
    }

    public List<ShelfEntity> getAllShelves() {
        return shelfRepository.findAll();
    }

    public Map<String, List<BookEntity>> getLibraryByFeature() {
        List<BookEntity> allBooks = bookRepository.findAll();
        Map<String, List<BookEntity>> shelfMap = new LinkedHashMap<>();

        for (BookEntity book : allBooks) {
            shelfMap.computeIfAbsent(book.getFeature(), k -> new ArrayList<>()).add(book);
        }
        return shelfMap;
    }
}
