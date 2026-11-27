package com.mediclinic.user.dto;

import com.mediclinic.user.entity.Role;

public record RoleResponse(

        Long id,

        String name,

        String description

) {

    public static RoleResponse from(Role role) {

        return new RoleResponse(

                role.getId(),

                role.getName().name(),

                role.getDescription()
        );
    }
}