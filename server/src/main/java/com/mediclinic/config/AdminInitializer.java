package com.mediclinic.config;

import com.mediclinic.user.entity.User;
import com.mediclinic.user.enums.RoleName;

import com.mediclinic.user.repository.RoleRepository;
import com.mediclinic.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.boot.CommandLineRunner;

import org.springframework.context.annotation.Profile;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Component
@Profile("dev")
public class AdminInitializer
        implements CommandLineRunner {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final String email;

    private final String password;

    public AdminInitializer(

        UserRepository userRepository,

        RoleRepository roleRepository,

        PasswordEncoder passwordEncoder,

        @Value("${app.admin.email}")
        String email,

        @Value("${app.admin.password}")
        String password

    ) {

        this.userRepository = userRepository;

        this.roleRepository = roleRepository;

        this.passwordEncoder = passwordEncoder;

        this.email = email.trim()
            .toLowerCase(Locale.ROOT);

        this.password = password;
    }

    @Override
    public void run(String... args) {

        if (userRepository.existsByEmail(email)) {
            return;
        }

        if (password.isBlank()) {
            return;
        }

        if (
            password.length() < 12 ||
            password.getBytes(
                StandardCharsets.UTF_8
            ).length > 72
        ) {

            throw new IllegalStateException(
                "ADMIN_PASSWORD phải có ít nhất 12 ký tự và tối đa 72 byte"
            );
        }

        var adminRole = roleRepository

            .findByName(RoleName.ADMIN)

            .orElseThrow(() ->
                new IllegalStateException(
                    "Không tìm thấy ADMIN role"
                )
            );

        User admin = new User();

        admin.setEmail(email);

        admin.setFullName("Quản trị viên MediClinic");

        admin.setPasswordHash(
            passwordEncoder.encode(password)
        );

        admin.setActive(true);

        admin.setRoles(
            new HashSet<>(Set.of(adminRole))
        );

        userRepository.save(admin);

        System.out.println(
            "MediClinic development admin created"
        );
    }
}