package com.auditflow.repository;

import com.auditflow.model.ShelfEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShelfRepository extends JpaRepository<ShelfEntity, Long> {
    Optional<ShelfEntity> findByFeature(String feature);
}
