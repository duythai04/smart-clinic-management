package com.mediclinic.config;

import com.mediclinic.security.CustomUserDetailsService;
import com.mediclinic.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(
        JwtAuthenticationFilter jwtFilter
    ) {

        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(

        CustomUserDetailsService userDetailsService,

        PasswordEncoder passwordEncoder

    ) {

        DaoAuthenticationProvider provider =
            new DaoAuthenticationProvider(
                userDetailsService
            );

        provider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(provider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http
    ) throws Exception {

        http

            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->

                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .formLogin(form -> form.disable())

            .httpBasic(basic -> basic.disable())

            .logout(logout -> logout.disable())

            .exceptionHandling(exception -> exception

                .authenticationEntryPoint(
                    (request, response, error) -> {

                        response.setStatus(401);

                        response.setContentType(
                            "application/json;charset=UTF-8"
                        );

                        response.getWriter().write(
                            """
                            {
                              "success": false,
                              "message": "Vui lòng đăng nhập"
                            }
                            """
                        );
                    }
                )

                .accessDeniedHandler(
                    (request, response, error) -> {

                        response.setStatus(403);

                        response.setContentType(
                            "application/json;charset=UTF-8"
                        );

                        response.getWriter().write(
                            """
                            {
                              "success": false,
                              "message": "Bạn không có quyền truy cập"
                            }
                            """
                        );
                    }
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Public Health API
                .requestMatchers(

                    HttpMethod.GET,

                    "/api/v1/health",

                    "/actuator/health"

                ).permitAll()

                // Public Authentication APIs
                .requestMatchers(

                    HttpMethod.POST,

                    "/api/v1/auth/login",

                    "/api/v1/auth/refresh",

                    "/api/v1/auth/logout"

                ).permitAll()

                // Current User
                .requestMatchers(

                    HttpMethod.GET,

                    "/api/v1/auth/me"

                ).authenticated()

                // View Patients
                .requestMatchers(

                    HttpMethod.GET,

                    "/api/v1/patients",

                    "/api/v1/patients/**"

                ).hasAnyRole(
                    "ADMIN",
                    "DOCTOR",
                    "RECEPTIONIST"
                )

                // Create Patients
                .requestMatchers(

                    HttpMethod.POST,

                    "/api/v1/patients"

                ).hasAnyRole(
                    "ADMIN",
                    "RECEPTIONIST"
                )

                // Update Patients
                .requestMatchers(

                    HttpMethod.PUT,

                    "/api/v1/patients/**"

                ).hasAnyRole(
                    "ADMIN",
                    "RECEPTIONIST"
                )

                // Disable Patients
                .requestMatchers(

                    HttpMethod.DELETE,

                    "/api/v1/patients/**"

                ).hasRole("ADMIN")

                // Deny APIs not yet implemented
                .anyRequest().denyAll()
            )

            .addFilterBefore(

                jwtFilter,

                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}