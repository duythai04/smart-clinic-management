package com.mediclinic.user.dto;

import com.mediclinic.user.enums.RoleName;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CreateUserRequest(

        @NotBlank(message = "Họ và tên không được để trống")
        @Size(max = 150, message = "Họ tên tối đa 150 ký tự")
        String fullName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        @Size(max = 150)
        String email,

        @Pattern(
                regexp = "^$|^\\+?[0-9]{9,15}$",
                message = "Số điện thoại không hợp lệ"
        )
        String phone,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(
                min = 12,
                max = 72,
                message = "Mật khẩu phải có từ 12 đến 72 ký tự"
        )
        String password,

        @NotEmpty(message = "Phải chọn ít nhất một vai trò")
        Set<@NotNull RoleName> roles

) {
}