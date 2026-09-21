package com.auditflow.controller;

import com.auditflow.model.ApiKeyEntity;
import com.auditflow.model.Role;
import com.auditflow.model.UserEntity;
import com.auditflow.service.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Role role = Role.valueOf(payload.get("role").toUpperCase());
            UserEntity updated = userManagementService.updateUserRole(id, role);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api-keys")
    public ResponseEntity<List<ApiKeyEntity>> getAllApiKeys() {
        return ResponseEntity.ok(userManagementService.getAllApiKeys());
    }

    @PostMapping("/api-keys")
    public ResponseEntity<?> createApiKey(@RequestBody Map<String, String> payload) {
        try {
            String name = payload.get("name");
            String roleStr = payload.get("role");
            Role role = roleStr != null ? Role.valueOf(roleStr.toUpperCase()) : Role.DEVELOPER;

            var res = userManagementService.createApiKey(name, role);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/api-keys/{id}")
    public ResponseEntity<?> revokeApiKey(@PathVariable Long id) {
        userManagementService.revokeApiKey(id);
        return ResponseEntity.ok(Map.of("status", "revoked", "id", id));
    }
}
