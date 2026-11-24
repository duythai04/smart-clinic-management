package com.mediclinic.patient.dto;

import com.mediclinic.patient.enums.Gender;
import com.mediclinic.patient.enums.BloodType;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PatientRequest(

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 150)
    String fullName,

    @NotNull(message = "Vui lòng chọn giới tính")
    Gender gender,

    @NotNull(message = "Ngày sinh không được để trống")
    @PastOrPresent(message = "Ngày sinh không hợp lệ")
    LocalDate dateOfBirth,

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
        regexp = "^\\+?[0-9]{9,15}$",
        message = "Số điện thoại không hợp lệ"
    )
    String phone,

    @Email(message = "Email không hợp lệ")
    @Size(max = 150)
    String email,

    @Size(max = 30)
    String identityNumber,

    @Size(max = 500)
    String address,

    BloodType bloodType,

    @Size(max = 5000)
    String allergies,

    @Size(max = 150)
    String emergencyContactName,

    @Pattern(
        regexp = "^$|^\\+?[0-9]{9,15}$",
        message = "Số điện thoại liên hệ không hợp lệ"
    )
    String emergencyContactPhone

) {}