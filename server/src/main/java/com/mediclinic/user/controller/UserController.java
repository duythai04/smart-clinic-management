package com.mediclinic.user.controller;

import com.mediclinic.user.dto.*;
import com.mediclinic.user.enums.RoleName;
import com.mediclinic.user.service.UserManagementService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserManagementService userService;

    public UserController(UserManagementService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserPageResponse> getAllUsers(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) RoleName role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                userService.getAllUsers(
                        keyword,
                        role,
                        active,
                        page,
                        size
                )
        );
    }

    @GetMapping("/summary")
    public ResponseEntity<UserSummaryResponse> getSummary() {
        return ResponseEntity.ok(userService.getSummary());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserManagementResponse> getUserById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserManagementResponse> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        UserManagementResponse response =
                userService.createUser(request);

        URI location = URI.create(
                "/api/v1/users/" + response.id()
        );

        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserManagementResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(
                userService.updateUser(id, request)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserManagementResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request,
            Authentication authentication
    ) {
        Long currentUserId = (Long) authentication.getPrincipal();

        return ResponseEntity.ok(
                userService.updateStatus(id, currentUserId, request)
        );
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<UserManagementResponse> updateRoles(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRolesRequest request,
            Authentication authentication
    ) {
        Long currentUserId = (Long) authentication.getPrincipal();

        return ResponseEntity.ok(
                userService.updateRoles(id, currentUserId, request)
        );
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(
            @PathVariable Long id,
            @Valid @RequestBody ResetPasswordRequest request,
            Authentication authentication
    ) {
        Long currentUserId = (Long) authentication.getPrincipal();

        userService.resetPassword(id, currentUserId, request);

        return ResponseEntity.noContent().build();
    }
}