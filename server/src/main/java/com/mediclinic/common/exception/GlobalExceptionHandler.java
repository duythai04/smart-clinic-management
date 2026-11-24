package com.mediclinic.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(
            ResourceNotFoundException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error(404, ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(
            IllegalArgumentException ex
    ) {
        return ResponseEntity
                .badRequest()
                .body(error(400, ex.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleConflict(
            DataIntegrityViolationException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(error(409, "Dữ liệu bị trùng hoặc không hợp lệ"));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleInvalidJson(
            HttpMessageNotReadableException ex
    ) {
        return ResponseEntity
                .badRequest()
                .body(error(400, "Định dạng dữ liệu không hợp lệ"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> errors = new LinkedHashMap<>();

        ex.getBindingResult()
            .getFieldErrors()
            .forEach(fieldError ->
                errors.put(
                    fieldError.getField(),
                    fieldError.getDefaultMessage()
                )
            );

        Map<String, Object> response = error(
            400,
            "Dữ liệu không hợp lệ"
        );

        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    private Map<String, Object> error(
            int status,
            String message
    ) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("success", false);
        response.put("status", status);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now());

        return response;
    }
}