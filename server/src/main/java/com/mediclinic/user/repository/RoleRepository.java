package com.mediclinic.user.repository;

import com.mediclinic.user.entity.Role;
import com.mediclinic.user.enums.RoleName;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository
        extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleName name);
}