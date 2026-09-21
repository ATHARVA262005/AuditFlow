package com.auditflow.service;

import com.auditflow.model.Role;
import com.auditflow.model.UserEntity;
import com.auditflow.repository.UserRepository;
import com.auditflow.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Register successful creates new user and returns JWT payload")
    void testRegisterSuccess() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@auditflow.io")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPass123");
        when(tokenProvider.generateToken(anyString(), anyString())).thenReturn("mock_jwt_token_123");
        when(userRepository.save(any(UserEntity.class))).thenAnswer(i -> i.getArgument(0));

        Map<String, Object> result = authService.register("newuser", "newuser@auditflow.io", "pass123", Role.DEVELOPER);

        assertNotNull(result);
        assertEquals("mock_jwt_token_123", result.get("token"));
        assertEquals("newuser", result.get("username"));
        assertEquals("DEVELOPER", result.get("role").toString());
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("Register fails on duplicate username")
    void testRegisterDuplicateUsername() {
        when(userRepository.existsByUsername("admin")).thenReturn(true);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.register("admin", "admin@auditflow.io", "pass123", Role.ADMIN);
        });

        assertEquals("Username is already taken", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login successful validates password and returns JWT token")
    void testLoginSuccess() {
        UserEntity existingUser = UserEntity.builder()
                .id(1L)
                .username("admin")
                .password("hashedPass")
                .email("admin@auditflow.io")
                .role(Role.ADMIN)
                .active(true)
                .build();

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("admin123", "hashedPass")).thenReturn(true);
        when(tokenProvider.generateToken("admin", "ADMIN")).thenReturn("jwt_admin_token");

        Map<String, Object> result = authService.login("admin", "admin123");

        assertNotNull(result);
        assertEquals("jwt_admin_token", result.get("token"));
        assertEquals("admin", result.get("username"));
        assertEquals("ADMIN", result.get("role").toString());
    }

    @Test
    @DisplayName("Login fails on invalid credentials")
    void testLoginInvalidPassword() {
        UserEntity existingUser = UserEntity.builder()
                .username("admin")
                .password("hashedPass")
                .role(Role.ADMIN)
                .build();

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("wrongpass", "hashedPass")).thenReturn(false);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.login("admin", "wrongpass");
        });

        assertEquals("Invalid username or password", exception.getMessage());
    }
}
