package com.mediclinic.patient.dto;

import com.mediclinic.patient.enums.Gender;
import com.mediclinic.patient.enums.BloodType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PatientResponse(

    Long id,

    String patientCode,

    String fullName,

    Gender gender,

    LocalDate dateOfBirth,

    String phone,

    String email,

    String identityNumber,

    String address,

    BloodType bloodType,

    String allergies,

    String emergencyContactName,

    String emergencyContactPhone,

    boolean active,

    LocalDateTime createdAt,

    LocalDateTime updatedAt

) {}