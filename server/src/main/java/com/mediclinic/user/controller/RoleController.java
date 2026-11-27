package com.mediclinic.user.controller;

import com.mediclinic.user.dto.RoleResponse;

import com.mediclinic.user.service.UserManagementService;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    private final UserManagementService userService;

    public RoleController(
            UserManagementService userService
    ) {

        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAllRoles() {

        return ResponseEntity.ok(
                userService.getAllRoles()
        );
    }
}