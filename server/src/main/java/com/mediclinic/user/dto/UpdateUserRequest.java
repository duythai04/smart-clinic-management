package com.mediclinic.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(

        @NotBlank(message = "Họ tên không được để trống")
        @Size(max = 150)
        String fullName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        @Size(max = 150)
        String email,

        @Pattern(
                regexp = "^$|^\\+?[0-9]{9,15}$",
                message = "Số điện thoại không hợp lệ"
        )
        String phone
) {
}