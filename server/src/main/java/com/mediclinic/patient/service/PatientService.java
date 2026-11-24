package com.mediclinic.patient.service;

import com.mediclinic.patient.entity.Patient;
import com.mediclinic.patient.dto.PatientRequest;
import com.mediclinic.patient.dto.PatientResponse;
import com.mediclinic.patient.repository.PatientRepository;
import com.mediclinic.patient.enums.BloodType;

import com.mediclinic.common.exception.ResourceNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(
            PatientRepository patientRepository
    ) {
        this.patientRepository = patientRepository;
    }

    // Lấy danh sách bệnh nhân

    public Page<PatientResponse> getPatients(
            String keyword,
            Pageable pageable
    ) {

        String search = keyword == null
                ? ""
                : keyword.trim();

        return patientRepository
                .searchPatients(search, pageable)
                .map(this::toResponse);
    }

    // Lấy chi tiết bệnh nhân

    public PatientResponse getPatientById(Long id) {

        Patient patient = findPatient(id);

        return toResponse(patient);
    }

    // Thêm bệnh nhân

    @Transactional
    public PatientResponse createPatient(
            PatientRequest request
    ) {

        String identity = normalize(request.identityNumber());

        if (
            identity != null
            && patientRepository.existsByIdentityNumber(identity)
        ) {
            throw new IllegalArgumentException(
                "Số CCCD đã tồn tại trong hệ thống"
            );
        }

        Patient patient = new Patient();

        patient.setPatientCode(generatePatientCode());

        updateFields(patient, request);

        patient.setActive(true);

        Patient savedPatient = patientRepository.saveAndFlush(patient);

        return toResponse(savedPatient);
    }

    // Cập nhật bệnh nhân

    @Transactional
    public PatientResponse updatePatient(
            Long id,
            PatientRequest request
    ) {

        Patient patient = findPatient(id);

        String identity = normalize(request.identityNumber());

        if (
            identity != null
            && patientRepository
                .existsByIdentityNumberAndIdNot(identity, id)
        ) {
            throw new IllegalArgumentException(
                "Số CCCD đã được sử dụng bởi bệnh nhân khác"
            );
        }

        updateFields(patient, request);

        Patient updatedPatient = patientRepository.saveAndFlush(patient);

        return toResponse(updatedPatient);
    }

    // Soft Delete

    @Transactional
    public void deletePatient(Long id) {

        Patient patient = findPatient(id);

        patient.setActive(false);

        patientRepository.save(patient);
    }

    // Tìm bệnh nhân

    private Patient findPatient(Long id) {

        return patientRepository
                .findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Không tìm thấy bệnh nhân có ID: " + id
                    )
                );
    }

    // Sinh mã bệnh nhân

    private String generatePatientCode() {

        return "BN-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 20)
                .toUpperCase();
    }

    // Chuẩn hóa chuỗi

    private String normalize(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    // Mapping Request -> Entity

    private void updateFields(
            Patient patient,
            PatientRequest request
    ) {

        patient.setFullName(request.fullName().trim());

        patient.setGender(request.gender());

        patient.setDateOfBirth(request.dateOfBirth());

        patient.setPhone(request.phone().trim());

        patient.setEmail(normalize(request.email()));

        patient.setIdentityNumber(
            normalize(request.identityNumber())
        );

        patient.setAddress(normalize(request.address()));

        patient.setBloodType(
            request.bloodType() == null
                ? BloodType.UNKNOWN
                : request.bloodType()
        );

        patient.setAllergies(
            normalize(request.allergies())
        );

        patient.setEmergencyContactName(
            normalize(request.emergencyContactName())
        );

        patient.setEmergencyContactPhone(
            normalize(request.emergencyContactPhone())
        );
    }

    // Mapping Entity -> Response

    private PatientResponse toResponse(Patient patient) {

        return new PatientResponse(

            patient.getId(),

            patient.getPatientCode(),

            patient.getFullName(),

            patient.getGender(),

            patient.getDateOfBirth(),

            patient.getPhone(),

            patient.getEmail(),

            patient.getIdentityNumber(),

            patient.getAddress(),

            patient.getBloodType(),

            patient.getAllergies(),

            patient.getEmergencyContactName(),

            patient.getEmergencyContactPhone(),

            patient.isActive(),

            patient.getCreatedAt(),

            patient.getUpdatedAt()
        );
    }
}