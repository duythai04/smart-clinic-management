package com.mediclinic.user.repository;

import com.mediclinic.user.entity.User;
import com.mediclinic.user.enums.RoleName;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByIdAndActiveTrue(Long id);

    @Override
    @EntityGraph(attributePaths = "roles")
    Optional<User> findById(Long id);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    long countByActiveTrue();

    long countByActiveFalse();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdForUpdate(@Param("id") Long id);

    @Query("""
            SELECT COUNT(DISTINCT u.id)
            FROM User u
            JOIN u.roles r
            WHERE r.name = :role
            """)
    long countByRole(@Param("role") RoleName role);

    @Query("""
            SELECT COUNT(DISTINCT u.id)
            FROM User u
            JOIN u.roles r
            WHERE u.active = true
            AND r.name = :role
            """)
    long countActiveUsersByRole(@Param("role") RoleName role);

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
            @Param("keyword") String keyword,
            @Param("role") RoleName role,
            @Param("active") Boolean active,
            Pageable pageable
    );
}