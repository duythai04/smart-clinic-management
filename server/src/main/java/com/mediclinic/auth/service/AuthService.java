package com.mediclinic.auth.service;

import com.mediclinic.auth.dto.AuthResponse;
import com.mediclinic.auth.dto.LoginRequest;
import com.mediclinic.auth.dto.UserResponse;

import com.mediclinic.security.JwtService;

import com.mediclinic.user.entity.User;
import com.mediclinic.user.repository.UserRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final RefreshTokenService refreshTokenService;

    public AuthService(

        AuthenticationManager authenticationManager,

        UserRepository userRepository,

        JwtService jwtService,

        RefreshTokenService refreshTokenService

    ) {

        this.authenticationManager = authenticationManager;

        this.userRepository = userRepository;

        this.jwtService = jwtService;

        this.refreshTokenService = refreshTokenService;
    }

    public record AuthSession(

        AuthResponse response,

        String refreshToken

    ) {
    }

    public AuthSession login(LoginRequest request) {

        String email = request.email()

            .trim()

            .toLowerCase(Locale.ROOT);

        if (
            request.password()
                .getBytes(StandardCharsets.UTF_8).length > 72
        ) {

            throw new BadCredentialsException(
                "Thông tin đăng nhập không hợp lệ"
            );
        }

        authenticationManager.authenticate(

            new UsernamePasswordAuthenticationToken(
                email,
                request.password()
            )
        );

        User user = userRepository.findByEmail(email)

            .filter(User::isActive)

            .orElseThrow(() ->
                new BadCredentialsException(
                    "Thông tin đăng nhập không hợp lệ"
                )
            );

        return createSession(user);
    }

    public AuthSession refresh(String refreshToken) {

        Long userId = refreshTokenService.consume(
            refreshToken
        );

        User user = userRepository
            .findByIdAndActiveTrue(userId)

            .orElseThrow(() ->
                new BadCredentialsException(
                    "Phiên đăng nhập không hợp lệ"
                )
            );

        return createSession(user);
    }

    public UserResponse me(Long userId) {

        User user = userRepository
            .findByIdAndActiveTrue(userId)

            .orElseThrow(() ->
                new BadCredentialsException(
                    "Tài khoản không hợp lệ"
                )
            );

        return UserResponse.from(user);
    }

    public void logout(String refreshToken) {

        refreshTokenService.revoke(refreshToken);
    }

    private AuthSession createSession(User user) {

        String accessToken =
            jwtService.generateToken(user);

        String refreshToken =
            refreshTokenService.create(user.getId());

        AuthResponse response = new AuthResponse(

            accessToken,

            "Bearer",

            jwtService.getExpirationSeconds(),

            UserResponse.from(user)
        );

        return new AuthSession(
            response,
            refreshToken
        );
    }
}