package com.auditflow.service;

import com.auditflow.model.AuditLogEntity;
import com.auditflow.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLogEntity logAction(String actor, String action, String resource, String status, String details, String ipAddress) {
        AuditLogEntity log = AuditLogEntity.builder()
                .actor(actor != null ? actor : "system")
                .action(action)
                .resource(resource)
                .status(status)
                .details(details)
                .ipAddress(ipAddress)
                .build();
        return auditLogRepository.save(log);
    }

    public Page<AuditLogEntity> getLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));
    }

    public Map<String, Object> getAuditStats() {
        long totalLogs = auditLogRepository.count();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLogs", totalLogs);
        stats.put("status", "HEALTHY");
        return stats;
    }
}
