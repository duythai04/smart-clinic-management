package com.mediclinic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            Environment environment
    ) throws Exception {

        boolean development = environment.acceptsProfiles(
            Profiles.of("dev")
        );

        if (development) {
            http.csrf(csrf -> csrf.ignoringRequestMatchers(
                "/api/v1/patients",
                "/api/v1/patients/**"
            ));
        }

        http.authorizeHttpRequests(auth -> {

            auth.requestMatchers(
                HttpMethod.GET,
                "/api/v1/health",
                "/actuator/health"
            ).permitAll();

            if (development) {
                auth.requestMatchers(
                    "/api/v1/patients",
                    "/api/v1/patients/**"
                ).permitAll();
            }

            auth.anyRequest().denyAll();
        });

        return http.build();
    }
}