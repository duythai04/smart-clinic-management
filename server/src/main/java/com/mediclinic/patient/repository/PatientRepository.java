package com.mediclinic.patient.repository;

import com.mediclinic.patient.entity.Patient;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    Optional<Patient> findByIdAndActiveTrue(Long id);

    boolean existsByIdentityNumber(String identityNumber);

    boolean existsByIdentityNumberAndIdNot(
        String identityNumber,
        Long id
    );

    @Query("""
        SELECT p FROM Patient p
        WHERE p.active = true
        AND (
            :keyword = ''
            OR LOWER(p.fullName)
                LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR p.phone
                LIKE CONCAT('%', :keyword, '%')
            OR LOWER(p.patientCode)
                LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        """)
    Page<Patient> searchPatients(
        @Param("keyword") String keyword,
        Pageable pageable
    );
}