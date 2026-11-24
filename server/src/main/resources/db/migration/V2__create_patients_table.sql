CREATE TABLE patients (
    id BIGINT NOT NULL AUTO_INCREMENT,

    patient_code VARCHAR(30) NOT NULL,
    full_name VARCHAR(150) NOT NULL,

    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,

    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    identity_number VARCHAR(30),

    address VARCHAR(500),
    blood_type VARCHAR(10),
    allergies TEXT,

    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(20),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME(6) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(6),

    updated_at DATETIME(6) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(6)
        ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),

    CONSTRAINT uk_patients_code
        UNIQUE (patient_code),

    CONSTRAINT uk_patients_identity
        UNIQUE (identity_number),

    INDEX idx_patients_full_name (full_name),
    INDEX idx_patients_phone (phone),
    INDEX idx_patients_active (active)
);