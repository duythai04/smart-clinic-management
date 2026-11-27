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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.passwordEncoder = passwordEncoder;
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

        if (request.password()
                .getBytes(StandardCharsets.UTF_8).length > 72) {

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
                .orElseThrow(() -> new BadCredentialsException(
                        "Thông tin đăng nhập không hợp lệ"
                ));

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        )) {
            throw new BadCredentialsException(
                    "Thông tin đăng nhập không hợp lệ"
            );
        }

        return createSession(user);
    }

    public AuthSession refresh(String refreshToken) {
        RefreshTokenService.RefreshTokenData tokenData =
                refreshTokenService.consume(refreshToken);

        User user = userRepository
                .findByIdAndActiveTrue(tokenData.userId())
                .filter(account ->
                        account.getSessionVersion()
                                == tokenData.sessionVersion()
                )
                .orElseThrow(() -> new BadCredentialsException(
                        "Phiên đăng nhập không hợp lệ"
                ));

        return createSession(user);
    }

    public UserResponse me(Long userId) {
        User user = userRepository
                .findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new BadCredentialsException(
                        "Tài khoản không hợp lệ"
                ));

        return UserResponse.from(user);
    }

    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }

    private AuthSession createSession(User user) {
        String accessToken = jwtService.generateToken(user);

        String refreshToken = refreshTokenService.create(
                user.getId(),
                user.getSessionVersion()
        );

        AuthResponse response = new AuthResponse(
                accessToken,
                "Bearer",
                jwtService.getExpirationSeconds(),
                UserResponse.from(user)
        );

        return new AuthSession(response, refreshToken);
    }
}