package com.mediclinic.user.controller;

import com.mediclinic.user.dto.CreateUserRequest;
import com.mediclinic.user.dto.UserManagementResponse;
import com.mediclinic.user.dto.UserPageResponse;

import com.mediclinic.user.enums.RoleName;

import com.mediclinic.user.service.UserManagementService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserManagementService userService;

    public UserController(
            UserManagementService userService
    ) {

        this.userService = userService;
    }

    // =========================================
    // GET ALL USERS
    // =========================================

    @GetMapping
    public ResponseEntity<UserPageResponse> getAllUsers(

            @RequestParam(defaultValue = "")
            String keyword,

            @RequestParam(required = false)
            RoleName role,

            @RequestParam(required = false)
            Boolean active,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
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

    // =========================================
    // GET USER DETAIL
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<UserManagementResponse>
    getUserById(

            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    // =========================================
    // CREATE USER
    // =========================================

    @PostMapping
    public ResponseEntity<UserManagementResponse>
    createUser(

            @Valid
            @RequestBody
            CreateUserRequest request
    ) {

        UserManagementResponse response =
                userService.createUser(request);

        URI location = URI.create(
                "/api/v1/users/" + response.id()
        );

        return ResponseEntity
                .created(location)
                .body(response);
    }
}