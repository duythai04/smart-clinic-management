package com.mediclinic.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class RefreshTokenService {

    private static final String PREFIX = "mediclinic:refresh:";

    private final SecureRandom secureRandom = new SecureRandom();
    private final StringRedisTemplate redisTemplate;
    private final long expiration;

    public RefreshTokenService(
            StringRedisTemplate redisTemplate,
            @Value("${app.security.refresh-token.expiration}")
            long expiration
    ) {
        this.redisTemplate = redisTemplate;
        this.expiration = expiration;
    }

    public record RefreshTokenData(
            Long userId,
            long sessionVersion
    ) {
    }

    public String create(Long userId, long sessionVersion) {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        String value = userId + ":" + sessionVersion;

        redisTemplate.opsForValue().set(
                PREFIX + hash(token),
                value,
                Duration.ofSeconds(expiration)
        );

        return token;
    }

    public RefreshTokenData consume(String token) {
        if (token == null || token.isBlank()) {
            throw new BadCredentialsException(
                    "Phiên đăng nhập không hợp lệ"
            );
        }

        String value = redisTemplate.opsForValue()
                .getAndDelete(PREFIX + hash(token));

        if (value == null) {
            throw new BadCredentialsException(
                    "Phiên đăng nhập đã hết hạn"
            );
        }

        String[] parts = value.split(":", -1);

        if (parts.length != 2) {
            throw new BadCredentialsException(
                    "Phiên đăng nhập không hợp lệ"
            );
        }

        try {
            Long userId = Long.valueOf(parts[0]);
            long sessionVersion = Long.parseLong(parts[1]);

            if (userId <= 0 || sessionVersion < 0) {
                throw new BadCredentialsException(
                        "Phiên đăng nhập không hợp lệ"
                );
            }

            return new RefreshTokenData(userId, sessionVersion);

        } catch (NumberFormatException exception) {
            throw new BadCredentialsException(
                    "Phiên đăng nhập không hợp lệ"
            );
        }
    }

    public void revoke(String token) {
        if (token != null && !token.isBlank()) {
            redisTemplate.delete(PREFIX + hash(token));
        }
    }

    public long getExpiration() {
        return expiration;
    }

    private String hash(String token) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hashed = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hashed);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "Không thể hash refresh token",
                    exception
            );
        }
    }
}