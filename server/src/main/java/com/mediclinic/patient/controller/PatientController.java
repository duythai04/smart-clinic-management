package com.mediclinic.patient.controller;

import com.mediclinic.patient.dto.PatientRequest;
import com.mediclinic.patient.dto.PatientResponse;
import com.mediclinic.patient.service.PatientService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(
            PatientService patientService
    ) {
        this.patientService = patientService;
    }

    // GET /api/v1/patients

    @GetMapping
    public ResponseEntity<?> getPatients(

        @RequestParam(defaultValue = "")
        String keyword,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size

    ) {

        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException(
                "Thông số phân trang không hợp lệ"
            );
        }

        PageRequest pageable = PageRequest.of(
            page,
            size,
            Sort.by("createdAt")
                .descending()
                .and(Sort.by("id").descending())
        );

        Page<PatientResponse> result =
            patientService.getPatients(keyword, pageable);

        return ResponseEntity.ok(
            Map.of(
                "content", result.getContent(),
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
            )
        );
    }

    // GET /api/v1/patients/{id}

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getPatient(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
            patientService.getPatientById(id)
        );
    }

    // POST /api/v1/patients

    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(
            @Valid @RequestBody PatientRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(patientService.createPatient(request));
    }

    // PUT /api/v1/patients/{id}

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponse> updatePatient(

        @PathVariable Long id,

        @Valid @RequestBody PatientRequest request

    ) {

        return ResponseEntity.ok(
            patientService.updatePatient(id, request)
        );
    }

    // DELETE /api/v1/patients/{id}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable Long id
    ) {

        patientService.deletePatient(id);

        return ResponseEntity.noContent().build();
    }
}