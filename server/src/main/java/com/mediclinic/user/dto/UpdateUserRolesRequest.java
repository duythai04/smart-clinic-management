package com.mediclinic.user.dto;

import com.mediclinic.user.enums.RoleName;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record UpdateUserRolesRequest(

        @NotEmpty(message = "Phải chọn ít nhất một vai trò")
        Set<@NotNull RoleName> roles
) {
}