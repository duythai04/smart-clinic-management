package com.mediclinic.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(

    @NotBlank(message = "Vui lòng nhập email")
    @Email(message = "Email không hợp lệ")
    @Size(max = 150)
    String email,

    @NotBlank(message = "Vui lòng nhập mật khẩu")
    @Size(max = 72)
    String password

) {
}