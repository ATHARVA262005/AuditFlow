package com.auditflow.repository;

import com.auditflow.model.ChapterEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<ChapterEntity, String> {

    List<ChapterEntity> findByActorIgnoreCase(String actor);

    @Query("SELECT c FROM ChapterEntity c WHERE " +
           "(:actor IS NULL OR LOWER(c.actor) = LOWER(:actor)) AND " +
           "(:keyword IS NULL OR LOWER(c.prompt) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.result) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:after IS NULL OR c.timestamp >= :after) AND " +
           "(:before IS NULL OR c.timestamp <= :before)")
    Page<ChapterEntity> searchChapters(
            @Param("actor") String actor,
            @Param("keyword") String keyword,
            @Param("after") Instant after,
            @Param("before") Instant before,
            Pageable pageable);
}
