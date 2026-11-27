package com.mediclinic.user.service;

import com.mediclinic.common.exception.ConflictException;
import com.mediclinic.common.exception.ResourceNotFoundException;
import com.mediclinic.user.dto.*;
import com.mediclinic.user.entity.Role;
import com.mediclinic.user.entity.User;
import com.mediclinic.user.enums.RoleName;
import com.mediclinic.user.repository.RoleRepository;
import com.mediclinic.user.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

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

    public UserPageResponse getAllUsers(
            String keyword,
            RoleName role,
            Boolean active,
            int page,
            int size
    ) {
        if (page < 0) {
            throw new IllegalArgumentException("Số trang không hợp lệ");
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Kích thước trang phải từ 1 đến 100"
            );
        }

        String searchKeyword = keyword == null ? "" : keyword.trim();

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Order.desc("createdAt"),
                        Sort.Order.desc("id")
                )
        );

        Page<UserManagementResponse> result = userRepository
                .searchUsers(searchKeyword, role, active, pageable)
                .map(UserManagementResponse::from);

        return UserPageResponse.from(result);
    }

    public UserManagementResponse getUserById(Long id) {
        return UserManagementResponse.from(findUser(id));
    }

    public UserSummaryResponse getSummary() {
        return new UserSummaryResponse(
                userRepository.count(),
                userRepository.countByActiveTrue(),
                userRepository.countByActiveFalse(),
                userRepository.countByRole(RoleName.ADMIN),
                userRepository.countByRole(RoleName.DOCTOR),
                userRepository.countByRole(RoleName.RECEPTIONIST),
                userRepository.countByRole(RoleName.PHARMACIST),
                userRepository.countByRole(RoleName.LAB_TECHNICIAN),
                userRepository.countByRole(RoleName.CASHIER)
        );
    }

    @Transactional
    public UserManagementResponse createUser(CreateUserRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email đã được sử dụng");
        }

        validatePassword(request.password());

        User user = new User();

        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPhone(normalizeOptional(request.phone()));
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setActive(true);
        user.setRoles(resolveRoles(request.roles()));

        return UserManagementResponse.from(
                userRepository.saveAndFlush(user)
        );
    }

    @Transactional
    public UserManagementResponse updateUser(
            Long id,
            UpdateUserRequest request
    ) {
        User user = findUserForUpdate(id);
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailAndIdNot(email, id)) {
            throw new ConflictException("Email đã được sử dụng");
        }

        if (!user.getEmail().equals(email)) {
            user.incrementSessionVersion();
        }

        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPhone(normalizeOptional(request.phone()));

        return UserManagementResponse.from(
                userRepository.saveAndFlush(user)
        );
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public UserManagementResponse updateStatus(
            Long id,
            Long currentUserId,
            UpdateUserStatusRequest request
    ) {
        lockAdminRole();

        User user = findUserForUpdate(id);
        boolean newStatus = request.active();

        if (user.isActive() == newStatus) {
            return UserManagementResponse.from(user);
        }

        if (!newStatus) {
            if (id.equals(currentUserId)) {
                throw new ConflictException(
                        "Không thể tự khóa tài khoản của mình"
                );
            }

            ensureNotLastActiveAdmin(user);
        }

        user.setActive(newStatus);
        user.incrementSessionVersion();

        return UserManagementResponse.from(
                userRepository.saveAndFlush(user)
        );
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public UserManagementResponse updateRoles(
            Long id,
            Long currentUserId,
            UpdateUserRolesRequest request
    ) {
        lockAdminRole();

        User user = findUserForUpdate(id);
        Set<RoleName> newRoleNames = request.roles();

        Set<RoleName> currentRoleNames = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        if (currentRoleNames.equals(newRoleNames)) {
            return UserManagementResponse.from(user);
        }

        boolean removingAdmin =
                currentRoleNames.contains(RoleName.ADMIN)
                        && !newRoleNames.contains(RoleName.ADMIN);

        if (removingAdmin) {
            if (id.equals(currentUserId)) {
                throw new ConflictException(
                        "Không thể tự xóa quyền quản trị viên"
                );
            }

            ensureNotLastActiveAdmin(user);
        }

        user.getRoles().clear();
        user.getRoles().addAll(resolveRoles(newRoleNames));
        user.incrementSessionVersion();

        return UserManagementResponse.from(
                userRepository.saveAndFlush(user)
        );
    }

    @Transactional
    public void resetPassword(
            Long id,
            Long currentUserId,
            ResetPasswordRequest request
    ) {
        if (id.equals(currentUserId)) {
            throw new ConflictException(
                    "Vui lòng sử dụng chức năng đổi mật khẩu cá nhân"
            );
        }

        validatePassword(request.newPassword());

        User user = findUserForUpdate(id);

        if (passwordEncoder.matches(
                request.newPassword(),
                user.getPasswordHash()
        )) {
            throw new IllegalArgumentException(
                    "Mật khẩu mới phải khác mật khẩu hiện tại"
            );
        }

        user.setPasswordHash(
                passwordEncoder.encode(request.newPassword())
        );

        user.incrementSessionVersion();

        userRepository.saveAndFlush(user);
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository
                .findAll(Sort.by("id").ascending())
                .stream()
                .map(RoleResponse::from)
                .toList();
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy nhân viên có ID: " + id
                ));
    }

    private User findUserForUpdate(Long id) {
        return userRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy nhân viên có ID: " + id
                ));
    }

    private void lockAdminRole() {
        roleRepository.findByNameForUpdate(RoleName.ADMIN)
                .orElseThrow(() -> new IllegalStateException(
                        "Vai trò ADMIN chưa được khởi tạo"
                ));
    }

    private void ensureNotLastActiveAdmin(User user) {
        boolean isAdmin = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ADMIN);

        if (user.isActive()
                && isAdmin
                && userRepository.countActiveUsersByRole(RoleName.ADMIN) <= 1) {

            throw new ConflictException(
                    "Hệ thống phải có ít nhất một quản trị viên đang hoạt động"
            );
        }
    }

    private Set<Role> resolveRoles(Set<RoleName> roleNames) {
        if (roleNames == null || roleNames.isEmpty()) {
            throw new IllegalArgumentException(
                    "Phải chọn ít nhất một vai trò"
            );
        }

        Set<Role> roles = new HashSet<>();

        for (RoleName roleName : roleNames) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Vai trò không tồn tại: " + roleName
                    ));

            roles.add(role);
        }

        return roles;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank()
                ? null
                : value.trim();
    }

    private void validatePassword(String password) {
        if (password == null
                || password.isBlank()
                || password.length() < 12) {

            throw new IllegalArgumentException(
                    "Mật khẩu phải có ít nhất 12 ký tự"
            );
        }

        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException(
                    "Mật khẩu không được vượt quá 72 byte"
            );
        }
    }
}