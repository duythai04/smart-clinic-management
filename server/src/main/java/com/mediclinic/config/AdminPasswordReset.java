package com.mediclinic.config;

import com.mediclinic.user.entity.User;
import com.mediclinic.user.repository.UserRepository;
import com.mediclinic.user.enums.RoleName;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Component
@Profile("dev & reset-admin")
public class AdminPasswordReset implements CommandLineRunner {

    private static final Logger log =
            LoggerFactory.getLogger(AdminPasswordReset.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${ADMIN_NEW_PASSWORD:}")
    private String newPassword;

    public AdminPasswordReset(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {

        // Validate password
        if (newPassword == null
                || newPassword.isBlank()
                || newPassword.length() < 12
                || newPassword.getBytes(
                        StandardCharsets.UTF_8
                ).length > 72) {

            throw new IllegalStateException(
                    "Mật khẩu mới phải có ít nhất 12 ký tự "
                    + "và tối đa 72 byte"
            );
        }

        // Normalize email
        String email = adminEmail
                .trim()
                .toLowerCase(Locale.ROOT);

        // Find existing account
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Không tìm thấy tài khoản Admin"
                        )
                );

        // Verify ADMIN role
        boolean isAdmin = admin.getRoles()
                .stream()
                .anyMatch(role ->
                        role.getName() == RoleName.ADMIN
                );

        if (!isAdmin) {
            throw new IllegalStateException(
                    "Tài khoản không có quyền ADMIN"
            );
        }

        // Encode new password
        String encodedPassword =
                passwordEncoder.encode(newPassword);

        // Verify generated hash
        if (!passwordEncoder.matches(
                newPassword,
                encodedPassword
        )) {
            throw new IllegalStateException(
                    "Không thể xác minh mật khẩu mới"
            );
        }

        // Update existing account
        admin.setPasswordHash(encodedPassword);

        userRepository.saveAndFlush(admin);

        log.info(
                "========================================"
        );

        log.info(
                "ADMIN PASSWORD RESET SUCCESSFULLY"
        );

        log.info("Admin ID: {}", admin.getId());

        log.info("Admin Email: {}", admin.getEmail());

        log.info(
                "========================================"
        );
    }
}