package com.mediclinic.user.dto;

import com.mediclinic.user.entity.User;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public record UserManagementResponse(

        Long id,

        String fullName,

        String email,

        String phone,

        boolean active,

        Set<String> roles,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {

    public static UserManagementResponse from(User user) {

        return new UserManagementResponse(

                user.getId(),

                user.getFullName(),

                user.getEmail(),

                user.getPhone(),

                user.isActive(),

                user.getRoles()
                        .stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet()),

                user.getCreatedAt(),

                user.getUpdatedAt()
        );
    }
}