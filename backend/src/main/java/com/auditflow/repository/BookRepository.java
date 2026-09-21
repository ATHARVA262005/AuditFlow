package com.auditflow.repository;

import com.auditflow.model.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, String> {
    List<BookEntity> findByFeatureOrderByVersionAsc(String feature);
    Optional<BookEntity> findFirstByFeatureOrderByVersionDesc(String feature);
}
