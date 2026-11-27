package com.mediclinic.user.service;

import com.mediclinic.user.dto.CreateUserRequest;
import com.mediclinic.user.dto.RoleResponse;
import com.mediclinic.user.dto.UserManagementResponse;
import com.mediclinic.user.dto.UserPageResponse;

import com.mediclinic.user.entity.Role;
import com.mediclinic.user.entity.User;

import com.mediclinic.user.enums.RoleName;

import com.mediclinic.user.repository.RoleRepository;
import com.mediclinic.user.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


import com.mediclinic.common.exception.ResourceNotFoundException;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;


import java.nio.charset.StandardCharsets;

import com.mediclinic.common.exception.ConflictException;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional(readOnly = true)
public class UserManagementService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    public UserManagementService(

            UserRepository userRepository,

            RoleRepository roleRepository,

            PasswordEncoder passwordEncoder
    ) {

        this.userRepository = userRepository;

        this.roleRepository = roleRepository;

        this.passwordEncoder = passwordEncoder;
    }

    // =========================================
    // GET ALL USERS
    // =========================================

    public UserPageResponse getAllUsers(

            String keyword,

            RoleName role,

            Boolean active,

            int page,

            int size
    ) {

        if (page < 0) {

            throw new IllegalArgumentException(
                    "Số trang không hợp lệ"
            );
        }

        if (size < 1 || size > 100) {

            throw new IllegalArgumentException(
                    "Kích thước trang phải từ 1 đến 100"
            );
        }

        String searchKeyword = keyword == null
                ? ""
                : keyword.trim();

        Pageable pageable = PageRequest.of(

                page,

                size,

                Sort.by(
                        Sort.Order.desc("createdAt"),
                        Sort.Order.desc("id")
                )
        );

        Page<UserManagementResponse> result =
                userRepository.searchUsers(

                        searchKeyword,

                        role,

                        active,

                        pageable

                ).map(UserManagementResponse::from);

        return UserPageResponse.from(result);
    }

    // =========================================
    // GET USER BY ID
    // =========================================

    public UserManagementResponse getUserById(Long id) {

        User user = findUser(id);

        return UserManagementResponse.from(user);
    }

    // =========================================
    // CREATE USER
    // =========================================

    @Transactional
    public UserManagementResponse createUser(
            CreateUserRequest request
    ) {

        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {

            throw new ConflictException(
                    "Email đã được sử dụng"
            );
}

        validatePassword(request.password());

        Set<Role> roles = resolveRoles(request.roles());

        User user = new User();

        user.setFullName(
                request.fullName().trim()
        );

        user.setEmail(email);

        user.setPhone(
                normalizeOptional(request.phone())
        );

        user.setPasswordHash(
                passwordEncoder.encode(request.password())
        );

        user.setActive(true);

        user.setRoles(roles);

        User savedUser =
                userRepository.saveAndFlush(user);

        return UserManagementResponse.from(savedUser);
    }

    // =========================================
    // GET ALL ROLES
    // =========================================

    public List<RoleResponse> getAllRoles() {

        return roleRepository
                .findAll(Sort.by("id").ascending())
                .stream()
                .map(RoleResponse::from)
                .toList();
    }

    // =========================================
    // PRIVATE METHODS
    // =========================================

    private User findUser(Long id) {

        return userRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy nhân viên có ID: " + id
                        )
                );
    }

    private Set<Role> resolveRoles(
            Set<RoleName> roleNames
    ) {

        if (roleNames == null || roleNames.isEmpty()) {

            throw new IllegalArgumentException(
                    "Phải chọn ít nhất một vai trò"
            );
        }

        Set<Role> roles = new HashSet<>();

        for (RoleName roleName : roleNames) {

            Role role = roleRepository
                    .findByName(roleName)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Vai trò không tồn tại: "
                                            + roleName
                            )
                    );

            roles.add(role);
        }

        return roles;
    }

    private String normalizeEmail(String email) {

        return email
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    private String normalizeOptional(String value) {

        if (value == null || value.isBlank()) {

            return null;
        }

        return value.trim();
    }

    private void validatePassword(String password) {

        if (password == null
                || password.isBlank()
                || password.length() < 12) {

            throw new IllegalArgumentException(
                    "Mật khẩu phải có ít nhất 12 ký tự"
            );
        }

        int byteLength = password
                .getBytes(StandardCharsets.UTF_8)
                .length;

        if (byteLength > 72) {

            throw new IllegalArgumentException(
                    "Mật khẩu không được vượt quá 72 byte"
            );
        }
    }
}