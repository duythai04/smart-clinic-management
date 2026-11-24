package com.mediclinic.auth.dto;

import com.mediclinic.user.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public record UserResponse(

    Long id,

    String email,

    String fullName,

    Set<String> roles

) {

    public static UserResponse from(User user) {

        Set<String> roles = user.getRoles()
            .stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toSet());

        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            roles
        );
    }
}