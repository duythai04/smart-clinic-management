package com.mediclinic.security;

import com.mediclinic.user.repository.UserRepository;

import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
        JwtService jwtService,
        UserRepository userRepository
    ) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(

        HttpServletRequest request,

        HttpServletResponse response,

        FilterChain filterChain

    ) throws ServletException, IOException {

        String header = request.getHeader(
            "Authorization"
        );

        if (
            header != null &&
            header.startsWith("Bearer ") &&
            SecurityContextHolder.getContext()
                .getAuthentication() == null
        ) {

            String token = header.substring(7);

            try {

                Long userId = jwtService.extractUserId(token);

                userRepository
                    .findByIdAndActiveTrue(userId)
                    .ifPresent(user -> {

                        var authorities = user.getRoles()

                            .stream()

                            .map(role ->
                                new SimpleGrantedAuthority(
                                    "ROLE_" + role.getName().name()
                                )
                            )

                            .toList();

                        var authentication =
                            new UsernamePasswordAuthenticationToken(
                                user.getId(),
                                null,
                                authorities
                            );

                        SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                    });

            } catch (
                JwtException |
                IllegalArgumentException exception
            ) {

                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}