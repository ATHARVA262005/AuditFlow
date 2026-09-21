package com.auditflow.service;

import com.auditflow.model.ApiKeyEntity;
import com.auditflow.model.Role;
import com.auditflow.model.UserEntity;
import com.auditflow.repository.ApiKeyRepository;
import com.auditflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final ApiKeyRepository apiKeyRepository;

    public UserManagementService(UserRepository userRepository, ApiKeyRepository apiKeyRepository) {
        this.userRepository = userRepository;
        this.apiKeyRepository = apiKeyRepository;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity updateUserRole(Long userId, Role role) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public ApiKeyResponse createApiKey(String name, Role role) {
        String rawKey = "af_live_" + UUID.randomUUID().toString().replace("-", "");
        String prefix = rawKey.substring(0, 12);
        String hash = hashKey(rawKey);

        ApiKeyEntity apiKey = ApiKeyEntity.builder()
                .name(name)
                .keyPrefix(prefix)
                .keyHash(hash)
                .role(role != null ? role : Role.DEVELOPER)
                .active(true)
                .build();

        apiKeyRepository.save(apiKey);
        return new ApiKeyResponse(apiKey.getId(), rawKey, name, apiKey.getRole().name(), apiKey.getActive());
    }

    public List<ApiKeyEntity> getAllApiKeys() {
        return apiKeyRepository.findAll();
    }

    public void revokeApiKey(Long id) {
        apiKeyRepository.findById(id).ifPresent(key -> {
            key.setActive(false);
            apiKeyRepository.save(key);
        });
    }

    private String hashKey(String rawKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawKey.getBytes());
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public record ApiKeyResponse(Long id, String rawApiKey, String name, String role, boolean active) {}
}
