package com.mediclinic.user.repository;

import com.mediclinic.user.entity.User;
import com.mediclinic.user.enums.RoleName;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    // AUTHENTICATION

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByIdAndActiveTrue(Long id);

    boolean existsByEmail(String email);

    // USER MANAGEMENT

    @EntityGraph(attributePaths = "roles")
    Optional<User> findById(Long id);

    boolean existsByEmailAndIdNot(
            String email,
            Long id
    );

    // SEARCH AND FILTER

    @Query(
            value = """
                SELECT u
                FROM User u
                WHERE (
                    :keyword = ''
                    OR LOWER(u.fullName)
                        LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(u.email)
                        LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR u.phone
                        LIKE CONCAT('%', :keyword, '%')
                )
                AND (
                    :active IS NULL
                    OR u.active = :active
                )
                AND (
                    :role IS NULL
                    OR EXISTS (
                        SELECT r.id
                        FROM User u2
                        JOIN u2.roles r
                        WHERE u2.id = u.id
                        AND r.name = :role
                    )
                )
                """,

            countQuery = """
                SELECT COUNT(u)
                FROM User u
                WHERE (
                    :keyword = ''
                    OR LOWER(u.fullName)
                        LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(u.email)
                        LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR u.phone
                        LIKE CONCAT('%', :keyword, '%')
                )
                AND (
                    :active IS NULL
                    OR u.active = :active
                )
                AND (
                    :role IS NULL
                    OR EXISTS (
                        SELECT r.id
                        FROM User u2
                        JOIN u2.roles r
                        WHERE u2.id = u.id
                        AND r.name = :role
                    )
                )
                """
    )
    Page<User> searchUsers(

            @Param("keyword")
            String keyword,

            @Param("role")
            RoleName role,

            @Param("active")
            Boolean active,

            Pageable pageable
    );
}