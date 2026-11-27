package com.mediclinic.auth.controller;

import com.mediclinic.auth.dto.AuthResponse;
import com.mediclinic.auth.dto.ChangePasswordRequest;
import com.mediclinic.auth.dto.LoginRequest;
import com.mediclinic.auth.dto.UserResponse;
import com.mediclinic.auth.service.AuthService;
import com.mediclinic.auth.service.RefreshTokenService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final String COOKIE_NAME = "mediclinic_refresh";

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final boolean secureCookie;
    private final String allowedOrigin;

    public AuthController(
            AuthService authService,
            RefreshTokenService refreshTokenService,
            @Value("${app.security.cookie.secure}") boolean secureCookie,
            @Value("${app.security.allowed-origin}") String allowedOrigin
    ) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.secureCookie = secureCookie;
        this.allowedOrigin = allowedOrigin;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = "Origin", required = false)
            String origin,
            @CookieValue(name = COOKIE_NAME, required = false)
            String oldRefreshToken
    ) {
        validateOrigin(origin);

        var session = authService.login(request);

        authService.logout(oldRefreshToken);

        return createResponse(session);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = COOKIE_NAME, required = false)
            String refreshToken,
            @RequestHeader(value = "Origin", required = false)
            String origin
    ) {
        validateOrigin(origin);

        var session = authService.refresh(refreshToken);

        return createResponse(session);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = COOKIE_NAME, required = false)
            String refreshToken,
            @RequestHeader(value = "Origin", required = false)
            String origin
    ) {
        validateOrigin(origin);

        authService.logout(refreshToken);

        return clearCookieResponse();
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        return authService.me(userId);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication,
            @RequestHeader(value = "Origin", required = false)
            String origin,
            @CookieValue(name = COOKIE_NAME, required = false)
            String refreshToken
    ) {
        validateOrigin(origin);

        Long userId = (Long) authentication.getPrincipal();

        authService.changePassword(userId, request);
        authService.logout(refreshToken);

        return clearCookieResponse();
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(
            AuthenticationException exception
    ) {
        return ResponseEntity.status(401)
                .body(Map.of(
                        "success", false,
                        "message",
                        "Thông tin đăng nhập hoặc phiên đăng nhập không hợp lệ"
                ));
    }

    private ResponseEntity<AuthResponse> createResponse(
            AuthService.AuthSession session
    ) {
        ResponseCookie cookie = buildCookie(
                session.refreshToken(),
                refreshTokenService.getExpiration()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(session.response());
    }

    private ResponseEntity<Void> clearCookieResponse() {
        ResponseCookie cookie = buildCookie("", 0);

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    private ResponseCookie buildCookie(String value, long maxAge) {
        return ResponseCookie.from(COOKIE_NAME, value)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/api/v1/auth")
                .maxAge(Duration.ofSeconds(maxAge))
                .build();
    }

    private void validateOrigin(String origin) {
        if (origin != null && !allowedOrigin.equals(origin)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Origin không hợp lệ"
            );
        }
    }
}